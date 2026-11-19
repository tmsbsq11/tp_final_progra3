import { TestBed } from '@angular/core/testing';
import { NotificacionClient } from './notificacion-client';

describe('NotificacionClient', () => {
  let service: NotificacionClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
