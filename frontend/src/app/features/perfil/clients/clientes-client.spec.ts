import { TestBed } from '@angular/core/testing';
import { ClientesClient } from './clientes-client';

describe('ClientesClient', () => {
  let service: ClientesClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientesClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
