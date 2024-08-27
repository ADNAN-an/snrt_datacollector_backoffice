import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDistributionComponent } from './event-distribution.component';

describe('EventDistributionComponent', () => {
  let component: EventDistributionComponent;
  let fixture: ComponentFixture<EventDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
