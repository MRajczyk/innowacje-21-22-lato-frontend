import Konva from "konva";
import {Stand} from "../../../models/stand";

export class StandView {
  public tr: Konva.Transformer | null = null;

  constructor(public model: Stand, public object: Konva.Image) {}
}
