import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";

@Component({
  selector: 'ra-user-update-dialog',
  templateUrl: './user-update-dialog.component.html',
  styleUrls: ['./user-update-dialog.component.sass']
})
export class UserUpdateDialogComponent implements OnInit {
  user: User[] = [];
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<UserUpdateDialogComponent>,
    private users: UserService,
    private formBuilder: FormBuilder)
  {
    this.form = this.formBuilder.group({
      //id: [""],
      //name: [""],
      //password: [""],
      //authorities: [""],
      //groups: [""],
      //prohibitions: [""],
      id: [""],
      name: [""],
      role: [""],
      password: [""],
      repassword: [""]
    })

  }

  onNoClick() {
    this.dialogRef.close();
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  updateUser() {
    this.form.value.id = this.data.id
    this.users.updateUser(this.form.value);
    //this.delay(1000).then(r => window.location.reload());
    console.log(this.form.value)
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
