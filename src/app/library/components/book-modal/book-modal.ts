import {
  Component,
  afterNextRender,
  ElementRef,
  OutputEmitterRef,
  Signal,
  OnInit,
  InputSignal,
  viewChild,
  input,
  output,
  computed,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { Book, BookFormValue } from '../../interfaces/book';

@Component({
  selector: 'app-book-modal',
  styleUrl: './book-modal.scss',
  templateUrl: './book-modal.html',
  imports: [ReactiveFormsModule],
})
export class BookModal implements OnInit {
  public readonly book: InputSignal<Book | null> = input<Book | null>(null);

  // returns modal title depending on if book passed from parent or not. "Edit" or "New book".
  protected readonly modalTitle: Signal<string> = computed<string>(() =>
    this.book() ? 'Edit book' : 'Add a book',
  );

  public readonly closed: OutputEmitterRef<void> = output<void>();

  public readonly saveBook: OutputEmitterRef<BookFormValue> = output<BookFormValue>();

  private readonly dialogRef: Signal<ElementRef<HTMLDialogElement>> =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly formGroup: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    author: new FormControl('', [Validators.required]),
    pages: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

  constructor() {
    // Safe trigger the modal open on initial browser render.
    afterNextRender((): void => this.dialogRef().nativeElement.showModal());
  }

  public ngOnInit(): void {
    const book: Book | null = this.book();

    // Detect if book passed and update form for editing feature.
    if (book) {
      this.formGroup.patchValue({
        title: book.title,
        author: book.author,
        pages: book.pages,
      });
    }
  }

  /**
   * Close a dialog on backdrop click.
   *
   * @param {MouseEvent} event
   * @protected
   */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogRef().nativeElement) {
      this.cancel();
    }
  }

  /**
   * Close a dialog.
   *
   * @protected
   */
  protected cancel(): void {
    this.closed.emit();
  }

  /**
   * Submit form
   *
   * @protected
   */
  protected submit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.saveBook.emit(this.formGroup.value);
  }
}
