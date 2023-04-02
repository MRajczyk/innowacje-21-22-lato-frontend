import Konva from "konva";
import {Vec2} from "../../math/vec2";
import {Injectable} from "@angular/core";
import {EdgeColor} from "./enums/edge-color";
import KonvaEventListener = Konva.KonvaEventListener;
import {NodeColors} from "./enums/node-colors";
import {EdgeType} from "./enums/edge-type";

@Injectable({
  providedIn: "root"
})
export class MapFactory {
  static readonly ROTATION_OFFSET_DEGREES = 90;

  static createRobot(id: string, position: Vec2, rotation: number): Konva.Image {
    let imgElem = new Image();
    imgElem.src = '/assets/map/robot.svg';

    const svgSize = new Vec2(26, 38);

    return new Konva.Image({
      image: imgElem,
      x: position.x,
      y: position.y,
      offsetX: svgSize.x * 0.5,
      offsetY: svgSize.y * 0.5,
      scale: {
        x: 1.5,
        y: 1.5
      },
      rotation: rotation + this.ROTATION_OFFSET_DEGREES
    });
  }

  static createNode(id: string, position: Vec2, nodeColor: NodeColors): Konva.Circle {
    return new Konva.Circle({
      id: id,
      x: position.x,
      y: position.y,
      fill: '#FFFFFF',
      radius: 12,
      stroke: nodeColor,
      strokeWidth: 8,
      draggable: true
    });
  }

  static createEdge(id: string, isActive: boolean, type: number, start: Vec2, end: Vec2): Konva.Line | Konva.Arrow {
    const color = EdgeColor.fromType(type, isActive);

    const options = {
      id: id,
      points: [start.x, start.y, end.x, end.y],
      fill: color,
      stroke: color,
      strokeWidth: EdgeType.displayedWidth(type)
    }

    if(type == EdgeType.ONEWAY)
      return new Konva.Arrow(Object.assign(options, {
        pointerLength: 30,
        pointerWidth: 30,
        closed: true
      }))
    else
      return new Konva.Line(options);
  }

  static createStand(id: string, position: Vec2, rotation: number, type: number, draggable: boolean, handlerDragMove: KonvaEventListener<Konva.Image, MouseEvent>) {
    let imgElem = new Image();
    imgElem.setAttribute('src', '/assets/map/stand' + type + '.svg');
    imgElem.setAttribute('alt', 'stand');

    const scale = 1.5;
    const svgSize = new Vec2(32, 32);

    let retVal = new Konva.Image({
      id: id,
      image: imgElem,
      x: position.x,// - svgSize.x * 0.5 * scale,
      y: position.y,// - svgSize.y * 0.5 * scale,
      offsetX: svgSize.x * 0.5,// * scale,
      offsetY: svgSize.y * 0.5,// * scale,
      scale: new Vec2(scale, scale),
      rotation: rotation + this.ROTATION_OFFSET_DEGREES,
      draggable: draggable
    });

    retVal.on('dragmove', handlerDragMove);

    return retVal;
  }

  static createVirtualStand(id: string, position: Vec2): Konva.Circle {
    return new Konva.Circle({
      id: id,
      x: position.x,
      y: position.y,
      fill: 'rgba(1,0,0,0.01)',
      radius: 30,
      draggable: false
    })
  }

  static createTransformer(resize: boolean = false): Konva.Transformer {
    return new Konva.Transformer({
      anchorStroke: '#487BFF',
      anchorFill: '#FFFFFF',
      anchorSize: 20,
      borderStroke: '#487BFF',
      resizeEnabled: resize
    });
  }
}
