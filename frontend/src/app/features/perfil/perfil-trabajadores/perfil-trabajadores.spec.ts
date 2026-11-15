import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilTrabajadores } from './perfil-trabajadores';

describe('PerfilTrabajadores', () => {
  let component: PerfilTrabajadores;
  let fixture: ComponentFixture<PerfilTrabajadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilTrabajadores],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilTrabajadores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
