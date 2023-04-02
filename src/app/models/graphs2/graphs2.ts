import {Edge} from "./edge";
import {Node} from "./node";

export interface Graphs2 {
  edges: Edge[],
  id: string,
  mapId?: string,
  nodes: Node[]
}
