import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiosksComponent } from './kiosks.component';

describe('KiosksComponent', () => {
  let component: KiosksComponent;
  let fixture: ComponentFixture<KiosksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KiosksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KiosksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
