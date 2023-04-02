import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'ra-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  title = 'ra-front';
  logged = false;

  constructor(public userService: UserService) {}
}
