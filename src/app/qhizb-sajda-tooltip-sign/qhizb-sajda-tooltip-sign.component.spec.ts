/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QhizbSajdaTooltipSignComponent } from './qhizb-sajda-tooltip-sign.component';

describe('QhizbSajdaTooltipSignComponent', () => {
  let component: QhizbSajdaTooltipSignComponent;
  let fixture: ComponentFixture<QhizbSajdaTooltipSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QhizbSajdaTooltipSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QhizbSajdaTooltipSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
