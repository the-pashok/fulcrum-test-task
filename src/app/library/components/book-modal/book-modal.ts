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

import { Book } from '../../interfaces/book';

@Component({
  selector: 'app-book-modal',
  styleUrl: './book-modal.scss',
  templateUrl: './book-modal.html',
  imports: [ReactiveFormsModule],
})
export class BookModal implements OnInit {
  public readonly book: InputSignal<Book | null> = input<Book | null>(null);

  protected readonly modalTitle: Signal<string> = computed<string>(() =>
    this.book() ? 'Edit book' : 'Add a book',
  );

  public readonly closed: OutputEmitterRef<void> = output<void>();

  public readonly saveBook: OutputEmitterRef<Book> = output<Book>();

  private readonly dialogRef: Signal<ElementRef<HTMLDialogElement>> =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public formGroup: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    author: new FormControl(null, [Validators.required]),
    pages: new FormControl(null, [Validators.required, Validators.min(1)]),
  });

  constructor() {
    afterNextRender((): void => this.dialogRef().nativeElement.showModal());
  }

  public ngOnInit(): void {
    const book: Book | null = this.book();

    if (book) {
      this.formGroup.patchValue({
        title: book.title,
        author: book.author,
        pages: book.pages,
      });
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogRef().nativeElement) {
      this.cancel();
    }
  }

  protected cancel(): void {
    this.closed.emit();
  }

  protected submit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.saveBook.emit(this.formGroup.value);
  }
}
