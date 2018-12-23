import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPage } from './about.page';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { VersionService } from '../services/version/version.service';
import { createAuthenticationServiceMock } from '../services/authentication/authentication.mock';
import { createVersionServiceMock } from '../services/version/version.mock';

describe('AboutPage', () => {
  let authentication;
  let component: AboutPage;
  let fixture: ComponentFixture<AboutPage>;
  let version;

  beforeEach(async(() => {
    authentication = createAuthenticationServiceMock();
    version = createVersionServiceMock();
    TestBed.configureTestingModule({
      declarations: [AboutPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthenticationService, useValue: authentication },
        { provide: VersionService, useValue: version }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('gets the version', () => {
    expect(version.get).toHaveBeenCalledTimes(1);
  });

  it('assigns the version', () => {
    expect(component.appVersion).toEqual({
      version: '0.0.1',
      name: 'testy test',
      date: '2018-12-23'
    });
  });
});
