import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StatusType} from "../../models/status-type";
import {TaskPriority} from "../../models/task-priority";
import {BehaviorSubject, combineLatest, map, Observable, switchMap} from "rxjs";
import {Behaviour} from "../../models/behaviour";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {TaskPriorityControllerService} from "../../services/task-priority-controller.service";
import {taskSectionIconPaths} from "../manage-tasks/manage-tasks.component";
import {TaskTemplate} from "../../models/task-template";
import {KiosksService} from "../../services/kiosks.service";
import {TaskTemplateControllerService} from "../../services/task-template-controller.service";
import {Kiosk} from "../../models/kiosk";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

export enum sortingTypes {
  None,
  Priority,
  Name,
}

@Component({
  selector: 'ra-task-templates',
  templateUrl: './task-templates.component.html',
  styleUrls: ['./task-templates.component.sass']
})
export class TaskTemplatesComponent implements OnInit {

  @ViewChild('templateFiltersDialog') taskFiltersDialog!: TemplateRef<any>;

  iconsPath: string = "./assets/tasks-section/"
  iconPathList: string[] = taskSectionIconPaths;

  taskForm: FormGroup;
  taskFormEdit: boolean = false;
  taskFormKiosk: string = "";
  taskFormPriority: StatusType = {id: '', name: '', weight: 0};

  taskTemplates$: Observable<Array<TaskTemplate>>;
  filteredTaskTemplates$: Observable<Array<TaskTemplate>>;
  refreshTaskTemplates$ = new BehaviorSubject<boolean>(true);

  kiosks: Kiosk[] = [];
  taskPriorities: TaskPriority[] = [];

  sequences: Behaviour[] = [];

  filterDialogForm: FormGroup;
  filterRef?: MatDialogRef<any, any>;
  sortAsc: boolean = true;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private taskTemplatesService: TaskTemplateControllerService,
    private kiosksService: KiosksService,
    private taskPriorityController: TaskPriorityControllerService,
    private dialog: MatDialog
  ) {
    this.iconPathList.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon.split(".")[0],
        this.domSanitizer.bypassSecurityTrustResourceUrl(this.iconsPath + icon)
      );
    });

    this.taskTemplates$ = this.refreshTaskTemplates$.pipe(switchMap(_ => this.taskTemplatesService.getAll()));

    this.filterDialogForm = this.formBuilder.group({
      name: [null],
      priority: [null],
      status: [null],
      kiosk: [null],
      sorting: [sortingTypes.None]
    });

    this.filteredTaskTemplates$ = combineLatest([this.taskTemplates$]).pipe(
      map(([tasks]) => {
        const filterValues = this.filterDialogForm.getRawValue();
        if (filterValues.name !== null)
          tasks = tasks.filter((item) => item.name.includes(filterValues.name))
        if (filterValues.priority !== null)
          tasks = tasks.filter((item) => item.priority.id === filterValues.priority.id);
        if (filterValues.kiosk !== null)
          tasks = tasks.filter((item) => item.kioskId === filterValues.kiosk.id);

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
        }

        return tasks;
      })
    )

    this.taskForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      behaviours: [[]],
      priority: [TaskPriority, [Validators.required]],
      kioskId: ["", [Validators.required]],
      mapId: ["", []]
    });
  }

  ngOnInit(): void {
    this.fetchPriorityStatues();
    this.fetchKiosks();
  }

  onTaskDelete(task: TaskTemplate) {
    this.deleteTask(task)
  }

  onTaskEdit(task: TaskTemplate) {
    this.taskFormEdit = true;

    this.taskFormPriority = task.priority;
    this.taskFormKiosk = task.kioskId
    this.sequences = task.behaviours
    this.taskForm.setValue(task);
  }

  onTaskSubmit() {
    let template: TaskTemplate = this.taskForm.value;
    template.behaviours = this.sequences;

    if (this.taskFormEdit) {
      this.modifyTask(template);
      this.taskFormEdit = false;
    } else {
      this.addTask(template);
    }

    this.onCancelButton()
  }

  onCancelButton() {
    this.taskForm.reset();
    this.taskForm.markAsUntouched();
    this.sequences = [];
    this.taskFormEdit = false;
  }

  addTask(template: TaskTemplate) {
    this.taskTemplatesService.addTask(template).subscribe(() => {
      this.fetchRobotsTasks();
    });
  }

  modifyTask(template: TaskTemplate) {
    this.taskTemplatesService.updateTask(template).subscribe(() => {
      this.fetchRobotsTasks();
    });
  }

  deleteTask(template: TaskTemplate) {
    this.taskTemplatesService.deleteTask(template).subscribe(() => {
      this.fetchRobotsTasks();
    });
  }

  fetchRobotsTasks() {
    this.refreshTaskTemplates$.next(true);
  }

  fetchPriorityStatues() {
    this.taskPriorityController.getAll()
      .subscribe((list) => {
        this.taskPriorities = list;
      })
  }

  fetchKiosks() {
    this.kiosksService.getAll()
      .subscribe(list => {
        this.kiosks = list;
      })
  }

  findKioskByTemplate(template: TaskTemplate): Kiosk {
    const foundKiosk = this.kiosks.find(kiosk => kiosk.id === template.kioskId);
    return foundKiosk || {id: '', name: '', standId: ''};
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

  toggleSortOrder() {
    this.sortAsc = !this.sortAsc;
    this.fetchRobotsTasks()
  }
}
