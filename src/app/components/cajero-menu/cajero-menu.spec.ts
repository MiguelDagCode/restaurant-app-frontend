import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CajeroMenuComponent } from './cajero-menu.component';


describe('CajeroMenu', () => {
  let component: CajeroMenuComponent;
  let fixture: ComponentFixture<CajeroMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajeroMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajeroMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
