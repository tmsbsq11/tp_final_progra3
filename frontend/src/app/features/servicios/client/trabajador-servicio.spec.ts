import { TestBed } from '@angular/core/testing';
import { TrabajadorServicio } from './trabajador-servicio';

describe('TrabajadorServicio', () => {
  let service: TrabajadorServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrabajadorServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
