import { TestBed } from '@angular/core/testing';
import { ClientePerfilClient } from './perfil-client';

describe('PerfilClient', () => {
  let service: ClientePerfilClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientePerfilClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
