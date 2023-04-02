import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskElementComponent } from './kiosk-element.component';

describe('KioskElementComponent', () => {
  let component: KioskElementComponent;
  let fixture: ComponentFixture<KioskElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KioskElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
