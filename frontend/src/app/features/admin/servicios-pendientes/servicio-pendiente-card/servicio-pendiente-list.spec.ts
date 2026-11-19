import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ServicioPendienteList} from './servicio-pendiente-list'

describe('ServicioPendienteCard', () => {
  let component: ServicioPendienteList;
  let fixture: ComponentFixture<ServicioPendienteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioPendienteList],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioPendienteList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
