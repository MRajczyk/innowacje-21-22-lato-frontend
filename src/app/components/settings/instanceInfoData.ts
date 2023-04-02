import {InstanceInfo} from "../../models/instance-info";

export class InstanceInfoData{
  instanceChange : boolean = false;

  instanceInfo : InstanceInfo | undefined = {
    _id: "0",
    instanceName: "0",
    instanceAddress: "0",
    instanceDescription: "0"
  };

  constructor(instanceChange ?: boolean, instanceInfo ?: InstanceInfo) {
    this.instanceChange = instanceChange ?? false;
    this.instanceInfo = instanceInfo ?? undefined;
  }

}
