import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryUploadError } from './library-upload-error';

describe('LibraryUploadError', () => {
  let component: LibraryUploadError;
  let fixture: ComponentFixture<LibraryUploadError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryUploadError],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryUploadError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
