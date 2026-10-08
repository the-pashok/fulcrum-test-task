import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibrarySearchEmpty } from './library-search-empty';

describe('LibraryEmptyState', () => {
  let component: LibrarySearchEmpty;
  let fixture: ComponentFixture<LibrarySearchEmpty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrarySearchEmpty],
    }).compileComponents();

    fixture = TestBed.createComponent(LibrarySearchEmpty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
