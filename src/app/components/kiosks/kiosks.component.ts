import {Component, OnInit} from '@angular/core';
import {Kiosk} from "../../models/kiosk";
import {MatDialog} from "@angular/material/dialog";
import {KioskDialogComponent} from "./kiosk-dialog/kiosk-dialog.component";
import {KiosksService} from "../../services/kiosks.service";
import {SearchPipe} from "../../search.pipe";

@Component({
  selector: 'ra-kiosks',
  templateUrl: './kiosks.component.html',
  styleUrls: ['./kiosks.component.sass'],
  providers: [ SearchPipe ]
})
export class KiosksComponent implements OnInit {
//{id: "1", name: "Test", standId: "www"}, {id: "1", name: "3ewqe", standId: "www"},{id: "1", name: "Test", standId: "www"}, {id: "1", name: "3ewqe", standId: "www"},{id: "1", name: "Test", standId: "www"}, {id: "1", name: "3ewqe", standId: "www"},{id: "1", name: "Test", standId: "www"}, {id: "1", name: "3ewqe", standId: "www"},{id: "1", name: "Test", standId: "www"}, {id: "1", name: "3ewqe", standId: "www"}
  kiosk: Kiosk[] = [];
  term: string = "";

  constructor(private dialog: MatDialog, private kiosks: KiosksService) {
  }

  onGetKiosks() {
    this.kiosks.getAll()
      .subscribe((list) => {
        this.kiosk = list;
      })
  }

  ngOnInit(): void {
    this.onGetKiosks()
  }

  createKiosk() {
    const dialogRef = this.dialog.open(KioskDialogComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(
      () => this.onGetKiosks())
  }

  public transform(value: any, keys: string, term: string) {

    if (!term) return value;
    return (value || []).filter((item: { [x: string]: any; hasOwnProperty: (arg0: any) => any; }) => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));

  }

}
