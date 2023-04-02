import {Component, Input, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {taskItemIconPaths} from "../../manage-tasks/task-item/task-item.component";
import {Kiosk} from "../../../models/kiosk";
import {TaskTemplate} from "../../../models/task-template";
import {RobotsTasksService} from "../../../services/robots-tasks.service";
import {RobotTask} from "../../../models/robot-task";

@Component({
  selector: 'ra-template-item',
  templateUrl: './template-item.component.html',
  styleUrls: ['./template-item.component.sass']
})
export class TemplateItemComponent implements OnInit {

  iconsPath: string = "./assets/task-item-img/";
  iconPathList: string[] = [...taskItemIconPaths, "dot.svg", "home.svg"];

  @Input()
  taskTemplate: TaskTemplate;
  @Input()
  templateKiosk: Kiosk = {id: '', name: '', standId: ''};

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private robotsTasksService: RobotsTasksService
  ) {
    this.taskTemplate = {
      behaviours: [],
      id: '',
      kioskId: '',
      mapId: '',
      name: '',
      priority: {
        id: '',
        name: '',
        weight: 0
      }
    }
  }

  ngOnInit() {
    this.iconPathList.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon.split(".")[0],
        this.domSanitizer.bypassSecurityTrustResourceUrl(this.iconsPath + icon)
      );
    });
  }

  orderTask(taskTemplate: TaskTemplate) {
    const task: RobotTask = new RobotTask({
        name: taskTemplate.name,
        behaviours: taskTemplate.behaviours,
        priority: taskTemplate.priority,
        status: {name: "To Do", id: "0", weight: 1}, //todo: placeholder
        robot: {}
      }
    )

    this.robotsTasksService.addTask(task).subscribe();
  }
}
