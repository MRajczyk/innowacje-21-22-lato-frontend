import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {InstanceInfoData} from "../instanceInfoData";
import {InstanceInfo} from "../../../models/instance-info";

@Component({
  selector: 'ra-settings-instances',
  templateUrl: './settings-instances.component.html',
  styleUrls: ['./settings-instances.component.sass']
})
export class SettingsInstancesComponent {

  instanceInfo : InstanceInfo = {
    _id: "0",
    instanceName: "0",
    instanceAddress: "0",
    instanceDescription: "0"
  };

  isInstanceName : boolean = false;
  isInstanceAddress : boolean = false;
  isInstanceDescription : boolean = false;

  constructor() { }

  @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  onInstanceChanged = new EventEmitter();

  onInstanceName(event : any){
    this.instanceInfo._id = event.target.value;
    this.instanceInfo.instanceName = event.target.value;
    if(this.instanceInfo.instanceName.length != 0){
      this.isInstanceName = true;
      this.checkIfChanged(this.isInstanceName, this.isInstanceAddress, this.isInstanceDescription)
    }
    else {
      this.isInstanceName = false;
      this.checkIfChanged(this.isInstanceName, this.isInstanceAddress, this.isInstanceDescription)
    }
  }

  onInstanceAddress(event : any){
    this.instanceInfo.instanceAddress = event.target.value;
    if(this.instanceInfo.instanceAddress.length != 0){
      this.isInstanceAddress = true;
      this.checkIfChanged(this.isInstanceName, this.isInstanceAddress, this.isInstanceDescription)
    }
    else {
      this.isInstanceAddress = false;
      this.checkIfChanged(this.isInstanceName, this.isInstanceAddress, this.isInstanceDescription)
    }
  }

  onInstanceDescription(event : any){
    this.instanceInfo.instanceDescription = event.target.value;
    if(this.instanceInfo.instanceDescription.length != 0){
      this.isInstanceDescription = true;
      this.checkIfChanged(this.isInstanceName, this.isInstanceAddress, this.isInstanceDescription)
    }
    else {
      this.isInstanceDescription = false;
      this.checkIfChanged(this.isInstanceName, this.isInstanceAddress, this.isInstanceDescription)
    }
  }

  checkIfChanged(instanceNameChanged : boolean, instanceAddressChange : boolean, instanceDescriptionChange : boolean){
    let instanceChanged = instanceNameChanged && instanceAddressChange && instanceDescriptionChange;
    console.log(instanceChanged);
    let instanceInfoData = new InstanceInfoData(instanceChanged, this.instanceInfo);
    this.onInstanceChanged.emit(instanceInfoData);
  }

}
