import { TestBed } from '@angular/core/testing';
import { PerfilTrabajadorClient } from './perfil-trabajador';

describe('PerfilTrabajadorClient', () => {
  let service: PerfilTrabajadorClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilTrabajadorClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
