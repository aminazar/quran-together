/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AyaSajdaSignComponent } from './aya-sajda-sign.component';

describe('AyaSajdaSignComponent', () => {
  let component: AyaSajdaSignComponent;
  let fixture: ComponentFixture<AyaSajdaSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AyaSajdaSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AyaSajdaSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
