import { Component, OnInit } from '@angular/core';
import {RobotsService} from 'src/app/services/robots.service';
import {MovementService} from 'src/app/services/movement.service';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {FormBuilder} from "@angular/forms";
import {RobotsTasksService} from "../../services/robots-tasks.service";
import {BehaviorSubject, Observable, switchMap} from "rxjs";
import {RobotTask} from "../../models/robot-task";
import {TaskTemplate} from "../../models/task-template";
import {TaskTemplateControllerService} from "../../services/task-template-controller.service";
import {Kiosk} from "../../models/kiosk";
import {KiosksService} from "../../services/kiosks.service";

@Component({
  selector: 'ra-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  readonly STATUS_OK: string = 'OK';
  readonly STATUS_ERROR: string = 'ERROR';
  readonly STATUS_WARNING: string = 'WARNING';

  robotsTasks$: Observable<Array<RobotTask>>;
  refreshRobotTasks$ = new BehaviorSubject<boolean>(true);

  taskTemplates$: Observable<Array<TaskTemplate>>;

  kiosks: Kiosk[] = [];

  constructor(
    private robotsService: RobotsService,
    private movementService: MovementService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private robotsTasksService: RobotsTasksService,
    private taskTemplatesService: TaskTemplateControllerService,
    private kiosksService: KiosksService
  ) {
    this.robotsTasks$ = this.refreshRobotTasks$.pipe(switchMap(_ => this.robotsTasksService.getAll()));
    this.taskTemplates$ = this.taskTemplatesService.getAll();
  }

  ngOnInit(): void {
    this.fetchKiosks();
  }

  fetchRobotsTasks() {
    this.refreshRobotTasks$.next(true);
  }

  fetchKiosks() {
    this.kiosksService.getAll()
      .subscribe(list => {
        this.kiosks = list;
      })
  }

  addTask(template: TaskTemplate) {
    this.taskTemplatesService.addTask(template).subscribe(() => {
      this.fetchRobotsTasks();
    });
  }

  findKioskByTemplate(template: TaskTemplate): Kiosk {
    const foundKiosk = this.kiosks.find(kiosk => kiosk.id === template.kioskId);
    return foundKiosk || {id: '', name: '', standId: ''};
  }
}
