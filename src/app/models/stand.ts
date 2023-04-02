import { ParkingType } from "./parking-type";
import { Pose } from "./pose";
import { StandStatus } from "./stand-status";
import { StandType } from "./stand-type";

export interface Stand {
  id: string;
  name: string;
  pose: Pose;
  parkingType: ParkingType;
  standType: StandType;
  standStatus: StandStatus;
  kioskId: string;
  mapId: string;
}
