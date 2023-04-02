import {Component} from '@angular/core';
import {MapData} from "./map-data";
import {MapSettings} from "../../models/map-settings";
import {InstanceInfo} from "../../models/instance-info";
import {InstanceInfoData} from "./instanceInfoData";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'ra-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent {

  mapToUpdate: MapSettings = {
    graphId: "0",
    mapId: "0",
    origin : [0, 0, 0],
    size : [0, 0]
  };

  toggle: boolean = true
  mapData: MapData = new MapData();
  instanceChange: boolean = false;

  instanceInfoData: InstanceInfoData = new InstanceInfoData();

  constructor(private mapSettings: SettingsService) {
  }

  changeTab(){
    this.toggle = !this.toggle
    this.mapData.mapChanged = false;
    this.instanceChange = false;
  }

  onMapChange($event: MapData){
    this.mapData = $event;
    this.mapData.mapChanged = true;
  }

  onInstanceChange($event: InstanceInfoData){
    this.instanceInfoData = $event;
    console.log(this.instanceInfoData);
  }

  onUpdateCurrentMap(mapId: string | undefined, graphId: string | undefined){
    this.mapSettings.updateCurrentMapAndGraph(mapId, graphId)
      .subscribe((list) => {
        this.mapToUpdate = list;
      })
  }

  onUpdateInstanceInfo(instanceInfo: InstanceInfo | undefined){
    this.mapSettings.updateInstanceInfo(instanceInfo)
      .subscribe();
  }

  saveData() {
    if (this.mapData.mapChanged && this.mapData.graphChanged) {
      this.onUpdateCurrentMap(this.mapData.currentMap?.mapId, this.mapData.currentGraph?.id)

    }
    if (this.instanceInfoData.instanceChange) {
      this.onUpdateInstanceInfo(this.instanceInfoData.instanceInfo);
    }
  }

}
