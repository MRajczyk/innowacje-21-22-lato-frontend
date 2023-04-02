import { Pose } from "./pose";

export interface Robot {
    available: boolean;
    battery: string;
    batteryLevel: number;
    extraRobotElement: string;
    id: string;
    model: string;
    password?: string;
    pose: Pose;
    robotIp: string;
    status: string;
    timestamp: string;
}
