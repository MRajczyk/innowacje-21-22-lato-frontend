import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsMapsComponent } from './settings-maps.component';

describe('SettingsMapsComponent', () => {
  let component: SettingsMapsComponent;
  let fixture: ComponentFixture<SettingsMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsMapsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
