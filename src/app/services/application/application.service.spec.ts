import { inject, TestBed } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';
import { AlertController, Platform } from '@ionic/angular';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
  createPlatformMock,
  createSwUpdateMock,
} from '@test/mocks';
import { ApplicationService } from './application.service';

describe('ApplicationService', () => {
  let alert: any;
  let application: ApplicationService;
  beforeEach(() => {
    alert = createOverlayElementMock();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AlertController,
          useFactory: () => createOverlayControllerMock(alert),
        },
        { provide: SwUpdate, useFactory: createSwUpdateMock },
        { provide: Platform, useFactory: createPlatformMock },
      ],
    });
  });

  beforeEach(inject([ApplicationService], (service: ApplicationService) => {
    application = service;
  }));

  it('should be created', () => {
    expect(application).toBeTruthy();
  });

  describe('registered for updates', () => {
    beforeEach(() => {
      alert.onDidDismiss.mockResolvedValue({ role: 'cancel' });
      const service: ApplicationService = TestBed.inject(ApplicationService);
      service.registerForUpdates();
    });

    it('asks the user if they would like an update', () => {
      const update = TestBed.inject(SwUpdate);
      const alertController = TestBed.inject(AlertController);
      expect(alertController.create).not.toHaveBeenCalled();
      (update.available as any).next();
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('show tabs', () => {
    [
      { plt: 'tablet', expected: false },
      { plt: 'desktop', expected: false },
      { plt: 'phablet', expected: true },
      { plt: 'iphone', expected: true },
    ].forEach((test) => {
      it(`is ${test.expected} for "${test.plt}"`, () => {
        const platform = TestBed.inject(Platform);
        platform.is = jest.fn((arg) => arg === test.plt);
        expect(application.showTabs).toEqual(test.expected);
      });
    });
  });
});
