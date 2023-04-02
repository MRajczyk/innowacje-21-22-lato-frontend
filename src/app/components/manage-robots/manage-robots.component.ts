import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { Robot } from 'src/app/models/robot';
import { RobotsToApproveService } from 'src/app/services/robots-to-approve.service';
import { RobotsService } from 'src/app/services/robots.service';
import {MapComponent} from "../map/map.component";


const ROBOTS_POOLING_TIME_INTERVAL = 2000;

@Component({
  selector: 'ra-manage-robots',
  templateUrl: './manage-robots.component.html',
  styleUrls: ['./manage-robots.component.sass']
})
export class ManageRobotsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('map')
  map: MapComponent | undefined;

  readonly STATUS_OK: string = 'OK';
  readonly STATUS_ERROR: string = 'ERROR';
  readonly STATUS_WARNING: string = 'WARNING';

  robots: Robot[] = [];
  selectedRobot!: Robot;

  robotsToApprove: Robot[] = [];
  selectedRobotToApprove!: Robot;

  displayAddSidebar: boolean = false;
  displayEditSidebar: boolean = false;
  rightSideActive: boolean = true;
  editingRobot: boolean = false;

  readonly ADD_ROBOT = "Dodaj nowego robota";
  readonly EDIT_ROBOT = "Edytuj robota";

  sidebarHeader: string = '';

  form: FormGroup;
  editForm: FormGroup;

  timeInterval!: Subscription;
  mapState!: Subscription;

  constructor(
    private robotsService: RobotsService,
    private robotsToApproveService: RobotsToApproveService,
  ) {

    this.form = new FormGroup({
      name: new FormControl({value: '', disabled: true}, Validators.required),
      ip: new FormControl({value: '', disabled: true}),
      model: new FormControl({value: '', disabled: true}),
      status: new FormControl({value: '', disabled: true}),
      battery: new FormControl({value: '', disabled: true}),
    });

    this.editForm = new FormGroup({
      name: new FormControl({value: '', disabled: true}, Validators.required),
      ip: new FormControl({value: '', disabled: false}),
      model: new FormControl({value: '', disabled: true}),
      status: new FormControl({value: '', disabled: true}),
      battery: new FormControl({value: '', disabled: true}),
    });
  }

  ngOnInit(): void {
    this.timeInterval = interval(ROBOTS_POOLING_TIME_INTERVAL)
    .pipe(
      startWith(0),
      switchMap(() => this.robotsService.getAll())
    ).subscribe( robots => {
      if (!this.editingRobot && !this.displayEditSidebar) {
        this.robots = robots;
        if(this.rightSideActive) {
          this.onClickToggleRobot(this.selectedRobot, false);
        }
      }
    });

    this.robotsToApproveService.getAll().subscribe(robotsToApprove => {
      this.robotsToApprove = robotsToApprove;
      if(!this.rightSideActive) {
        this.onClickToggleRobotToApprove(this.selectedRobotToApprove, false);
      }
    })
  }

  ngAfterViewInit(): void {
    if(this.map) {
      this.mapState = this.map.mapLoadingState().subscribe({
        next: (loading: boolean) => {
          if(!loading) {
            if(!this.selectedRobot && this.robots) {
              this.selectedRobot = this.robots[0];
            }
            if(!this.selectedRobotToApprove && this.robotsToApprove) {
              this.selectedRobotToApprove = this.robotsToApprove[0];
            }

            if(this.rightSideActive) {
              this.onClickToggleRobot(this.selectedRobot, true);
            }
            else {
              this.onClickToggleRobotToApprove(this.selectedRobotToApprove, true);
            }
          }
        }
      })
    }
  }

  ngOnDestroy(): void {
      this.timeInterval.unsubscribe();
      this.mapState.unsubscribe();
  }

  onClickToggleRobot(robot: Robot, focus: Boolean): void {
    this.selectedRobot = robot;
    if(!this.map)
      return;
    this.map.selectRobot(robot, focus);
  }

  onClickToggleRobotToApprove(robot: Robot, focus: Boolean): void {
    this.selectedRobotToApprove = robot;
    if(!this.map)
      return;
    this.map.selectRobot(robot, focus);
  }

  onDelete(robot: Robot): void {
    this.robotsService.deleteRobot(robot).subscribe();
    const index = this.robots.findIndex(x => x.id === robot.id)
    this.robots.splice(index, 1);
    this.onClickToggleRobot(this.robots[0], true);
  }

  onSubmitRobotToApprove(): void {
    this.robotsToApproveService.approveOne(this.selectedRobotToApprove).subscribe();  //todo: success, error
    const index = this.robotsToApprove.findIndex(x => x.id === this.selectedRobotToApprove.id)
    this.robots.push(this.robotsToApprove[index]);
    this.robotsToApprove.splice(index, 1);
    this.onClickToggleRobotToApprove(this.robotsToApprove[0], true);
    this.displayAddSidebar = false;
  }

  onSubmitEditRobot(): void {
    this.selectedRobot.robotIp = this.editForm.value.ip;
    this.robotsService.updateRobot(this.selectedRobot).subscribe();
    this.hideEditSidebar();
  }

  hideAddSidebar(): void {
    this.displayAddSidebar = false;
  }

  showAddSidebar(header: string, robotId: string): void {
    this.form.patchValue({
      name: this.selectedRobotToApprove.id,
      ip: this.selectedRobotToApprove.robotIp,
      model: this.selectedRobotToApprove.model,
      status: this.selectedRobotToApprove.status,
      battery: `${this.selectedRobotToApprove.batteryLevel} %`
    });

    this.sidebarHeader = header;
    this.displayAddSidebar = true;
  }

  hideEditSidebar(): void {
    this.displayEditSidebar = false;
  }

  showEditSidebar(header: string, robotId: string): void {
    this.editForm.patchValue({
      name: this.selectedRobot.id,
      ip: this.selectedRobot.robotIp,
      model: this.selectedRobot.model,
      status: this.selectedRobot.status,
      battery: `${this.selectedRobot.batteryLevel} %`
    });

    this.sidebarHeader = header;
    this.displayEditSidebar = true;
  }

  toggleActiveSide(): void {
    this.rightSideActive = !this.rightSideActive;

    if(this.rightSideActive) {
      this.hideAddSidebar();
    } else {
      this.hideEditSidebar();
    }

    if(!this.map)
      return;
    this.map.selectRobot(this.rightSideActive ? this.selectedRobot : this.selectedRobotToApprove, true);
  }

  toggleSelectedRobotAvailable(): void {
    this.editingRobot = true;
    this.selectedRobot.available = !this.selectedRobot.available
    this.robotsService.updateRobot(this.selectedRobot).subscribe({
      error: (error) => {
        console.log(error);
        this.editingRobot = false;
      },
      next: () => {
        this.editingRobot = false;
      },
      complete: () => {
        this.editingRobot = false;
      }
    });
  }

  // 1px - min
  //
}


