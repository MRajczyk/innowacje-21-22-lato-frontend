import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Kiosk} from "../../../models/kiosk";
import {KiosksService} from "../../../services/kiosks.service";
import {KioskDialogComponent} from "../kiosk-dialog/kiosk-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {KioskUpdateDialogComponent} from "../kiosk-update-dialog/kiosk-update-dialog.component";

@Component({
  selector: 'ra-kiosk-element',
  templateUrl: './kiosk-element.component.html',
  styleUrls: ['./kiosk-element.component.sass']
})
export class KioskElementComponent  {

  @Input()
  kiosk: Kiosk | undefined = undefined
  @Output() getKioskStatusChange = new EventEmitter<boolean>();

  constructor(private kiosks: KiosksService,private dialog: MatDialog) { }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms));
  }
  deleteKiosk() {
    if(this.kiosk === undefined)
      return;
    this.kiosks.deleteKiosk(this.kiosk)
    this.delay(1000).then(r=>this.getKioskStatusChange.emit(true));
  }

  updateKiosk() {
    if(this.kiosk === undefined)
      return;
    const dialogRef = this.dialog.open(KioskUpdateDialogComponent, {
      width: '500px',
      data: this.kiosk
    });
    dialogRef.afterClosed().subscribe((r=>this.getKioskStatusChange.emit(true)))
    //;
  }
}
