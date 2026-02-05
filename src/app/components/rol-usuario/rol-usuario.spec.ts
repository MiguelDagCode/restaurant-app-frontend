import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolUsuarioComponent } from './rol-usuario.component';


describe('RolUsuario', () => {
  let component: RolUsuarioComponent;
  let fixture: ComponentFixture<RolUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
