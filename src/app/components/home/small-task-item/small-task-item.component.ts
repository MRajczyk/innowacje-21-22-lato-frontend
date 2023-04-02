import {Component, Input} from '@angular/core';
import {RobotTask} from "../../../models/robot-task";

@Component({
  selector: 'ra-small-task-item',
  templateUrl: './small-task-item.component.html',
  styleUrls: ['./small-task-item.component.sass']
})
export class SmallTaskItemComponent {

  @Input()
  robotTask: RobotTask = new RobotTask()

  constructor() { }
}
