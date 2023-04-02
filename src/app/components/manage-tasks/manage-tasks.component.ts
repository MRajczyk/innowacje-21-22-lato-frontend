import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {RobotTask} from "../../models/robot-task";
import {RobotsTasksService} from "../../services/robots-tasks.service";
import {TaskPriority} from "../../models/task-priority";
import {TaskPriorityControllerService} from "../../services/task-priority-controller.service";
import {StatusType} from "../../models/status-type";
import {Behaviour} from "../../models/behaviour";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {BehaviorSubject, combineLatest, interval, map, Observable, switchMap} from "rxjs";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import * as dayjs from "dayjs";

export let taskSectionIconPaths: string[] = [
  "filter-button.svg",
  "edit.svg",
  "bin.svg",
  "save.svg",
  "add.svg"
];

export enum sortingTypes {
  None,
  Priority,
  Name,
  Date,
}

@Component({
  selector: 'ra-manage-tasks',
  templateUrl: './manage-tasks.component.html',
  styleUrls: ['./manage-tasks.component.sass']
})
export class ManageTasksComponent implements OnInit {

  @ViewChild('taskFiltersDialog') taskFiltersDialog!: TemplateRef<any>;

  iconsPath: string = "./assets/tasks-section/"
  iconPathList: string[];

  taskForm: FormGroup;
  taskFormEdit: boolean = false;
  taskFormStatus: StatusType = new StatusType();
  taskFormPriority: StatusType = {id: '', name: '', weight: 0};

  robotsTasks$: Observable<Array<RobotTask>>;
  filteredRobotsTask$: Observable<Array<RobotTask>>;
  refreshRobotTasks$ = new BehaviorSubject<boolean>(true);

  taskStatues: StatusType[] = [
    {name: "To Do", id: "0", weight: 1}
  ];
  taskPriorities: TaskPriority[] = [];

  behaviours: Behaviour[] = [];
  sequences: Behaviour[] = [];

  filterDialogForm: FormGroup;
  filterRef?: MatDialogRef<any, any>;
  sortAsc: boolean = true;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private robotsTasksService: RobotsTasksService,
    private taskPriorityController: TaskPriorityControllerService,
    private dialog: MatDialog
  ) {
    this.iconPathList = taskSectionIconPaths;

    this.iconPathList.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon.split(".")[0],
        this.domSanitizer.bypassSecurityTrustResourceUrl(this.iconsPath + icon)
      );
    });
    this.robotsTasks$ = this.refreshRobotTasks$.pipe(switchMap(_ => this.robotsTasksService.getAll()));

    this.filterDialogForm = this.formBuilder.group({
      name: [null],
      startDate: [null],
      endDate: [null],
      priority: [null],
      status: [null],
      sorting: [sortingTypes.Priority]
    });

    this.filteredRobotsTask$ = combineLatest([this.robotsTasks$]).pipe(
      map(([tasks]) => {

        const filterValues = this.filterDialogForm.getRawValue();
        if (filterValues.name !== null)
          tasks = tasks.filter((item) => item.name.includes(filterValues.name))
        if (filterValues.priority !== null)
          tasks = tasks.filter((item) => item.priority.id === filterValues.priority.id);

        if (filterValues.startDate !== null)
          tasks = tasks.filter((item) => dayjs(item.startTime).isAfter(dayjs(filterValues.startDate)))
        if (filterValues.endDate !== null)
          tasks = tasks.filter((item) => dayjs(item.startTime).isBefore(dayjs(filterValues.endDate)))

        switch (filterValues.sorting) {
          case sortingTypes.None:
            break;
          case sortingTypes.Name:
            tasks = tasks.sort((a, b) => (this.sortAsc ? -1 : 1) * a.name.localeCompare(b.name));
            break;
          case sortingTypes.Priority:
            tasks = tasks.sort((a, b) => {
              const weightA = a.priority.weight;
              const weightB = b.priority.weight;
              return this.sortAsc ? weightA - weightB : weightB - weightA;
            });
            break;
          case sortingTypes.Date:
            tasks = tasks.sort((a, b) => {
              const timeA = dayjs(a.startTime).millisecond();
              const timeB = dayjs(b.startTime).millisecond();
              return (this.sortAsc ? timeA - timeB : timeB - timeA);
            })
        }

        return tasks;
      })
    )

    this.taskForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      behaviours: [[]],
      userID: [''],
      startTime: [''],
      priority: [TaskPriority, [Validators.required]],
      status: [StatusType, [Validators.required]],
      robot: [{}]
    });
  }

  ngOnInit(): void {
    interval(15000).pipe(
      map(() => this.fetchRobotsTasks())
    ).subscribe()

    this.fetchPriorityStatues();
  }

  onTaskDelete(task: RobotTask) {
    this.deleteTask(task)
  }

  onTaskEdit(task: RobotTask) {
    this.taskFormEdit = true;
    this.taskFormStatus = task.status;
    this.taskFormPriority = task.priority;
    this.sequences = task.behaviours

    this.taskForm.setValue(task);
  }

  onTaskSubmit() {
    let robotTask: RobotTask = this.taskForm.value;
    robotTask.behaviours = this.sequences;

    if (this.taskFormEdit) {
      this.modifyTask(robotTask);
      this.taskFormEdit = false;
    } else {
      this.addTask(robotTask);
    }

    this.onCancelButton()
  }

  onCancelButton() {
    this.taskForm.reset();
    this.taskForm.markAsUntouched();
    this.sequences = [];
    this.taskFormEdit = false;
  }

  addTask(robotTask: RobotTask) {
    this.robotsTasksService.addTask(robotTask).subscribe(() => {
      this.fetchRobotsTasks();
    });
  }

  modifyTask(robotTask: RobotTask) {
    this.robotsTasksService.updateTask(robotTask).subscribe(() => {
      this.fetchRobotsTasks();
    });
  }

  deleteTask(robotTask: RobotTask) {
    this.robotsTasksService.deleteTask(robotTask).subscribe(() => {
      this.fetchRobotsTasks();
    });
  }

  fetchRobotsTasks() {
    this.refreshRobotTasks$.next(true);
  }

  fetchPriorityStatues() {
    this.taskPriorityController.getAll()
      .subscribe((list) => {
        this.taskPriorities = list;
      })
  }

  openFilterModal() {
    this.filterRef = this.dialog.open(this.taskFiltersDialog);
  }

  onFilterNoClick() {
    this.filterRef?.close()
  }

  onFilterModalSubmit() {
    this.filterRef?.close()
    this.fetchRobotsTasks()
  }

  removeChip(key: string) {
    this.filterDialogForm.patchValue({[key]: null})
    this.fetchRobotsTasks()
  }

  toFormattedDate(date: string): string {
    return dayjs(date).format('YYYY/MM/DD').toString();
  }

  toggleSortOrder() {
    this.sortAsc = !this.sortAsc;
    this.fetchRobotsTasks()
  }
}
