import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {UserDialogComponent} from "../user-dialog/user-dialog.component";
import {UserUpdateDialogComponent} from "../user-update-dialog/user-update-dialog.component";

@Component({
  selector: 'ra-user-element',
  templateUrl: './user-element.component.html',
  styleUrls: ['./user-element.component.sass']
})
export class UserElementComponent implements OnInit {

  @Input()
  userName: User | undefined = undefined
  @Output() getUserStatusChange = new EventEmitter<boolean>();

  constructor(private users: UserService,private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  deleteUser() {
    if (this.userName === undefined)
      return
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: {name: this.userName.name, user: this.userName}
    });
    dialogRef.afterClosed().subscribe(r=> this.delay(1000).then(r=>this.getUserStatusChange.emit(true)))
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  updateUser() {
    if(this.userName === undefined) {
      return
    }
    const dialogRef = this.dialog.open(UserUpdateDialogComponent, {
      width: '500px',
      data: this.userName
    });
    dialogRef.afterClosed().subscribe(r=> this.delay(1000).then(r=>this.getUserStatusChange.emit(true)))
  }
}
