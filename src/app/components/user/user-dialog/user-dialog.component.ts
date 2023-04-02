import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {KiosksService} from "../../../services/kiosks.service";
import {FormBuilder} from "@angular/forms";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'ra-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.sass']
})
export class UserDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private userService: UserService,
  ){}

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close()
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  delete() {
    this.userService.deleteUser(this.data.user.id)
    //this.delay(1000).then(r => window.location.reload());
    this.dialogRef.close()
  }
}
