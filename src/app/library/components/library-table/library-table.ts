import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

import { Book } from '../../interfaces/book';

@Component({
  selector: 'app-library-table',
  styleUrl: './library-table.scss',
  templateUrl: './library-table.html',
})
export class LibraryTable {
  public readonly books: InputSignal<Book[]> = input<Book[]>([]);

  protected readonly editBook: OutputEmitterRef<string> = output<string>();

  protected readonly deleteBook: OutputEmitterRef<string> = output<string>();
}
