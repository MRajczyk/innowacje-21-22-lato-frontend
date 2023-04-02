import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Kiosk} from "../../../models/kiosk";
import {KiosksService} from "../../../services/kiosks.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'ra-kiosk-dialog',
  templateUrl: './kiosk-dialog.component.html',
  styleUrls: ['./kiosk-dialog.component.sass']
})
export class KioskDialogComponent implements OnInit {
  kiosk: Kiosk[] = [];
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<KioskDialogComponent>,
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
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  createKiosk() {
    this.kiosks.addKiosk(this.form.value);
    //this.delay(1000).then(r => window.location.reload());
    this.dialogRef.close();
  }
}
