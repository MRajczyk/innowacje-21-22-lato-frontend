import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {Kiosk} from "../../../models/kiosk";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {KiosksService} from "../../../services/kiosks.service";

@Component({
  selector: 'ra-kiosk-update-dialog',
  templateUrl: './kiosk-update-dialog.component.html',
  styleUrls: ['./kiosk-update-dialog.component.sass']
})
export class KioskUpdateDialogComponent implements OnInit {
  kiosk: Kiosk[] = [];
  form: FormGroup;
  @Output() getKioskStatusChange = new EventEmitter<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<KioskUpdateDialogComponent>,
    private kiosks: KiosksService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      id: [""],
      name: [""],
      standId: [""]
    })
  }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close();
    return true;
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  createKiosk() {
    if(this.onNoClick())
      this.dialogRef.close();

    this.form.value.id = this.data.id
    this.kiosks.updateKiosk(this.form.value);
    //this.delay(1000).then(r => window.location.reload());
    this.dialogRef.close();
  }
}
