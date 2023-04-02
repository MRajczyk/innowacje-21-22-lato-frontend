import {EdgeView} from "./viewmodels/edge-view";
import {NodeView} from "./viewmodels/node-view";
import Konva from "konva";
import {Node} from "../../models/graphs2/node";
import {CoordsTranslator} from "./coords-translator";
import {Edge} from "../../models/graphs2/edge";
import {Graphs2} from "../../models/graphs2/graphs2";
import {NodeType} from "./enums/node-type";
import {Stand} from "../../models/stand";

type NodeEventsCallback = (node: NodeView) => any;
type EdgeEventsCallback = (edge: EdgeView) => any;

export class Graph {
  id: string;
  container: Konva.Group
  model: Graphs2
  nodes: Array<NodeView> = [];
  edges: Array<EdgeView> = [];

  /**
   * Creates blank graph with given id.
   * Graph modification makes synchronized model inside of graph.
   * @param id
   * @param mapId
   */
  constructor(id: string, mapId: string) {
    this.id = id;

    this.container = new Konva.Group({
      id: id
    });

    this.model = {
      id: id,
      mapId: mapId,
      edges: [],
      nodes: []
    }
  }

  /**
   * Adds node of model to graph. Model is not copied!
   * @param model Model of node to add.
   * @param coords Coords translator of current map.
   */
  public addNode(model: Node, coords: CoordsTranslator): NodeView {
    const node = new NodeView(this, model, NodeView.objectFromModel(model, coords));

    this.model.nodes.push(model);
    this.nodes.push(node);
    this.container.add(node.object);
    return node;
  }

  /**
   * Adds edge of model to graph. Model is not copied!
   * @param model Model of edge to add.
   */
  public addEdge(model: Edge): EdgeView | undefined {
    //if such edge exists, don't add it and return undef
    if(this.edges.find((edge) => (
      edge.model.startNode === model.startNode && edge.model.endNode === model.endNode)
      || (edge.model.endNode === model.startNode && edge.model.startNode === model.endNode))
      ) {
      return undefined;
    }

    const edge = new EdgeView(model, this.nodes);

    this.edges.push(edge);
    this.model.edges.push(model);
    this.container.add(edge.object);
    edge.object.zIndex(0);

    return edge;
  }

  public clean() {
    this.model.nodes = [];
    this.nodes.forEach(node => node.object.destroy());
    this.nodes = [];

    this.model.edges = [];
    this.edges.forEach(edge => edge.object.destroy());
    this.edges = [];
  }

  public initModel(model: Graphs2, coords: CoordsTranslator,
                   nodeEvt: NodeEventsCallback, edgeEvt: EdgeEventsCallback) {
    // rewrite id
    this.id = model.id;
    this.model = model;
    this.container.setAttr('id', model.id);

    // add nodes
    model.nodes.forEach(node => {
      const view = new NodeView(this, node, NodeView.objectFromModel(node, coords));
      this.nodes.push(view);
      this.container.add(view.object);
      nodeEvt(view);
    });

    // add edges
    model.edges.forEach(edge => {
      const view = new EdgeView(edge, this.nodes);
      this.edges.push(view);
      this.container.add(view.object);
      view.object.zIndex(0);
      edgeEvt(view);
    });
  }

  /**
   * Add manage-stands as virtual nodes (type: POI).
   * @param stands Stand views.
   * @param coords CoordsTranslator of map.
   * @param nodeEvt Stand nodes event binding handler.
   */
  public initVirtualStands(stands: Stand[], coords: CoordsTranslator, nodeEvt: NodeEventsCallback
  ) {
    for (const stand of stands) {
      const model = {
        id: 'v' + stand.id,
        poiID: stand.id,
        posX: stand.pose.position.x,
        posY: stand.pose.position.y,
        type: NodeType.POI
      }

      const existing = this.nodes.find(n => n.model.poiID === stand.id);

      // TODO: virtual stand position update should be done on backend
      if (existing) {
        Object.assign(existing.model, model)
        const posPx = coords.toPixel(stand.pose.position)
        existing.object.position(posPx)
      }
      else {
        const view = this.addNode(model, coords)
        nodeEvt(view);
      }
    }
  }

  public clone(): Graph {
    const graph = new Graph(this.model.id, this.model.mapId ? this.model.mapId : '');

    const model = graph.model;
    model.mapId = this.model.mapId;

    // clone node views
    this.nodes.forEach(node => {
      const clone = node.clone();
      model.nodes.push(clone.model);
      graph.nodes.push(clone);
      graph.container.add(clone.object);
    })

    // clone edges views
    this.edges.forEach(edge => {
      const clone = edge.clone(graph.nodes);
      model.edges.push(clone.model);
      graph.edges.push(clone);
      graph.container.add(clone.object);
      clone.object.zIndex(0);
    })

    return graph;
  }
}
