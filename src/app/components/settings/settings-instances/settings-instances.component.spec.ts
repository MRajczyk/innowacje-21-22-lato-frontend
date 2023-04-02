import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsInstancesComponent } from './settings-instances.component';

describe('SettingsInstancesComponent', () => {
  let component: SettingsInstancesComponent;
  let fixture: ComponentFixture<SettingsInstancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsInstancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsInstancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
