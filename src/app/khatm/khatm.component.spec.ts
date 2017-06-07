import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhatmComponent } from './khatm.component';

describe('KhatmComponent', () => {
  let component: KhatmComponent;
  let fixture: ComponentFixture<KhatmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhatmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhatmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
