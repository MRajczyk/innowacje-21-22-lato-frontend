import Konva from "konva";
import {Robot} from "../../../models/robot";

export class RobotView {
  constructor(public model: Robot, public object: Konva.Image) {}
}
