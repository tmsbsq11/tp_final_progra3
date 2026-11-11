import { TestBed } from '@angular/core/testing';
import { ClienteServicios } from './cliente-servicios';

describe('ClienteServicios', () => {
  let service: ClienteServicios;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteServicios);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
