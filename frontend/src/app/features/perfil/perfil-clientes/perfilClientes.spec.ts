import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilClientes } from './perfilClientes';

describe('Perfil', () => {
  let component: PerfilClientes;
  let fixture: ComponentFixture<PerfilClientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilClientes],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilClientes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
