import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {MapSettings} from "../models/map-settings";
import {ContactInfo} from "../models/contact-info";
import {UserService} from "./user.service";
import {InstanceInfo} from "../models/instance-info";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  endpoint: string = '/settings';

  constructor(private http: HttpClient, private userService: UserService) {
  }

  getInstanceInfo(): Observable<InstanceInfo> {
    return this.http.get<InstanceInfo>(environment.url + this.endpoint + "/getInstanceInfo", {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  getContactInfo(): Observable<ContactInfo> {
    return this.http.get<ContactInfo>(environment.url + this.endpoint + "/getContactInfo");
  }

  getCurrentMap(): Observable<MapSettings> {
    return this.http.get<MapSettings>(environment.url + this.endpoint + "/getCurrentMap", {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  updateContactInfo(contactInfo2: ContactInfo) {
    this.http.post(environment.url + this.endpoint + '/updateContactInfo', contactInfo2, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    }).subscribe();
  }

  updateInstanceInfo(InstanceInfo: InstanceInfo | undefined): Observable<InstanceInfo>{
    return this.http.post<InstanceInfo>(environment.url + this.endpoint + '/updateInstanceInfo', InstanceInfo, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  //Updates current map with given graph
  updateCurrentMapAndGraph(mapId: string | undefined, graphId: string | undefined): Observable<MapSettings> {
    return this.http.get<MapSettings> (environment.url + this.endpoint + "/updateCurrentMap/" + mapId, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    }) &&
      this.http.get<MapSettings> (environment.url + this.endpoint + "/updateCurrentGraph/" + graphId, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

}
