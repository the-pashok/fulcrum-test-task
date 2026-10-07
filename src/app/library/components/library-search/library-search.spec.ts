import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibrarySearch } from './library-search';

describe('LibrarySearch', () => {
  let component: LibrarySearch;
  let fixture: ComponentFixture<LibrarySearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrarySearch],
    }).compileComponents();

    fixture = TestBed.createComponent(LibrarySearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
