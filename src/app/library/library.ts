import { Component, signal, WritableSignal } from '@angular/core';

import { LibraryEmpty } from './components/library-empty/library-empty';
import { LibraryHeader } from './components/library-header/library-header';
import { LibrarySearch } from './components/library-search/library-search';
import { LibraryTable } from './components/library-table/library-table';
import { LibraryUploadError } from './components/library-upload-error/library-upload-error';
import { Book } from './interfaces/book';

@Component({
  imports: [LibraryEmpty, LibraryHeader, LibrarySearch, LibraryTable, LibraryUploadError],
  selector: 'app-library',
  styleUrl: './library.scss',
  templateUrl: './library.html',
})
export class Library {
  protected readonly books: WritableSignal<Book[]> = signal<Book[]>([]);

  protected readonly isErrorVisible: WritableSignal<boolean> = signal<boolean>(false);
}
