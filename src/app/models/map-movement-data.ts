export interface MapMovementData {
  id: string;
  name: string;
  free_thresh: number;
  negate: number;
  occupied_thresh: number;
  origin: [number, number, number];
  size: [number, number];
  resolution: number;
  version: number;
}
