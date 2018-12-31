import { inject, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { VersionService } from './version.service';

describe('VersionService', () => {
  let httpTestingController: HttpTestingController;
  let versionService: VersionService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  beforeEach(inject([VersionService], (service: VersionService) => {
    httpTestingController = TestBed.get(HttpTestingController);
    versionService = service;
  }));

  it('should be created', () => {
    expect(versionService).toBeTruthy();
  });

  describe('get', () => {
    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2018-12-30T11:45:56.000-05:00'));
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('gets the current version data', () => {
      versionService.get().subscribe(v =>
        expect(v).toEqual({
          version: '0.0.1',
          name: 'articulate prayer',
          date: '2018-12-23'
        })
      );
      const req = httpTestingController.expectOne('assets/version.json?_=1546188356000');
      expect(req.request.method).toEqual('GET');
      req.flush({
        version: '0.0.1',
        name: 'articulate prayer',
        date: '2018-12-23'
      });
      httpTestingController.verify();
    });
  });
});
