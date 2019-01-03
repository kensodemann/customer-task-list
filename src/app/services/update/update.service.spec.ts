import { inject, TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';

import { UpdateService } from './update.service';

import {
  createOverlayControllerMock,
  createOverlayElementMock,
  createSwUpdateMock
} from '../../../../test/mocks';
import { SwUpdate } from '@angular/service-worker';

describe('UpdateService', () => {
  let alert;
  let alertController;
  let swUpdate;
  let update: UpdateService;

  beforeEach(() => {
    alert = createOverlayElementMock('Alert');
    alertController = createOverlayControllerMock('AlertController', alert);
    swUpdate = createSwUpdateMock();
    TestBed.configureTestingModule({
      providers: [
        { provide: AlertController, useVaule: alertController },
        { provide: SwUpdate, useVaule: swUpdate }
      ]
    });
  });

  beforeEach(inject([UpdateService], (service: UpdateService) => {
    update = service;
  }));

  it('should be created', () => {
    const service: UpdateService = TestBed.get(UpdateService);
    expect(service).toBeTruthy();
  });
});
