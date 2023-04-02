import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Kiosk} from "../models/kiosk";

@Injectable({
  providedIn: 'root'
})
export class KiosksService{
  private endpoint: string = '/kiosks'

  constructor(private http: HttpClient, private userService: UserService) {
  }

  getAll(): Observable<Kiosk[]> {
    return this.http.get<Kiosk[]>(environment.url + this.endpoint + '/all', {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  getById(id: string): Observable<Kiosk> {
    return this.http.get<Kiosk>(environment.url + this.endpoint + `/${id}`, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  addKiosk(kiosk: Kiosk) {
    this.http.post(environment.url + this.endpoint + '/add', kiosk, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    }).subscribe();
  }

  updateKiosk(kiosk: Kiosk) {
    this.http.post(environment.url + this.endpoint + '/update', kiosk, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    }).subscribe();
  }

  deleteKiosk(kiosk: Kiosk) {
     this.http.delete(environment.url + this.endpoint + '/delete', {
       headers: this.userService.getAuthorizationHeader(),
       responseType: 'json',
       body : kiosk
     }).subscribe();
  }

}
