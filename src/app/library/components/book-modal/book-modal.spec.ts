import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookModal } from './book-modal';

describe('BookModal', () => {
  let component: BookModal;
  let fixture: ComponentFixture<BookModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookModal],
    }).compileComponents();

    fixture = TestBed.createComponent(BookModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
