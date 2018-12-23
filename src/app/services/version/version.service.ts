import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Version } from '../../models/version';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  constructor(private http: HttpClient) {}

  get(): Observable<Version> {
    return this.http.get<Version>('assets/version.json');
  }
}
