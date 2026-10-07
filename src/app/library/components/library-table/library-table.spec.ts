import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryTable } from './library-table';

describe('LibraryTable', () => {
  let component: LibraryTable;
  let fixture: ComponentFixture<LibraryTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryTable],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
