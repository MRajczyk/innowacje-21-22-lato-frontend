import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Stand } from '../models/stand';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class StandsService {
    private endpoint: string = '/movement/stands'

    constructor(
        private http: HttpClient,
        private userService: UserService
    ) { }


  /**
   * Returns all
   */
  getAll(): Observable<Stand[]> {
    return this.http.get<Stand[]>(environment.url + this.endpoint + '/all', {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  /**
   * Returns list of manage-stands with matching mapId.
   * @param mapId Map id to which belong returned graphs.
   */
  getStandsOfMap(mapId: string): Observable<Stand[]> {
    return this.http.get<Stand[]>(environment.url + this.endpoint + '/map-id/' + mapId, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  /**
   * Returns stand with matching standId
   * @param standId Stand id to which belong returned graphs.
   */
  getStand(standId: string): Observable<Stand> {
    return this.http.get<Stand>(environment.url + this.endpoint + '/' + standId, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  /**
   * Sends new Stand object to the server
   * @param stand Stand object to be sent to the server
   */
  addStand(stand: Stand): Observable<Stand> {
    return this.http.post<Stand>(`${environment.url}${this.endpoint}/add`, stand, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  /**
   * Updates Stand on the server with matching id,
   * When there is none, adds a new one
   * @param stand Stand object to be sent to the server
   */
  updateStand(stand: Stand): Observable<Stand> {
    return this.http.post<Stand>(`${environment.url}${this.endpoint}/update`, stand, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  /**
   * Deletes stand with matching id from the server
   * @param id id of a stand to be deleted
   */
  deleteById(id: string): Observable<Stand> {
    return this.http.delete<Stand>(`${environment.url}${this.endpoint}/delete/${id}`, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  /**
   * Deletes stand with matching object
   * @param stand Stand object to be sent in body
   */
  deleteStand(stand: Stand): Observable<string> {
    return this.http.delete(`${environment.url}${this.endpoint}/delete`, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'text',
      body: stand
    });
  }
}
