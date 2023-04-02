import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

import {Graphs2} from "../models/graphs2/graphs2";

@Injectable({
  providedIn: 'root'
})
export class GraphsService {
  private endpoint: string = '/graphs2';

  constructor(private http: HttpClient, private userService: UserService) {
  }

  /**
   * Returns all
   */
  getAll(): Observable<Graphs2[]> {
    return this.http.get<Graphs2[]>(environment.url + this.endpoint + '/all', {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  /**
   * Return list of graphs with matching mapId.
   * @param mapId Map id to which belong returned graphs.
   */
  getGraphsOfMap(mapId: string): Observable<Graphs2[]> {
    return this.http.get<Graphs2[]>(environment.url + this.endpoint + '/map-id/' + mapId, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  /**
   * Returns whole content of graph with given id.
   * @param id Id of desired graph.
   */
  getGraph(id: string): Observable<Graphs2> {
    return this.http.get<Graphs2>(environment.url + this.endpoint + '/' + id, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  /**
   * Sets graph object with equal "id" attribute.
   * All nodes and edges are required!!!
   * Request can also update the whole content of existing graph.
   * Attribute "mapId" is optional, when not present sets mapId as default map from settings.
   * @param graph Complete object of graph. Attributes "id", "nodes" and "edges" are required, "mapId" is optional.
   * @returns Returns complete object when added.
   */
  add(graph: Graphs2): Observable<Graphs2> {
    return this.http.post<Graphs2>(environment.url + this.endpoint + '/add', graph,{
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  /**
   * Almost the same as add() function.
   * It can update non-existing graph id, it causes creation of new one.
   * Sets graph object with equal "id" attribute.
   * All nodes and edges are required!!!
   * Request updates the whole content of existing graph.
   * Attribute "mapId" is optional, when not present sets mapId as default map from settings.
   * @param graph Complete object of graph
   * @return Returns complete graph object after update.
   */
  update(graph: Graphs2): Observable<Graphs2> {
    return this.http.post<Graphs2>(environment.url + this.endpoint + '/update', graph, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  /**
   * Deletes graph with given id
   * @return Returns empty body or error
   */
  deleteById(id: string): Observable<string> {
    return this.http.delete(environment.url + this.endpoint + '/delete/' + id, {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'text'
    });
  }

  /**
   * Deletes graph matching provided object. Backend compares "id" attribute and deletes.
   * @param graph Graph with "id" required.
   * @return Returns empty body or error
   */
  deleteGraph(graph: {id: string}): Observable<string> {
    return this.http.delete(environment.url + this.endpoint + '/delete', {
      headers: this.userService.getAuthorizationHeader(),
      responseType: 'text',
      body: graph
    });
  }
}
