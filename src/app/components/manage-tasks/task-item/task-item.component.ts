import {Component, Input} from '@angular/core';
import {RobotTask} from "../../../models/robot-task";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

export let taskItemIconPaths: string[] = [
  "clock.svg",
  "calendar.svg",
  "dot.svg",
  "home.svg"
];

@Component({
  selector: 'ra-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.sass']
})
export class TaskItemComponent  {

  iconsPath: string = "./assets/task-item-img/";
  iconPathList: string[];

  @Input()
  robotTask: RobotTask = new RobotTask()

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.iconPathList = taskItemIconPaths;

    this.iconPathList.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon.split(".")[0],
        this.domSanitizer.bypassSecurityTrustResourceUrl(this.iconsPath + icon)
      );
    });
  }



}
