import {Component, EventEmitter, OnInit, Output} from '@angular/core';

import {MapMovementData} from "../../../models/map-movement-data";
import {MapSettings} from "../../../models/map-settings";
import {Graphs2} from "../../../models/graphs2/graphs2";

import {SettingsService} from "../../../services/settings.service";
import {GraphsService} from "../../../services/graphs.service";
import {MovementService} from "../../../services/movement.service";
import {MapData} from "../map-data";

@Component({
  selector: 'ra-settings-maps',
  templateUrl: './settings-maps.component.html',
  styleUrls: ['./settings-maps.component.sass']
})
export class SettingsMapsComponent implements OnInit {
  mapsData: MapMovementData[] = [];

  currentMap: MapSettings = {
    graphId: "0",
    mapId: "0",
    origin : [0, 0, 0],
    size : [0, 0]
  };

  graphs: Graphs2[] = [];

  currentGraph: Graphs2 = {
    id: "",
    mapId: "",
    nodes: [],
    edges: []
  };

  @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  onMapChanged = new EventEmitter();

  mapChanged: boolean = false;
  graphChanged: boolean = false;

  constructor(
    private settingsService: SettingsService,
    private graphsService: GraphsService,
    private movementService: MovementService
  ) {
  }

  ngOnInit(): void {

    this.onGetCurrentMap();
    this.onGetMaps();
  }

  onGetMaps(){
    this.movementService.getAllMapsData()
      .subscribe(mapsData => {
        this.mapsData = mapsData;
        let search: MapMovementData | undefined = mapsData.find((map) => {
          return map.id === this.currentMap.mapId;
        })
        if(search !== undefined)
          this.onCurrentMapChange(search);
      })
  }

  onGetCurrentMap(){
    this.settingsService.getCurrentMap()
      .subscribe(currentMap => {
        this.currentMap = currentMap;
      })
  }

  onGetGraphs(mapId: string){
    this.graphsService.getGraphsOfMap(mapId)
      .subscribe(graphs => {
        this.graphs = graphs;
        console.log(graphs);
      })
  }

  onGetCurrentGraph(graphId: string){
    this.graphsService.getGraph(graphId)
      .subscribe(graph => {
        this.currentGraph = graph
        console.log(graph);
      })
  }

  onCurrentMapChange(event: MapMovementData){
    this.currentMap.mapId = event.id;
    this.currentMap.size = event.size;
    this.currentMap.resolution = event.resolution;
    this.currentMap.origin = event.origin;

    this.onGetGraphs(this.currentMap.mapId);
    if(this.currentMap.graphId !== "" || this.currentMap.graphId == null){
      this.onGetCurrentGraph(this.currentMap.graphId);
    }

    this.mapChanged = true;
  }

  onCurrentGraphChange(event: Graphs2){
    this.currentGraph.mapId = event.mapId;
    this.currentGraph.id = event.id;
    this.currentGraph.edges = event.edges;
    this.currentGraph.nodes = event.nodes;

    this.graphChanged = true;

    if (this.graphChanged && this.mapChanged) {
      let mapData = new MapData(this.mapChanged, this.graphChanged, this.currentMap, this.currentGraph);
      this.onMapChanged.emit(mapData);
    }
  }

  identify(index: any, item: Graphs2) {
    return item.id
  }
}
