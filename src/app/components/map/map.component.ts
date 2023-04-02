import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SecurityContext,
  ViewChild
} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

import Konva from 'konva';

import {MovementService} from "../../services/movement.service";
import {RobotsService} from "../../services/robots.service";
import {Robot} from "../../models/robot";
import {MapMovementData} from "../../models/map-movement-data";
import {StandsService} from "../../services/stands.service";
import {Stand} from "../../models/stand";
import {NodeView} from "./viewmodels/node-view";
import {EditMode} from "./enums/edit-mode";
import {Vec4} from "../../math/vec4";
import {Graph} from "./graph";
import {MapType} from "./enums/map-type";
import {CoordsTranslator} from "./coords-translator";
import {StandView} from "./viewmodels/stand-view";
import {RobotView} from "./viewmodels/robot-view";
import {GraphSettings} from "./graph-settings";
import {Edge} from "../../models/graphs2/edge";
import {NodeType} from "./enums/node-type";
import {MapFactory} from "./map-factory";
import {GraphsService} from "../../services/graphs.service";
import {Graphs2} from "../../models/graphs2/graphs2";
import {EdgeType} from "./enums/edge-type";
import {Vec2} from "../../math/vec2";
import {Vec3} from "../../math/vec3";
import {ParkingType} from "../../models/parking-type";
import {StandType} from "../../models/stand-type";
import {StandStatus} from "../../models/stand-status";
import {Kiosk} from "../../models/kiosk";
import {ParkingTypesService} from "../../services/parking-types.service";
import {StandTypesService} from "../../services/stand-types.service";
import {KiosksService} from "../../services/kiosks.service";
import {EdgeView} from "./viewmodels/edge-view";
import {BehaviorSubject, Observable} from 'rxjs';
import {SettingsService} from "../../services/settings.service";
import {EdgeOptions} from "./enums/edge-options";
import KonvaEventObject = Konva.KonvaEventObject;

@Component({
  selector: 'ra-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass'],
})
export class MapComponent implements AfterViewInit {
  @ViewChild('container', {static: false})
  mapContainer: ElementRef | undefined;

  @ViewChild('nodeContextMenu', {static: false})
  nodeContextMenu: ElementRef | undefined;

  @ViewChild('edgeContextMenu', {static: false})
  edgeContextMenu: ElementRef | undefined;

  @Input()
  type: string = MapType.ActionsMonitor;

  @Output() standChanged = new EventEmitter();

  @Output()
  graphSettingsChanged = new EventEmitter<Partial<GraphSettings>>();

  /***
   * Axis for entities rotation
   */
  public static readonly poseAxis = new Vec3(0, 0, 1);
  public static readonly coordsPrecision = 1000;

  // map state
  private mapId: string | undefined;
  private mapData: MapMovementData | undefined;
  private mapImageB64: string | null | undefined;
  private subMapLoading: BehaviorSubject<boolean>;

  // coordinates translator
  private coords: CoordsTranslator | undefined;

  // Konva layers of all map types
  private stage: Konva.Stage | undefined;
  private floormapLayer: Konva.Layer;

  /**
   * ID generator
   */

  /**
   * Last generated id
   * @private
   */
  private lastId: number = 0;

  /**
   * Generates new id for node/edge. Epoch time based.
   * Almost impossible to create two vertices in the same millisecond but (:
   * @private
   */
  private genId(): number {
    let newId = new Date().getTime();
    if (newId <= this.lastId) {
      newId++;
    }

    this.lastId = newId;
    return newId;
  }

  private svgSize: Vec2;
  private svgSizeSelected: Vec2;

  public displayLegend: boolean = false;

  constructor(
    private movement: MovementService,
    private robotsService: RobotsService,
    private standsService: StandsService,
    private graphsService: GraphsService,
    private parkingTypesService: ParkingTypesService,
    private standTypesService: StandTypesService,
    private kiosksService: KiosksService,
    private sanitizer: DomSanitizer,
    private settingsService: SettingsService,
    private hostRef: ElementRef
  ) {
    this.subMapLoading = new BehaviorSubject<boolean>(true);
    this.floormapLayer = new Konva.Layer({name: 'floormap'});
    this.robotsLayer = new Konva.Layer({
      name: 'robots'
    });
    this.standsLayer = new Konva.Layer({
      name: 'stands'
    });
    this.graphsLayer = new Konva.Layer({
      name: 'graphs'
    });

    this.svgSize = new Vec2(32, 32);
    this.svgSizeSelected = new Vec2(42, 42);
  }

  public ngAfterViewInit() {
    this.loadMap();
  }

  /**
   * Chain loading of map
   * 1. Load map data (id and descriptor)
   * 2. Load map image
   * 3. Put map image
   * 4. Load map objects depending on type
   * 5. Put them on map
   * 6. Enable specific map features
   * @private
   */
  private loadMap() {
    if (this.mapContainer === undefined) {
      console.log('[ra-map] Map container undefined');
      return;
    }

    this.settingsService.getCurrentMap().subscribe(mapSettings => {
      this.mapId = mapSettings.mapId;
      this.loadMapData();
    })
  }

