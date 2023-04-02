import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStandsComponent } from './manage-stands.component';

describe('StandsComponent', () => {
  let component: ManageStandsComponent;
  let fixture: ComponentFixture<ManageStandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageStandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
