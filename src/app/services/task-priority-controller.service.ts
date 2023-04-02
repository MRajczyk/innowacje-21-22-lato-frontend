import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {TaskPriority} from "../models/task-priority";

@Injectable({
  providedIn: 'root'
})
export class TaskPriorityControllerService {

  private endpoint: string = '/type/task-priorities'

  constructor(private http: HttpClient, private userService: UserService) {
  }

  getAll(): Observable<TaskPriority[]> {
    return this.http.get<TaskPriority[]>(environment.url + this.endpoint + '/all', {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }
}
