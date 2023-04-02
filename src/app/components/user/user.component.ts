import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {FormBuilder, FormGroup} from "@angular/forms";
import {SearchPipe} from "../../search.pipe";

@Component({
  selector: 'ra-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass'],
  providers: [ SearchPipe ]
})
export class UserComponent implements OnInit {

  users: User[] = [];
  term: string = "";
  displaySidebar: boolean = false;
  form: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      id: [""],
      name: [""],
      role: [""],
      password: [""],
      repassword: [""]
    })
  }


  onGetUsers() {
    this.userService.getAll()
      .subscribe((list) => {
        this.users = list;
      })
  }

  ngOnInit(): void {
    this.onGetUsers()
  }

  showSidebar(header: string): void {
    // @ts-ignore
    this.form.patchValue({
      name: '',
    });

    this.displaySidebar = true;
  }
  hideSidebar() {
    this.displaySidebar = false;
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  onSubmit() {
    this.userService.insertUser(this.form.value);
    this.users.push(this.form.value)
  }

  reloadData() {
    this.users = []
    this.onGetUsers()
  }
}
