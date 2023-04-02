import Konva from "konva";
import {Node} from "../../../models/graphs2/node";
import {Graph} from "../graph";
import {Vec2} from "../../../math/vec2";
import {NodeType} from "../enums/node-type";
import {MapFactory} from "../map-factory";
import {CoordsTranslator} from "../coords-translator";
import {NodeColors} from "../enums/node-colors";

export class NodeView {
  parent: Graph;
  model: Node;
  object: Konva.Shape;

  constructor(parent: Graph, model: Node, object: Konva.Shape) {
    this.parent = parent;
    this.model = model;
    this.object = object;
  }

  public static objectFromModel(model: Node, coords: CoordsTranslator): Konva.Shape {
    const internalPos = new Vec2(model.posX, model.posY);
    const pixelPos = coords.toPixel(internalPos);

    if (model.type == NodeType.POI)
      return  MapFactory.createVirtualStand(model.id, pixelPos);
    else
      return  MapFactory.createNode(model.id, pixelPos, NodeView.nodeTypeToColor(model.type));
  }

  /**
   W przypadku krawędzi jest tak:
   - POI: 1 (to powinno być automatycznie przypisane do węzła związanego ze stanowiskiem i niezmienialne)
   - Oczekujący: 2
   - Wyjazdowy: 3
   - Normalny: 4
   - Oczekująco - wyjazdowy: 5
   - Skrzyżowanie: 6
   */
  public changeNodeType(type: NodeType) {
    this.object.stroke(NodeView.nodeTypeToColor(type));

    this.model.type = type;
  }

  clone(): NodeView {
    return new NodeView(
      this.parent,
      Object.assign({}, this.model),
      this.object.clone()
    );
  }

  public static nodeTypeToColor(type: NodeType): NodeColors {
    switch(type) {
      case NodeType.Wait:
        return NodeColors.Wait;
      case NodeType.Depart:
        return NodeColors.Depart;
      case NodeType.Normal:
        return NodeColors.Normal;
      case NodeType.WaitAndDepart:
        return NodeColors.WaitAndDepart;
      case NodeType.Crossing:
        return NodeColors.Crossing;
      default:
        return NodeColors.Normal;
    }
  }
}
