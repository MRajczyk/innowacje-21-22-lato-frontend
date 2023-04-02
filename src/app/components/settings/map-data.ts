import {MapSettings} from "../../models/map-settings";
import {Graphs2} from "../../models/graphs2/graphs2";

export class MapData{
  mapChanged: boolean = false;
  graphChanged: boolean = false;
  currentMap: MapSettings | null;
  currentGraph: Graphs2 | null;

  constructor(mapChanged?: boolean, graphChanged?: boolean, currentMap?: MapSettings, currentGraph?: Graphs2) {
    this.mapChanged = mapChanged ?? false;
    this.graphChanged = graphChanged ?? false;
    this.currentMap = currentMap ?? null;
    this.currentGraph = currentGraph ?? null;
  }
}
