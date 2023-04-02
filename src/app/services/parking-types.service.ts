import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParkingType } from '../models/parking-type';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ParkingTypesService {
  private endpoint: string = '/type/parking-types'

  constructor(private http: HttpClient, private userService: UserService) { }

  getAll(): Observable<ParkingType[]> {
      return this.http.get<ParkingType[]>(environment.url + this.endpoint + '/all', {
          headers: this.userService.getAuthorizationHeader(),
          responseType: 'json'
      });
  }
}
