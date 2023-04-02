import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {Behaviour} from "../../models/behaviour";
import {Stand} from "../../models/stand";
import {StandsService} from "../../services/stands.service";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'ra-edit-behaviour-dialog',
  templateUrl: './edit-behaviour-dialog.component.html',
  styleUrls: ['./edit-behaviour-dialog.component.sass']
})
export class EditBehaviourDialogComponent {

  public parameters: any;
  public parametersTemplate: Behaviour;

  public parametersForm: FormGroup;
  public stands: Observable<Stand[]> | any = undefined;

  constructor(
    public dialogRef: MatDialogRef<EditBehaviourDialogComponent>,
    public standsService: StandsService,
    public settingsService: SettingsService,

    @Inject(MAT_DIALOG_DATA) public data: any,
    )
  {
    this.parameters = data.parameters;
    this.parametersTemplate = JSON.parse(data.behaviour.parameters);
    this.parametersForm = this.toFormGroup(this.parameters);

    this.settingsService.getCurrentMap().subscribe(mapSettings => {
      this.stands = this.standsService.getStandsOfMap(mapSettings.mapId);
    })
  }

  private toFormGroup(data: any): FormGroup {
    const group: any = {};
    for (let dataKey in data) {
      if (dataKey == 'name')
        group[dataKey] = new FormControl({value: data[dataKey], disabled: true})
      else
        group[dataKey] = new FormControl(data[dataKey])
    }
    if (!('name' in data))
      group['name'] = new FormControl({value: this.data.behaviour.name, disabled: true})

    return new FormGroup(group)
  }

  onSubmit() {
    this.dialogRef.close(JSON.stringify(this.parametersForm.getRawValue()))
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

}
