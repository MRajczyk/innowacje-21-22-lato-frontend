import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {UserService} from './user.service';
import {MapMovementData} from "../models/map-movement-data";

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private endpoint: string = '/movement';
  private endpointMaps: string = '/test_map';

  constructor(private http: HttpClient, private userService: UserService) {
  }

  mapDownload(mapId: string): Observable<Blob> {
    // @ts-ignore
    return this.http.get(environment.url + this.endpoint + this.endpointMaps + '/download/' + mapId + '.jpg', {
      responseType : 'blob',
      headers: this.userService.getAuthorizationHeader()
    });
  }

  getMapData(mapId: string): Observable<MapMovementData> {
    return this.http.get<MapMovementData>(environment.url + this.endpoint + this.endpointMaps + '/' + mapId, {
      responseType: 'json',
      headers: this.userService.getAuthorizationHeader()
    });
  }

  /**
   * endpoint: /movement/test_map/all
   */
  getAllMapsData(): Observable<MapMovementData[]> {
    return this.http.get<MapMovementData[]>(environment.url + this.endpoint + this.endpointMaps + "/all",{
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }
}
