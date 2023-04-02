import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'ra-auth-form',
    templateUrl: './auth-form.component.html',
    styleUrls: ['./auth-form.component.sass']
})
export class AuthFormComponent implements OnInit {

    public name: string = '';
    public password: string = '';
    public loginFailed!: boolean;
    
    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.userService.hasLoginErrors$.subscribe({
            next: (value) => {
                this.loginFailed = value;
            },
        });
    }

    onSubmit(): void {
        this.userService.logIn(this.name, this.password);    
    }
}
