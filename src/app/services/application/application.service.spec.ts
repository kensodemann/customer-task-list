import { inject, TestBed } from '@angular/core/testing';
import { AlertController, Platform } from '@ionic/angular';

import { ApplicationService } from './application.service';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
  createPlatformMock,
  createSwUpdateMock
} from '../../../../test/mocks';
import { SwUpdate } from '@angular/service-worker';

describe('ApplicationService', () => {
  let alert;
  let application: ApplicationService;
  beforeEach(() => {
    alert = createOverlayElementMock('Alert');
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AlertController,
          useFactory: () =>
            createOverlayControllerMock('AlertComtroller', alert)
        },
        { provide: SwUpdate, useFactory: createSwUpdateMock },
        { provide: Platform, useFactory: createPlatformMock }
      ]
    });
  });

  beforeEach(inject([ApplicationService], (service: ApplicationService) => {
    application = service;
  }));

  it('should be created', () => {
    expect(application).toBeTruthy();
  });

  describe('show tabs', () => {
    [
      { plt: 'tablet', expected: false },
      { plt: 'desktop', expected: false },
      { plt: 'phablet', expected: true },
      { plt: 'iphone', expected: true }
    ].forEach(test => {
      it(`is ${test.expected} for "${test.plt}"`, () => {
        const platform = TestBed.get(Platform);
        platform.is.and.returnValue(false);
        platform.is.withArgs(test.plt).and.returnValue(true);
        expect(application.showTabs).toEqual(test.expected);
      });
    });
  });
});
