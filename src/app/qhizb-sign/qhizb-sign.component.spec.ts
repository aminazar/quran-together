/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QhizbSignComponent } from './qhizb-sign.component';

describe('QhizbSignComponent', () => {
  let component: QhizbSignComponent;
  let fixture: ComponentFixture<QhizbSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QhizbSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QhizbSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
