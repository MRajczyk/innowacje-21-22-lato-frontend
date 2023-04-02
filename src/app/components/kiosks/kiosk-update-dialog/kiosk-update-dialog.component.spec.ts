import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskUpdateDialogComponent } from './kiosk-update-dialog.component';

describe('KioskUpdateDialogComponent', () => {
  let component: KioskUpdateDialogComponent;
  let fixture: ComponentFixture<KioskUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KioskUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
