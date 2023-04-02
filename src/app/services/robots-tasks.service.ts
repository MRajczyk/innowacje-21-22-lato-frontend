import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {Observable} from "rxjs";
import {RobotTask} from "../models/robot-task";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RobotsTasksService {

  private endpoint: string = '/robots/tasks'

  constructor(private http: HttpClient, private userService: UserService) {
  }

  getAll(): Observable<RobotTask[]> {
    return this.http.get<RobotTask[]>(environment.url + this.endpoint + '/all', {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  addTask(task: RobotTask): Observable<RobotTask>  {
    return this.http.post<RobotTask>(environment.url + this.endpoint + '/add', task, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  updateTask(task: RobotTask): Observable<RobotTask>  {
    return this.http.post<RobotTask>(environment.url + this.endpoint + '/update', task, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  deleteTask(task: RobotTask): Observable<RobotTask> {
    return this.http.delete<RobotTask>(environment.url + this.endpoint + '/delete', {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json',
      body: task
    });
  }
}
