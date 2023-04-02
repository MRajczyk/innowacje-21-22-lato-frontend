import { Component, Input, OnInit } from '@angular/core';
import {MapType} from "../enums/map-type";
import {NodeType} from "../enums/node-type";
import {StandType} from "../../../models/stand-type";

interface NodeDesc {
  name: string;
  value: NodeType;
}

@Component({
  selector: 'ra-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.sass']
})
export class LegendComponent implements OnInit {

  @Input() mapType!: string;

  @Input()
  public nodesItems: Array<NodeDesc> = [];

  @Input()
  public stationsItems: Array<StandType> = [];

  public legendVisible: boolean = false;
  public displayStations: boolean = false;
  public displayNodes: boolean = false;

  constructor() { }

  ngOnInit(): void {
    switch (this.mapType) { // TODO: check if correct
      case MapType.RoutesManager:
        this.displayStations = true;
        this.displayNodes = true;
        break;
      case MapType.ActionsMonitor:
      case MapType.StandsManager:
        this.displayStations = true;
        this.displayNodes = false;
        break;
      case MapType.RobotViewer:
        this.displayStations = false;
        this.displayNodes = false;
        break;
    }
  }

  toggleLegend(): void {
    this.legendVisible = !this.legendVisible;
  }

}
