import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {StandType} from "../models/stand-type";

@Injectable({
  providedIn: 'root'
})
export class StandTypeControllerService {

  private endpoint: string = '/type/stand-types'

  constructor(private http: HttpClient, private userService: UserService) {
  }

  getAll(): Observable<StandType[]> {
    return this.http.get<StandType[]>(environment.url + this.endpoint + '/all', {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }
}
