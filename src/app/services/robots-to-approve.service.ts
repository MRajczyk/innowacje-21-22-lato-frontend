import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Robot } from '../models/robot';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class RobotsToApproveService {
    private endpoint: string = '/robots-temp'

    constructor( 
        private http: HttpClient, 
        private userService: UserService
    ) { }

    getAll(): Observable<Robot[]> {
        return this.http.get<Robot[]>(`${environment.url}${this.endpoint}/all`, {
                headers: this.userService.getAuthorizationHeader(),
                responseType: 'json'
            });
    }

    deleteById(id: string): Observable<Robot> {
        return this.http.delete<Robot>(`${environment.url}${this.endpoint}/delete/${id}`, {
            headers: this.userService.getAuthorizationHeader(),
            responseType: 'json'
        });
    }

    approveOne(robot: Robot): Observable<Robot> {
        return this.http.post<Robot>(`${environment.url}${this.endpoint}/approve`, robot, {
            headers: this.userService.getAuthorizationHeader(),
            responseType: 'json'
        })
    }
}
