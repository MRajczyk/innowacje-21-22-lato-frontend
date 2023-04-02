import {Component, Input, OnInit} from '@angular/core';
import {Behaviour} from "../../models/behaviour";
import {CdkDragDrop, copyArrayItem, moveItemInArray} from "@angular/cdk/drag-drop";
import {EditBehaviourDialogComponent} from "../edit-behaviour-dialog/edit-behaviour-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {BehaviourControllerService} from "../../services/behaviour-controller.service";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'ra-behaviours-drag-and-drop',
  templateUrl: './behaviours-drag-and-drop.component.html',
  styleUrls: ['./behaviours-drag-and-drop.component.sass']
})
export class BehavioursDragAndDropComponent implements OnInit {

  behaviours: Behaviour[] = [];
  @Input() sequences: Behaviour[] = [];

  iconsPath: string = "./assets/behaviours-img/";
  iconPathList: string[] = [
    "bin.svg",
    "edit.svg",
    "drag.svg"
  ];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog,
    private behaviourControllerService: BehaviourControllerService,
  ) { }

  ngOnInit(): void {
    this.iconPathList.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon.split(".")[0],
        this.domSanitizer.bypassSecurityTrustResourceUrl(this.iconsPath + icon)
      );
    });

    this.fetchBehaviours();
  }


  drop(event: CdkDragDrop<Behaviour[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.sequences, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
    }
  }

  fetchBehaviours() {
    this.behaviourControllerService.getAll()
      .subscribe((list) => {
        list.forEach(behaviour => {
          const parameters: any = JSON.parse(behaviour.parameters);
          parameters['name'] = behaviour.name;
          behaviour.parameters = JSON.stringify(parameters);
        })
        this.behaviours = list;
      })
  }

  openBehaviourDialog(index: number) {
    const dialogRef = this.dialog.open(EditBehaviourDialogComponent, {
      width: '500px',
      data: {parameters: JSON.parse(this.sequences[index].parameters), behaviour: this.behaviours.find(b => b.id === this.sequences[index].id)},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newSequence: Behaviour = {...this.sequences[index]}
        newSequence.parameters = result
        this.sequences[index] = newSequence;
      }
    })
  }

  removeSequence(index: number) {
    this.sequences.splice(index, 1);
  }
}
