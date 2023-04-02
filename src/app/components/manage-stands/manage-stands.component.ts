import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MapComponent} from "../map/map.component";
import {MapFactory} from "../map/map-factory";

@Component({
  selector: 'ra-manage-stands',
  templateUrl: './manage-stands.component.html',
  styleUrls: ['./manage-stands.component.sass']
})

export class ManageStandsComponent {
  readonly ADD_STAND = "Dodaj nowe stanowisko";
  readonly EDIT_STAND = "Edytuj stanowisko";

  sidebarHeader: string = '';
  displaySidebar: boolean = false;
  editing: boolean = false;

  form: FormGroup;

  @ViewChild('map')
  map: MapComponent | undefined;

  constructor() {

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      parkingType: new FormControl(''),
      standType: new FormControl(''),
      kiosk: new FormControl(''),
      x: new FormControl(''),
      y: new FormControl(''),
      orientation: new FormControl(''),
    });
  }

  showSidebar(editing: boolean) {
    if(this.displaySidebar)
      return;
    this.sidebarHeader = editing ? this.EDIT_STAND : this.ADD_STAND;
    this.editing = editing;
    this.displaySidebar = true;
  }

  hideSidebar() {
    this.displaySidebar = false;
  }

  /**
   * Events
   */

  onStandSelect(id: string) {
    this.map?.selectStand(id);
  }

  onAddClick() {
    if(!this.map)
      return

    this.showSidebar(false)
    this.map.addStand()
  }

  onEditClick(id: string) {
    if(!this.map)
      return;

    this.showSidebar(true)
    this.map.editStand(id);
  }

  onDeleteClick(id: string) {
    this.map?.deleteStand(id);
  }

  onSaveClick() {
    this.map?.saveEditedStand();
    this.hideSidebar()
  }

  onDiscardClick() {
    this.map?.discardEditedStand();
    this.hideSidebar()
  }

  onPositionInput(xStr: string, yStr: string, ortStr: string) {
    if(!this.map)
      return

    const x = Number.parseFloat(xStr)
    const y =  Number.parseFloat(yStr)
    const ort =  Number.parseFloat(ortStr) + MapFactory.ROTATION_OFFSET_DEGREES

    if(isNaN(x) || isNaN(y) || isNaN(ort)) {
      return;
    }

    this.map.moveEditedStand(x, y, ort);
  }

  onStandChanged(data: {
    name: string,
    parkingType: string,
    standType: string,
    kiosk: string,
    x: number,
    y: number,
    orientation: number
  }) {
    this.form.patchValue(data);
  }

  onStandDetailsChange() {
    this.map?.changeStandDetails(this.form.get('name')?.value, this.form.get('parkingType')?.value, this.form.get('standType')?.value, this.form.get('kiosk')?.value)
  }

  /**
   * Methods
   */
}