  private loadMapData() {
    if (!this.mapId)
      return;

    this.movement.getMapData(this.mapId).subscribe({
      next: (mapData: MapMovementData) => {
        this.mapData = mapData;
        this.coords = new CoordsTranslator(this.mapData);
        this.loadMapImage();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  private loadMapImage() {
    if (!this.mapId)
      return;

    this.movement.mapDownload(this.mapId).subscribe({
      next: async (data: Blob) => {
        let mapBlob: any
        mapBlob = await this.blobToBase64(data);
        this.mapImageB64 = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(mapBlob));

        this.initStage();
      },
      error: (error: any) => {
        this.subMapLoading.next(false);
        console.log(error);
      }
    })
  }

  public mapLoadingState(): Observable<boolean> {
    return this.subMapLoading.asObservable();
  }

  private async blobToBase64(data: Blob) {
    return new Promise((res) => {
      let reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onloadend = () => {
        res(reader.result);
      }
    })
  }

  private initStage() {
    if (!this.mapContainer || !this.mapImageB64 || !this.coords)
      return;

    const mapNativeElem = this.mapContainer?.nativeElement;

    const stage = new Konva.Stage({
      container: mapNativeElem,
      width: mapNativeElem.offsetWidth,
      height: mapNativeElem.offsetHeight,
      draggable: true
    });

    let defaultScale = 2;
    stage.scale({x: stage!.scaleX() / defaultScale, y: stage!.scaleY() / defaultScale})
    stage.move({x: 0, y: 0})

    let translatedMapOrigin = this.coords.toPixel(new Vec2(0, 0));
    let moveContainerX = translatedMapOrigin.x;
    let moveContainerY = translatedMapOrigin.y;

    stage.move(new Vec2(-moveContainerX / defaultScale + 200, -moveContainerY / defaultScale + stage.height() / 1.5));

    this.stage = stage;
    this.addScalingFeature(stage);

    this.floormapLayer = new Konva.Layer({
      name: 'Floor'
    });

    const img = new Image();
    img.src = this.mapImageB64;

    const floorplan = new Konva.Image({
      image: img
    });
    this.floormapLayer.add(floorplan);

    stage.add(this.floormapLayer);
    this.floormapLayer.draw();

    stage.add(this.robotsLayer);
    this.robotsLayer.listening(false);
    this.standsLayer.listening(false);

    // init frontend
    switch (this.type) {
      case MapType.ActionsMonitor:
        this.fetchStands();
        this.fetchRobots();
        this.displayLegend = true;
        break;
      case MapType.RoutesManager:
        this.fetchStands();
        this.fetchGraphs();
        this.displayLegend = true;

        stage.add(this.graphsLayer);

        stage.on('click', event => this.onNodeAdd(event));

        stage.on('click dragmove wheel', () => {
          if(this.edgeContextMenu)
            MapComponent.hideContextMenu(this.edgeContextMenu);
          if(this.nodeContextMenu)
            MapComponent.hideContextMenu(this.nodeContextMenu);
        })
        break;
      case MapType.StandsManager:
        this.fetchStands();
        this.displayLegend = true;
        this.standsLayer.listening(true);
        break;
      case MapType.RobotViewer:
        this.displayLegend = false;
        break;
      default:
        this.displayLegend = false;
        console.log('[ra-map]: unknown type');
        return;
    }

    stage.add(this.standsLayer);

    this.subMapLoading.next(false);
  }

  private addScalingFeature(stage: Konva.Stage): void {
    const scaleBy = 1.1;
    stage.on('wheel', (e) => {
      // stop default scrolling
      e.evt.preventDefault();

      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      const mousePointTo = {
        // @ts-ignore
        x: (pointer.x - stage.x()) / oldScale,
        // @ts-ignore
        y: (pointer.y - stage.y()) / oldScale,
      };

      // how to scale? Zoom in? Or zoom out?
      let direction = e.evt.deltaY > 0 ? 1 : -1;

      // when we zoom on trackpad, e.evt.ctrlKey is true
      // in that case lets revert direction
      if (e.evt.ctrlKey) {
        direction = -direction;
      }

      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      stage.scale({x: newScale, y: newScale});

      const newPos = {
        // @ts-ignore
        x: pointer.x - mousePointTo.x * newScale,
        // @ts-ignore
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
    });
  }

  private fetchRobots(): void {
    this.robotsService.getAll().subscribe({
      next: (robots) => {
        this.robots = robots;
        this.drawRobots();
      },
      error: (err) => console.log('Error when downloading robots. ' + err)
    });
  }

  private drawRobots() {
    if (!this.mapData || !this.coords || !this.robots)
      return

    this.robotsLayer.destroyChildren();

    for (const robot of this.robots) {
      this.drawRobot(robot);
    }

    this.robotsLayer.draw();
  }

  private drawRobot(robot: Robot) {
    if (!this.mapData || !this.coords || !robot) {
      return
    }

    const posPx = this.coords.toPixel(robot.pose.position);
    const rotation = Vec4.angleOfQuaternion(robot.pose.orientation);
    const img = MapFactory.createRobot(robot.id, posPx, rotation);

    const view = new RobotView(robot, img);
    this.robotViews.push(view);

    this.robotsLayer.add(img);


    this.robotsLayer.draw();
  }

  private fetchStands(): void {
    if(!this.mapData) {
      return;
    }

    this.parkingTypesService.getAll().subscribe(parkingTypes => {
      this.parkingTypes = parkingTypes;
    })

    this.standTypesService.getAll().subscribe(standTypes => {
      this.standTypes = standTypes;
    })

    this.kiosksService.getAll().subscribe(kiosks => {
      this.kiosks = kiosks;
    })

    this.standsService.getStandsOfMap(this.mapData.id).subscribe({
      next: (stands) => {
        this.stands = stands;
        this.drawStands();
      },
      error: (err) => console.log('<ra-map> Error when downloading manage-stands. ' + err)
    });
  }

  private drawStands() {
    if (!this.mapData || !this.coords || !this.stands)
      return;

    this.standViews.length = 0;
    this.standsLayer.destroyChildren();

    for (const stand of this.stands) {
      let standPos = this.coords.toPixel(stand.pose.position);
      let standRot = Vec4.angleOfQuaternion(stand.pose.orientation);

      const img = MapFactory.createStand(stand.id, standPos, standRot, stand.standType.type, false, e => this.onStandDragMove(e));

      const standView = new StandView(stand, img);
      this.standViews.push(standView);

      this.standsLayer.add(img);
    }

    this.standsLayer.draw();
  }

  /**
   * actions-monitor data
   */

    // layers
  private readonly robotsLayer: Konva.Layer;
  private readonly standsLayer: Konva.Layer;
  private readonly graphsLayer: Konva.Layer;

  // data from API
  public robots: Array<Robot> = [];

  // views
  // noinspection JSMismatchedCollectionQueryUpdate
  private robotViews: Array<RobotView> = [];

  /**
   * routes-manager data
   */

  public graphEditMode: EditMode = EditMode.NoEdit;

  public readonly graphsEditModesOptions = [
    {
      label: 'Wskaż wierzchołki',
      value: 'vertices'
    },
    {
      label: 'Wyznacz krawędzie',
      value: 'edges'
    }
  ]

  public graphs: Graphs2[] = [];

  private graphViews: Map<string, Graph> = new Map();

  private selectedGraph: Graph | null = null;

  public selectedGraphEdited: boolean = false;

  private editedGraphNew: boolean = false;

  private selectedGraphNodeObj: Konva.Node | null = null;

  private selectedGraphNode: NodeView | undefined;

  public selectedGraphNodeType: NodeType = NodeType.Normal;

  private selectedGraphEdge: EdgeView | undefined;

  public selectedGraphEdgeOptions: EdgeOptions = {
    active: false,
    bidirectional: false,
    narrow: false
  };


  /**
   * Descriptors of Node radio button types
   */
  public readonly nodeTypesDesc = [
    {
      name: "Normalny",
      value: NodeType.Normal
    },
    {
      name: "Skrzyżowanie",
      value: NodeType.Crossing
    },
    {
      name: "Oczekująco-wyjazdowy",
      value: NodeType.WaitAndDepart
    },
    {
      name: "Wyjazdowy",
      value: NodeType.Depart
    },
    {
      name: "Oczekujący",
      value: NodeType.Wait
    }
  ];

  /**
   * routes-manager functions
   */

  private fetchGraphs() {
    if(!this.mapId)
      return;

    this.graphsService.getGraphsOfMap(this.mapId).subscribe({
      next: (graphs) => {
        this.graphs = graphs;
        this.drawGraphs();
      },
      error: (err) => {
        console.log('[ra-map] error fetching graphs');
        console.log(err);
      }
    })
  }

  /**
   * Inits graph. Adds virtual manage-stands. When model specified initializes with it.
   * @param graph Target graph
   * @param model Model of graph. Optional
   */
  private initGraph(graph: Graph, model?: Graphs2) {
    if(!this.coords)
      return;

    graph.clean();

    graph.initVirtualStands(this.stands, this.coords, n => this.bindNodeEvents(n));

    if(model) {
      graph.initModel(model, this.coords,
        n => this.bindNodeEvents(n),
        e => this.bindEdgeEvents(e)
      );
    }
  }

  /**
   * Initializes graphs with models and draws it
   */
  private drawGraphs() {
    if(!this.coords || !this.mapData)
      return;

    for(const model of this.graphs) {
      const graph = new Graph(model.id, this.mapData.id);
      this.initGraph(graph, model);

      this.graphViews.set(model.id, graph);

      this.graphsLayer.add(graph.container);
      graph.container.hide();
      graph.container.listening(false);
    }
  }

  private static showContextMenu(cm: ElementRef, relPos: Vec2) {
    const ne = cm.nativeElement;
    ne.style.visibility = 'visible';
    ne.style.top = relPos.y + 'px';
    ne.style.left = relPos.x + 'px';
  }

  public static hideContextMenu(cm: ElementRef | undefined) {
    if(cm)
      cm.nativeElement.style.visibility = 'hidden';
  }

  private static isLMB(event: any): boolean {
    /*
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
      return false;
    } else if ('buttons' in event) {
      return event.buttons === 1;
    } else if ('which' in event) {
      return event.which === 1;
    } else {
      return (event.button == 1 || event.type == 'click');
    }
    */

    // TODO: multiplatform LMB check
    return event.button === 0;
  }

  public selectGraph(id: string): boolean {
    if(!this.stage)
      return false;

    if (this.selectedGraph) {
      if (this.selectedGraphEdited)
        return false;

      if (this.selectedGraph.model.id !== id)
        this.unselectGraph();
      else
        return true;
    }

    const graph = this.graphViews.get(id);
    if (!graph)
      return false;

    graph.container.show();

    this.selectedGraph = graph;
    return true;
  }

  public unselectGraph() {
    if (!this.selectedGraph || this.selectedGraphEdited)
      return

    this.selectedGraph.container.hide();
    this.selectedGraph = null;
  }

  /**
   * Adds newly created graph to local variables and draws it
   * @param id Id (and name simultaneously) of graph
   */
  public addGraph(id?: string): string | undefined {
    if (this.selectedGraphEdited || !this.stage || !this.coords || !this.mapData)
      return;

    if(!id)
      id = this.genId().toString();

    let graph = new Graph(id, this.mapData.id);
    this.initGraph(graph);

    this.graphViews.set(id, graph);
    this.editedGraphNew = true;

    this.graphsLayer.add(graph.container);
    graph.container.hide();
    graph.container.listening(false);

    this.selectGraph(id);
    return id;
  }

  public deleteGraph(id: string) {
    if(this.selectedGraphEdited) {
      return;
    }

    this.graphsService.deleteById(id).subscribe(
      () => {
        const graphToDelete = this.graphViews.get(id);
        if(graphToDelete) {
          graphToDelete.container.destroy();
          this.graphViews.delete(id);
        }

        const graphToDeleteIdx = this.graphs.findIndex(elem => elem.id === id);
        if(graphToDeleteIdx >= 0) {
          this.graphs.splice(graphToDeleteIdx, 1);
        }

        if(this.selectedGraph && this.selectedGraph.id === id) {
          this.selectedGraph.container.destroy();
          this.selectedGraph = null;
        }

        this.selectedGraphEdited = false;
        this.editedGraphNew = false;
        this.graphEditMode = EditMode.NoEdit;
      }
    )
  }

  public editGraph(id: string, newGraph: boolean) {
    if(!this.selectGraph(id))
      return;

    if(!this.selectedGraph || !this.stage)
      return;

    // hide original
    const original = this.selectedGraph;
    original.container.listening(false);
    original.container.hide();

    // show clone
    const clone = this.selectedGraph.clone();
    this.graphsLayer.add(clone.container);
    clone.container.listening(true);
    clone.container.show();

    // select clone
    this.selectedGraph = clone;
    this.selectedGraphEdited = true;
    this.editedGraphNew = newGraph;
    this.graphEditMode = EditMode.Vertices;

    this.graphSettingsChanged.emit({
      name: clone.id
    });
  }

  public selectedGraphId() {
    return this.selectedGraph?.id;
  }

  public isSelectedGraphEdited() {
    return this.selectedGraphEdited;
  }

  public updateGraphSettings(settings: GraphSettings) {
    if(!this.selectedGraph || !this.selectedGraphEdited)
      return;

    this.selectedGraph.id = settings.name;
    this.selectedGraph.model.id = settings.name;
    this.selectedGraph.container.setAttr('id', settings.name);

    // TODO: update corridor width etc.
  }

  public saveEditedGraph() {
    if (!this.selectedGraph)
      return;

    // prepare model for whole graph
    const model = this.selectedGraph.model;

    const oldGraph = this.graphViews.get(this.selectedGraph.id);
    const modelIdx = this.graphs.findIndex(elem => elem.id === model.id);

    // if(new || cannot find original)
    if (this.editedGraphNew || (!oldGraph || modelIdx < 0)) {
      this.graphsService.add(model).subscribe({
        next: () => {
          if (!this.selectedGraph)
            return;

          if (oldGraph)
            oldGraph.container.destroy();

          // replace graph with changes
          this.graphViews.set(this.selectedGraph.id, this.selectedGraph);
          this.graphs.push(model);

          // keep selection, freeze graph, clear flags
          this.selectedGraph.container.listening(false)
          this.selectedGraphEdited = false;
          this.editedGraphNew = false;
          this.graphEditMode = EditMode.NoEdit;
          this.selectedGraphNodeObj = null;
          if(this.edgeContextMenu)
            MapComponent.hideContextMenu(this.edgeContextMenu);
          if(this.nodeContextMenu)
            MapComponent.hideContextMenu(this.nodeContextMenu);
        }
      });

      return;
    }

    this.graphsService.update(model).subscribe(
      () => {
        if (!this.selectedGraph)
          return;

        if (oldGraph)
          oldGraph.container.destroy();

        // replace graph with changes
        this.graphViews.set(this.selectedGraph.id, this.selectedGraph);

        // update model in graphs data
        if (modelIdx >= 0)
          this.graphs[modelIdx] = model;

        // keep selection, freeze graph, clear flags
        this.selectedGraph.container.listening(false)
        this.selectedGraphEdited = false;
        this.editedGraphNew = false;
        this.graphEditMode = EditMode.NoEdit;
        this.selectedGraphNodeObj = null;

        if(this.edgeContextMenu)
          MapComponent.hideContextMenu(this.edgeContextMenu);
        if(this.nodeContextMenu)
          MapComponent.hideContextMenu(this.nodeContextMenu);
      }
    )
  }



  public discardEditedGraph() {
    if (!this.selectedGraph)
      return;

    // destroy clone
    this.selectedGraph.container.destroy();

    // show and select original (if exists...)
    const original = this.graphViews.get(this.selectedGraph.id);
    if(original) {
      this.selectedGraph = original
      original.container.show();
      original.container.listening(false);
    }
    else {
      this.selectedGraph = null;
    }

    // set flags
    this.selectedGraphEdited = false;
    this.editedGraphNew = false;
    this.graphEditMode = EditMode.NoEdit;
    this.selectedGraphNodeObj = null;
    if(this.edgeContextMenu)
      MapComponent.hideContextMenu(this.edgeContextMenu);
    if(this.nodeContextMenu)
      MapComponent.hideContextMenu(this.nodeContextMenu);
  }

  /**
   * Updates edges connected to node
   * @param movedNode View-model of node
   * @param nodeDeleted specifies whether node was moved or deleted
   * @private
   */
  private updateEdgesOfNode(movedNode: NodeView, nodeDeleted: Boolean) {
    if (this.selectedGraph == null)
      return;

    if(nodeDeleted) {
      let connectedEdges = this.selectedGraph.edges.filter(edge => (
        edge.begin === movedNode || edge.end === movedNode
      ));

      for (const edge of connectedEdges) {
        const line = edge.object;

        let deletedEdgeIdx = this.selectedGraph.edges.findIndex(nodeElem => nodeElem.model.id == edge.model.id);
        let deletedEdgeModelIdx = this.selectedGraph.edges.findIndex(nodeElem => nodeElem.model.id == edge.model.id);

        line.destroy();
        this.selectedGraph.edges.splice(deletedEdgeIdx, 1);
        this.selectedGraph.model.edges.splice(deletedEdgeModelIdx, 1);
      }
    }

    let connectedEdges = this.selectedGraph.edges.filter(edge => (
      edge.begin === movedNode || edge.end === movedNode
    ));

    for (const edge of connectedEdges) {
      const line = edge.object;
      const beginObjPos = edge.begin.object.position();
      const endObjPos = edge.end.object.position();

      if (beginObjPos === undefined || endObjPos === undefined)
        continue;

      line.points([beginObjPos.x, beginObjPos.y, endObjPos.x, endObjPos.y]);
    }
  }

  private bindNodeEvents(node: NodeView) {
    const obj = node.object;

    obj.on('click', e => this.onEdgeAdd(e));
    obj.on('dragmove', e => this.onNodeMove(e));
    obj.on('contextmenu', e => this.onNodeContextmenu(e));
  }

  private onNodeContextmenu(event: KonvaEventObject<MouseEvent>) {
    event.evt.preventDefault();

    if(!this.selectedGraphEdited || !this.nodeContextMenu)
      return;

    if (this.selectedGraph) {
      let clickedNodeObject = this.selectedGraph.nodes.find(node => node.object.id() === event.target.id());
      if (clickedNodeObject && clickedNodeObject.model.poiID !== '') {
        return;
      }
    }

    const pp = this.stage?.getPointerPosition();

    if(pp) {
      this.selectedGraphNode = this.selectedGraph?.nodes.find(
        node => node.object === event.target
      )

      if(this.selectedGraphNode) {
        this.selectedGraphNodeType = this.selectedGraphNode.model.type;
        MapComponent.showContextMenu(this.nodeContextMenu, pp);
      }
      else {
        MapComponent.hideContextMenu(this.nodeContextMenu);
        MapComponent.hideContextMenu(this.edgeContextMenu);
      }
    }
  }

  private onNodeAdd(event: KonvaEventObject<MouseEvent>) {
    if (!this.selectedGraph || !this.coords || (this.graphEditMode !== EditMode.Vertices))
      return;

    if (!(event.target instanceof Konva.Image) || !MapComponent.isLMB(event.evt))
      return;

    const pointerPos = event.target.getRelativePointerPosition();
    const internalPos = this.coords.toInternal(pointerPos);

    const model = {
      id: this.genId().toString(),
      poiID: '',
      type: NodeType.Normal,
      posX: internalPos.x,
      posY: internalPos.y,
    };

    const node = this.selectedGraph.addNode(model, this.coords);
    this.bindNodeEvents(node);
  }

  onNodeDelete() {
    if (!this.selectedGraph || !this.selectedGraphEdited || !this.coords || !this.selectedGraphNode) {
      return;
    }

    let deletedNode = this.selectedGraph.nodes.find(nodeElem => nodeElem.model.id == this.selectedGraphNode?.model.id);
    let deletedNodeIdx = this.selectedGraph.nodes.findIndex(nodeElem => nodeElem.model.id == this.selectedGraphNode?.model.id);
    let deletedNodeModelIdx = this.selectedGraph.nodes.findIndex(nodeElem => nodeElem.model.id == this.selectedGraphNode?.model.id);

    if (deletedNode === undefined)
      return;

    this.updateEdgesOfNode(deletedNode, true);

    this.selectedGraphNode?.object.destroy();
    this.selectedGraph.nodes.splice(deletedNodeIdx, 1);
    this.selectedGraph.model.nodes.splice(deletedNodeModelIdx, 1);

    this.selectedGraphNode = undefined;
    MapComponent.hideContextMenu(this.nodeContextMenu);
  }

  onNodeMove(event: KonvaEventObject<MouseEvent>) {
    if (!this.selectedGraph || !this.selectedGraphEdited || !this.coords) {
      return;
    }

    let movedNode = this.selectedGraph.nodes.find(nodeElem => nodeElem.model.id == event.target.id());

    if (movedNode === undefined)
      return;

    const internalPos = this.coords.toInternal(movedNode.object.position());

    if (this.graphEditMode === EditMode.NoEdit) {
      event.target.setPosition(this.coords.toPixel(new Vec2(movedNode.model.posX, movedNode.model.posY)));
    } else {
      movedNode.model.posX = internalPos.x;
      movedNode.model.posY = internalPos.y;
    }

    this.updateEdgesOfNode(movedNode, false);
  }

  onNodeTypeChanged(event: Event) {
    if(this.selectedGraph && this.selectedGraphNode) {
      this.selectedGraphNode.changeNodeType(parseInt((event.target as HTMLInputElement).value));
      this.selectedGraphNodeType = this.selectedGraphNode.model.type;

      if(this.selectedGraphNodeType === NodeType.Normal) {
        this.selectedGraphEdge = this.selectedGraph.edges.find((edge => edge.begin.model.id == this.selectedGraphNode?.model.id || edge.end.model.id == this.selectedGraphNode?.model.id));
        if (this.selectedGraphEdge) {
          this.selectedGraphEdgeOptions = EdgeType.toOptions(this.selectedGraphEdge.model.type, this.selectedGraphEdge.model.isActive);
          this.onEdgeTypeChange(true);
        }
      }
    }
  }

  private bindEdgeEvents(edge: EdgeView) {
    edge.object.on('contextmenu', e => this.onEdgeContextmenu(e));
  }

  onEdgeContextmenu(event: KonvaEventObject<MouseEvent>) {
    event.evt.preventDefault();

    if(!this.selectedGraphEdited || !this.edgeContextMenu)
      return;

    const pp = this.stage?.getPointerPosition();

    const edge = this.selectedGraph?.edges.find(
      edge => edge.object === event.target
    );

    if(pp && edge)  {
      this.selectedGraphEdge = edge;
      this.selectedGraphEdgeOptions = EdgeType.toOptions(edge.model.type, edge.model.isActive)

      MapComponent.showContextMenu(this.edgeContextMenu, pp);
    }
  }

  onEdgeAdd(event: KonvaEventObject<MouseEvent>) {
    if (!this.selectedGraph || !this.selectedGraphEdited || (this.graphEditMode != EditMode.Edges))
      return;

    if (!MapComponent.isLMB(event.evt))
      return;

    if (!this.selectedGraphNodeObj || this.selectedGraphNodeObj.id() === event.target.id()) {
      this.selectedGraphNodeObj = event.target as Konva.Circle;
      return;
    }

    const model: Edge = {
      id: this.genId().toString(),
      isActive: true,
      startNode: this.selectedGraphNodeObj.id(),
      endNode: event.target.id(),
      type: EdgeType.fromOptions({
        active: true,
        bidirectional: true,
        narrow: false
      })
    };

    const edgeFromTargetNode = this.selectedGraph.edges.find((edge => edge.begin.model.id == event.target.id() || edge.end.model.id == event.target.id()));
    const edgeFromSourceNode = this.selectedGraph.edges.find((edge => edge.begin.model.id == this.selectedGraphNodeObj!.id() || edge.end.model.id == this.selectedGraphNodeObj!.id()));

    const edge = this.selectedGraph.addEdge(model);
    if (edge) {
      this.bindEdgeEvents(edge);
    }

    const srcNode = this.selectedGraph.nodes.find(node => node.model.id == this.selectedGraphNodeObj?.id());
    const targetNode = this.selectedGraph.nodes.find(node => node.model.id == event.target.id());

    if(edgeFromSourceNode && srcNode && srcNode.model.type === NodeType.Normal) {
      this.selectedGraphEdgeOptions = EdgeType.toOptions(edgeFromSourceNode.model.type, edgeFromSourceNode.model.isActive);
      this.selectedGraphEdge = edge;
      this.onEdgeTypeChange(true);
    }
    else if(edgeFromTargetNode && targetNode && targetNode.model.type === NodeType.Normal) {
      this.selectedGraphEdgeOptions = EdgeType.toOptions(edgeFromTargetNode.model.type, edgeFromTargetNode.model.isActive);
      this.selectedGraphEdge = edge;
      this.onEdgeTypeChange(true);
    }

    this.selectedGraphNodeObj = null;
  }

  onEdgeDelete() {
    if (!this.selectedGraph || !this.selectedGraphEdited || !this.coords || !this.selectedGraphEdge) {
      return;
    }

    let deletedEdge = this.selectedGraph.edges.find(edgeElem => edgeElem.model.id == this.selectedGraphEdge?.model.id);
    let deletedEdgeIdx = this.selectedGraph.edges.findIndex(edgeElem => edgeElem.model.id == this.selectedGraphEdge?.model.id);
    let deletedEdgeModelIdx = this.selectedGraph.edges.findIndex(edgeElem => edgeElem.model.id == this.selectedGraphEdge?.model.id);

    if (deletedEdge === undefined)
      return;

    this.selectedGraphEdge?.object.destroy();
    this.selectedGraph.edges.splice(deletedEdgeIdx, 1);
    this.selectedGraph.model.edges.splice(deletedEdgeModelIdx, 1);

    this.selectedGraphEdge = undefined;
    this.selectedGraphEdgeOptions = {
      active: false,
      bidirectional: false,
      narrow: false
    };
    MapComponent.hideContextMenu(this.edgeContextMenu);
  }

  /**
   * When changed edge type toggle
   */
  private visitedEdges: Array<EdgeView> = [];

  onEdgeTypeChange(invoking: Boolean) {
    if(!this.selectedGraph || !this.selectedGraphEdge)
      return;

    this.selectedGraphEdge.change(this.selectedGraphEdgeOptions);
    this.visitedEdges.push(this.selectedGraphEdge);

    const originalSelectedEdge = this.selectedGraphEdge;
    if(this.selectedGraphEdge?.begin.model.type === NodeType.Normal) {
      this.selectedGraph?.edges.forEach((edge) => {
        if(edge === originalSelectedEdge || this.visitedEdges.findIndex(edg => edg === edge) !== -1) {
          return;
        }
        else if(edge.begin === originalSelectedEdge?.begin || edge.end === originalSelectedEdge?.begin) {
          if(edge.begin === originalSelectedEdge?.begin) {
            this.reverseEdge(edge);
          }
          this.selectedGraphEdge = edge;
          this.onEdgeTypeChange(false);
        }
      });
    }

    this.selectedGraphEdge = originalSelectedEdge;
    if(this.selectedGraphEdge?.end.model.type === NodeType.Normal) {
      this.selectedGraph?.edges.forEach((edge) => {
        if (edge === originalSelectedEdge || this.visitedEdges.findIndex(edg => edg === edge) !== -1) {
          return;
        } else if (edge.begin === originalSelectedEdge?.end || edge.end === originalSelectedEdge?.end) {
          if(edge.end === originalSelectedEdge?.end) {
            this.reverseEdge(edge);
          }
          this.selectedGraphEdge = edge;
          this.onEdgeTypeChange(false);
        }
      });
    }

    if(invoking) {
      this.selectedGraphEdge = originalSelectedEdge;
      this.visitedEdges.length = 0;
    }
  }

  /**
   * manage-stands-manager data/functions
   */

  public parkingTypes: Array<ParkingType> = [];
  public standTypes: Array<StandType> = [];
  public kiosks: Array<Kiosk> = [];
  public stands: Array<Stand> = [];
  private standViews: Array<StandView> = [];

  private selectedStand: StandView | null = null;
  private selectedStandEdited: boolean = false;
  private editedStandNew: boolean = false;

  public onStandDragMove(event: KonvaEventObject<MouseEvent>) {
    if (!this.coords || !this.selectedStand)
      return;

    const kvObj = this.selectedStand.object

    if (event.target !== kvObj)
      return;

    const posPx = kvObj.position()
    const posInt = this.coords.toInternal(posPx)

    this.standChanged.emit({
      x: Math.round(posInt.x * MapComponent.coordsPrecision) / MapComponent.coordsPrecision,
      y: Math.round(posInt.y * MapComponent.coordsPrecision) / MapComponent.coordsPrecision,
      orientation: Math.round(kvObj.rotation() * MapComponent.coordsPrecision) / MapComponent.coordsPrecision - MapFactory.ROTATION_OFFSET_DEGREES
    })

    this.selectedStand.model.pose.position = new Vec3(posInt.x, posInt.y, 0)

    this.selectedStand.model.pose.orientation = Vec4.quaternion(
      MapComponent.poseAxis,
      kvObj.rotation() - MapFactory.ROTATION_OFFSET_DEGREES
    )
  };

  onEdgeReverse() {
    if (!this.selectedGraph || !this.selectedGraphEdited || !this.coords || !this.selectedGraphEdge) {
      return;
    }

    this.reverseEdge(this.selectedGraphEdge);
    this.onEdgeTypeChange(true);
  }

  reverseEdge(edgeToReverse: EdgeView) {
    if (!this.selectedGraph || !this.selectedGraphEdited || !this.coords || !edgeToReverse) {
      return;
    }

    let revEdge = this.selectedGraph.edges.find(edgeElem => edgeElem.model.id == edgeToReverse.model.id);
    let revEdgeIdx = this.selectedGraph.edges.findIndex(edgeElem => edgeElem.model.id == edgeToReverse.model.id);
    let revEdgeModelIdx = this.selectedGraph.edges.findIndex(edgeElem => edgeElem.model.id == edgeToReverse.model.id);

    if (revEdge === undefined)
      return;

    const startingNodePositions = revEdge.object.points();
    revEdge.object.points([startingNodePositions[2], startingNodePositions[3], startingNodePositions[0], startingNodePositions[1]]);

    let tempNodeView = this.selectedGraph.edges[revEdgeIdx].begin;
    this.selectedGraph.edges[revEdgeIdx].begin = this.selectedGraph.edges[revEdgeIdx].end;
    this.selectedGraph.edges[revEdgeIdx].end = tempNodeView;

    let tempNodeId = this.selectedGraph.model.edges[revEdgeModelIdx].startNode;
    this.selectedGraph.model.edges[revEdgeModelIdx].startNode = this.selectedGraph.model.edges[revEdgeModelIdx].endNode;
    this.selectedGraph.model.edges[revEdgeModelIdx].endNode = tempNodeId;
  }

  public selectedStandId() {
    return this.selectedStand?.model.id;
  }

  /**
   * Unselects stand when not in edition mode.
   * @private
   */
  private unselectStand() {
    if (!this.selectedStand || this.selectedStandEdited)
      return

    // @ts-ignore
    const stand = this.standViews.find(elem => elem.model.id === this.selectedStand.model.id);
    if (!stand)
      return;

    const kvObj = stand.object;

    kvObj.getAttr('image').onload = function () {
      stand.object._requestDraw()
    };
    kvObj.getAttr('image').setAttribute('src', '/assets/map/stand' + stand.model.standType.type + '.svg');
    kvObj.setAttr('offsetX', this.svgSize.x / 2)
    kvObj.setAttr('offsetY', this.svgSize.y / 2)

    this.selectedStand = null;
  }

  /**
   * Unselects selected stand and selects new. When in edition mode does nothing.
   * @param id Id should be existing. When non-existing only unselects previous stand.
   * @private
   */
  public selectStand(id: string): boolean {
    if (this.selectedStand) {
      if (this.selectedStandEdited)
        return false;

      if (this.selectedStand.model.id !== id)
        this.unselectStand();
    }

    const stand = this.standViews.find(elem => elem.model.id === id);
    if (!stand)
      return false;

    const kvObj = stand.object;
    kvObj.getAttr('image').onload = function () {
      stand.object._requestDraw()
    };
    kvObj.getAttr('image').setAttribute('src', '/assets/map/selected-stand' + stand.model.standType.type + '.svg');
    kvObj.setAttr('offsetX', this.svgSizeSelected.x / 2)
    kvObj.setAttr('offsetY', this.svgSizeSelected.y / 2)

    this.selectedStand = stand;
    return true;
  }

  public addStand(): string | undefined {
    if (this.selectedStandEdited || !this.coords || !this.mapData)
      return

    this.unselectStand();

    const posInt = new Vec3(0, 0, 0);
    const rotation = 0;
    const posPx = this.coords.toPixel(posInt);
    const id = this.genId().toString();

    const img = MapFactory.createStand(id, posPx, rotation, 0,
      true, e => this.onStandDragMove(e));

    const model: Stand = {
      id: id,
      name: '',
      pose: {
        position: posInt,
        orientation: Vec4.quaternion(
          MapComponent.poseAxis,
          rotation
        )
      },
      parkingType: new ParkingType('', ''),
      standType: new StandType('', '', 0),
      standStatus: new StandStatus('', ''),
      kioskId: '',
      mapId: this.mapData?.id,
    }

    this.selectedStand = new StandView(model, img);
    this.selectedStandEdited = true;
    this.editedStandNew = true;

    this.standsLayer.add(img);

    let tr = MapFactory.createTransformer();
    tr.nodes([img]);

    this.standsLayer.add(tr);
    tr.on('dragmove transform', e => this.onStandDragMove(e));
    this.selectedStand!.tr = tr;

    this.standChanged.emit({
      name: model.name,
      parkingType: model.parkingType.id,
      standType: model.standType.id,
      kiosk: model.kioskId,
      x: posInt.x,
      y: posInt.y,
      orientation: rotation
    })

    return id;
  }

  /**
   * Sends delete request to API and removes local data without getAll request.
   * @param id
   */
  public deleteStand(id: string) {
    if(this.selectedStandEdited) {
      return;
    }

    this.standsService.deleteById(id).subscribe(() => {
      const standIdx = this.stands.findIndex(elem => elem.id === id);
      if (standIdx >= 0)
        this.stands.splice(standIdx, 1)

      const standViewIdx = this.standViews.findIndex(elem => elem.model.id === id);
      this.standViews[standViewIdx].object.destroy();
      this.standViews.splice(standViewIdx, 1);
    })
  }

  public editStand(id: string) {
    if (!this.selectStand(id))
      return;

    const model: Stand = Object.assign({}, this.selectedStand!.model)
    const object: Konva.Image = this.selectedStand!.object.clone();

    const clone = new StandView(model, object);
    this.selectedStand!.object.hide();
    this.standsLayer.add(object);

    // replace selected original/clone
    this.selectedStand = clone;
    this.selectedStandEdited = true;
    this.editedStandNew = false;

    let tr = MapFactory.createTransformer();
    tr.nodes([object]);

    this.selectedStand!.object.setAttr('draggable', true);
    this.standsLayer.add(tr);
    this.selectedStand!.tr = tr;
    tr.on('dragmove transform', e => this.onStandDragMove(e));

    this.standChanged.emit({
      name: model.name,
      parkingType: model.parkingType.id,
      standType: model.standType.id,
      kiosk: model.kioskId,
      x: model.pose.position.x,
      y: model.pose.position.y,
      orientation: object.rotation() - MapFactory.ROTATION_OFFSET_DEGREES
    })
  }

  /**
   * Move edited stand
   * @param x Position in pixels
   * @param y Position in pixels
   * @param rotation Rotation in degrees, clockwise.
   */
  public moveEditedStand(x: number, y: number, rotation: number) {
    if (!this.coords)
      return;

    // if not selected or selected & not edited
    if (!this.selectedStand || !this.selectedStandEdited)
      return;

    const posPx = this.coords.toPixel(new Vec2(x, y));

    this.selectedStand.object.setPosition(posPx);
    this.selectedStand.object.rotation(rotation);

    const pose = this.selectedStand.model.pose;
    pose.position.x = x;
    pose.position.y = y;
    pose.orientation = Vec4.quaternion(
      MapComponent.poseAxis,
      rotation
    );
  }

  public saveEditedStand() {
    if (!this.selectedStand || !this.selectedStandEdited)
      return;

    const oriStandView = this.standViews.find(elem => elem.model.id === this.selectedStand?.model.id)
    const oriStandIdx = this.stands.findIndex(elem => elem.id === this.selectedStand?.model.id)

    // if(new || cannot find original)
    if (this.editedStandNew || (!oriStandView || oriStandIdx < 0)) {
      this.standsService.addStand(this.selectedStand.model).subscribe({
        next: () => {
          if(!this.selectedStand)
            return;

          this.standViews.push(this.selectedStand);
          this.stands.push(this.selectedStand.model);

          this.selectedStand.tr?.destroy();
          this.selectedStand.object.setAttr('draggable', false);
          this.selectedStandEdited = false;
        },
        error: (error) => {
          console.log(error);

          if(!this.selectedStand)
            return;

          this.selectedStand.tr?.destroy();
          this.selectedStand.object.destroy();

          this.selectedStand = null;
          this.selectedStandEdited = false;
        },
      });

      return;
    }

    this.standsService.updateStand(this.selectedStand.model).subscribe({
      next: () => {
        if(!this.selectedStand)
          return;

        // lock object & destroy transformer
        this.selectedStand.object.setAttr('draggable', false);
        this.selectedStand.tr?.destroy();

        // patch view-model
        oriStandView.model = this.selectedStand.model;
        oriStandView.object.destroy();
        oriStandView.object = this.selectedStand.object;

        // replace model
        this.stands.splice(oriStandIdx, 1, this.selectedStand.model);

        // select original & stop edition
        this.selectedStand = oriStandView;
        this.selectedStandEdited = false;
      },
      error: (error) => {
        console.log(error);

        if(!this.selectedStand)
          return;

        this.selectedStand.object.destroy();
        this.selectedStand.tr?.destroy();

        this.selectedStand = oriStandView;
        this.selectedStandEdited = false;
      }
    });
  }

  public discardEditedStand() {
    if (!this.selectedStand || !this.selectedStandEdited)
      return;

    this.selectedStand.tr?.destroy();
    this.selectedStand.object.destroy();

    if (this.editedStandNew) {
      this.selectedStand = null;
      this.editedStandNew = false;
    }
    else {
      // un-hide original
      const originalStand = this.standViews.find(elem => elem.model.id === this.selectedStand?.model.id)

      if (originalStand) {
        originalStand.object.show();
        originalStand.object.setAttr('draggable', false);
        this.selectedStand = originalStand
      }
    }

    this.selectedStandEdited = false;
  }

  changeStandDetails(standName: string, parkingTypeId: string, standTypeId: string, kioskId: string): void {
    if (!this.selectedStand) {
      return
    }

    this.selectedStand.model.name = standName;

    let tmpParkingType = this.parkingTypes.find(parkType => parkType.id === parkingTypeId);
    if (tmpParkingType) {
      this.selectedStand.model.parkingType = tmpParkingType;
    }

    let tmpStandType = this.standTypes.find(standType => standType.id === standTypeId);
    if (tmpStandType) {
      this.selectedStand.model.standType = tmpStandType;
    }

    this.selectedStand.model.kioskId = kioskId;
  }

  /**
   * robot-viewer functions
   */

  public selectRobot(robot: Robot | undefined, focus: Boolean) {
    this.robotsLayer.destroyChildren();
    if(robot) {
      this.drawRobot(robot);
      if(focus && this.coords && this.stage) {
        const posPx = this.coords.toPixel(robot.pose.position);
        const center = new Vec2(-(posPx.x), -(posPx.y));
        const offset = new Vec2(this.hostRef.nativeElement.offsetWidth / 2, this.hostRef.nativeElement.offsetHeight / 2);

        this.stage.scale(new Vec2(1,1))
        this.stage.position(new Vec2(Math.floor(center.x) + offset.x, Math.floor(center.y) + offset.y));
      }
    }
  }
}
