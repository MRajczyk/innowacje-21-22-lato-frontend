import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Behaviour} from "../models/behaviour";

@Injectable({
  providedIn: 'root'
})
export class BehaviourControllerService {

  private endpoint: string = '/robots/behaviours'

  constructor(private http: HttpClient, private userService: UserService) {
  }

  getAll(): Observable<Behaviour[]> {
    return this.http.get<Behaviour[]>(environment.url + this.endpoint + '/all', {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }
}
