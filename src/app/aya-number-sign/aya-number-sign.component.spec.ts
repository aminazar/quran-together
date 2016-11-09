/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AyaNumberSignComponent } from './aya-number-sign.component';

describe('AyaNumberSignComponent', () => {
  let component: AyaNumberSignComponent;
  let fixture: ComponentFixture<AyaNumberSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AyaNumberSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AyaNumberSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
