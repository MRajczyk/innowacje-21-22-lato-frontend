import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MapComponent} from "../map/map.component";
import {GraphSettings} from "../map/graph-settings";

@Component({
  selector: 'ra-manage-routes',
  templateUrl: './manage-routes.component.html',
  styleUrls: ['./manage-routes.component.sass']
})

export class ManageRoutesComponent {
  readonly ADD_GRAPH = "Dodaj nowy graf";
  readonly EDIT_GRAPH = "Edytuj graf";
  readonly DEFAULT_NAME = "Nowy Graf";

  @ViewChild('map')
  map: MapComponent | undefined;

  sidebarHeader: string = '';
  displaySidebar: boolean = false;

  displayNewGraphDialog: boolean = false;
  displayCancelCheck: boolean = false;

  graphForm = new FormGroup({
    name: new FormControl(this.DEFAULT_NAME),
    corridorWidth: new FormControl(10),
    offsetFromAxis: new FormControl(10),
    widthAroundTarget: new FormControl(10)
  })

  @ViewChild('newGraphName')
  newGraphName: ElementRef | undefined;

  constructor() {
    this.graphForm.valueChanges.subscribe(changes => {
      this.map?.updateGraphSettings(changes);
    })
  }

  showSidebar(editing: boolean): void {
    this.sidebarHeader = editing ? this.EDIT_GRAPH : this.ADD_GRAPH;
    this.displaySidebar = true;
  }

  onEditModeChanged() {
    MapComponent.hideContextMenu(this.map?.edgeContextMenu);
    MapComponent.hideContextMenu(this.map?.nodeContextMenu);
  }

  onGraphSettingsChanged(settings: Partial<GraphSettings>) {
    this.graphForm.patchValue(settings);
  }

  onAddGraphClick(): void {
    if(!this.map?.selectedGraphEdited) {
      this.displayNewGraphDialog = true;
    }
  }

  onAddGraphAcceptClick(configure: boolean) {
    this.graphForm.patchValue({
      graphName: this.newGraphName?.nativeElement.value
    })

    this.displayNewGraphDialog = false;
    const graphId = this.map?.addGraph(this.newGraphName?.nativeElement.value);
    if (graphId && configure) {
      this.onEditGraphClick(graphId, true);
    }
    else {
      this.map?.saveEditedGraph();
    }
  }

  onSelectGraph(id: string) {
    this.map?.selectGraph(id);
  }

  onEditGraphClick(id: string, newGraph: boolean): void {
    this.map?.editGraph(id, newGraph)
    this.showSidebar(true)
  }

  onDeleteGraphClick(id: string): void {
    this.map?.deleteGraph(id)
  }

  onSaveGraphClick(): void {
    this.map?.saveEditedGraph()
    this.displaySidebar = false
  }

  onTryDiscardChangesClick(): void {
    this.displayCancelCheck = true;
  }

  onDiscardChangesClick() {
    this.map?.discardEditedGraph()
    this.displayCancelCheck = false;
    this.displaySidebar = false
  }
}
