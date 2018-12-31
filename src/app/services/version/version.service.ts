import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Version } from '../../models/version';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  constructor(private http: HttpClient) {}

  get(): Observable<Version> {
    const params = {
      params: new HttpParams().set('_', new Date().getTime().toString())
    };
    return this.http.get<Version>('assets/version.json', params);
  }
}
