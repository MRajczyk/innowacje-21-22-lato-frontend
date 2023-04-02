import {MapMovementData} from "../../models/map-movement-data";
import {Vec2} from "../../math/vec2";

export class CoordsTranslator {
  constructor(private mapData: MapMovementData) {}

  /**
   * Converts pixel-based coordinates to internal API coordinates.
   * @param position Position in pixels
   */
  public toInternal(position: Vec2): Vec2 {
    // (value * this.mapResolution + origin);
    return new Vec2(
      (position.x * this.mapData.resolution + this.mapData.origin[0]),
      ((position.y * this.mapData.resolution + this.mapData.origin[1])) * (-1)
    )
  }

  /**
   * Converts internal API coordinates to pixel based coordinates
   * @param position Position from API
   */
  public toPixel(position: Vec2): Vec2 {
    return new Vec2(
      (position.x - this.mapData.origin[0]) * (1 / this.mapData.resolution),
      (position.y * (-1) - this.mapData.origin[1]) * (1 / this.mapData.resolution)
    );
  }
}
