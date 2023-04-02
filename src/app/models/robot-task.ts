import {Robot} from "./robot";
import {TaskPriority} from "./task-priority";
import {StatusType} from "./status-type";
import {Behaviour} from "./behaviour";

export class RobotTask {
  id: string = "";
  robot?: Robot | {} | null;
  name: string = "";
  behaviours: Behaviour[] = [];
  startTime: string = "";
  priority: TaskPriority = {id: '', name: '', weight: 0};
  status: StatusType = new StatusType();
  userID: string = "";

  public constructor(init?:Partial<RobotTask>) {
    Object.assign(this, init);
  }
}
