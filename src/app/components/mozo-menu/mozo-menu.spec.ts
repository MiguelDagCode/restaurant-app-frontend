import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MozoMenuComponent } from './mozo-menu.component';



describe('MozoMenu', () => {
  let component: MozoMenuComponent;
  let fixture: ComponentFixture<MozoMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MozoMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MozoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
