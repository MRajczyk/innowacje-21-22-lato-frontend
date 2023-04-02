import { Behaviour } from "./behaviour";
import { TaskPriority } from "./task-priority";

export interface TaskTemplate {
    behaviours: Behaviour[];
    id: string;
    kioskId: string;
    mapId: string;
    name: string;
    priority: TaskPriority;
}
