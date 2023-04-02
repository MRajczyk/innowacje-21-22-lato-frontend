import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskDialogComponent } from './kiosk-dialog.component';

describe('KioskDialogComponent', () => {
  let component: KioskDialogComponent;
  let fixture: ComponentFixture<KioskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KioskDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
