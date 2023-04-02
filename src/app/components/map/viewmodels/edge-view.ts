import Konva from "konva";
import {Edge} from '../../../models/graphs2/edge'
import {NodeView} from "./node-view";
import {MapFactory} from "../map-factory";
import {EdgeOptions} from "../enums/edge-options";
import {EdgeType} from "../enums/edge-type";

export class EdgeView {
  model: Edge;
  object: Konva.Line | Konva.Arrow;

  nodesSet: NodeView[];
  begin: NodeView;
  end: NodeView;

  constructor(model: Edge, nodes: NodeView[], object?: Konva.Line | Konva.Arrow) {
    this.model = model;

    const begin = nodes.find(node => node.model.id === model.startNode);
    const end = nodes.find(node => node.model.id === model.endNode);

    if (!begin || !end)
      throw new Error('EdgeView: begin or end view not exists');

    this.nodesSet = nodes;
    this.begin = begin;
    this.end = end;

    if(object)
      this.object = object.clone();
    else
      this.object = MapFactory.createEdge(model.id, model.isActive, model.type, begin.object.position(), end.object.position());
  }

  change(options: EdgeOptions) {
    // update model
    const model = this.model;
    model.type = EdgeType.fromOptions(options);
    model.isActive = options.active;

    // get old object data
    const parent = this.object.parent;
    const ev = this.object.eventListeners;
    this.object.destroy();

    // create new
    this.object = MapFactory.createEdge(
      model.id, model.isActive, model.type,
      this.begin.object.position(), this.end.object.position()
    );
    for(const listener of ev['contextmenu']) {
      // @ts-ignore
      this.object.on('contextmenu', listener.handler)
    }

    // add to previous parent
    parent?.add(this.object);
    this.object.zIndex(0);
  }

  clone(nodesSet: NodeView[]): EdgeView {
    return new EdgeView(
      Object.assign({}, this.model),
      nodesSet,
      this.object
    );
  }
}
