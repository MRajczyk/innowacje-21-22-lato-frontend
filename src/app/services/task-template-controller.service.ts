import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {TaskTemplate} from "../models/task-template";

@Injectable({
  providedIn: 'root'
})
export class TaskTemplateControllerService {

  private endpoint: string = '/tasks/templates'

  constructor(private http: HttpClient, private userService: UserService) {
  }

  getAll(): Observable<TaskTemplate[]> {
    return this.http.get<TaskTemplate[]>(environment.url + this.endpoint + '/all', {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  addTask(task: TaskTemplate): Observable<TaskTemplate>  {
    return this.http.post<TaskTemplate>(environment.url + this.endpoint + '/add', task, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  updateTask(task: TaskTemplate): Observable<TaskTemplate>  {
    return this.http.post<TaskTemplate>(environment.url + this.endpoint + '/update', task, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  deleteTask(task: TaskTemplate): Observable<TaskTemplate> {
    return this.http.delete<TaskTemplate>(environment.url + this.endpoint + '/delete', {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json',
      body: task
    });
  }
}
