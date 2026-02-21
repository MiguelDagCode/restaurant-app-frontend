import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CocinaMenuComponent } from './cocina-menu.component';



describe('CocinaMenuComponent', () => {
  let component: CocinaMenuComponent;
  let fixture: ComponentFixture<CocinaMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocinaMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocinaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
