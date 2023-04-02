import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Robot } from '../models/robot';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class RobotsService {
    private endpoint: string = '/robots'

    constructor( 
        private http: HttpClient, 
        private userService: UserService
    ) { }

    getAll(): Observable<Robot[]> {
        return this.http.get<Robot[]>(environment.url + this.endpoint + '/all', {
                headers: this.userService.getAuthorizationHeader(),
                responseType: 'json'
            });
    }

    addRobot(robot: Robot): Observable<Robot> {
        return this.http.post<Robot>(`${environment.url}${this.endpoint}/add`, robot, {
            headers: this.userService.getAuthorizationHeader(),
            responseType: 'json'
        });
    }

    deleteRobot(robot: Robot): Observable<Object> {
        return this.http.delete(`${environment.url}${this.endpoint}/delete`, {
            headers: this.userService.getAuthorizationHeader(),
            responseType: 'json',
            body: robot
        });
    }

    updateRobot(robot: Robot): Observable<Robot> {
        return this.http.post<Robot>(`${environment.url}${this.endpoint}/update`, robot, {
            headers: this.userService.getAuthorizationHeader(),
            responseType: 'json'
        });
    }
}
