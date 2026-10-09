import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookModal } from './book-modal';

describe('BookModal', (): void => {
  let component: BookModal;
  let fixture: ComponentFixture<BookModal>;

  beforeEach(async (): Promise<void> => {
    HTMLDialogElement.prototype.showModal = vi.fn();

    await TestBed.configureTestingModule({
      imports: [BookModal],
    }).compileComponents();

    fixture = TestBed.createComponent(BookModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
