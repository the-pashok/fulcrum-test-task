import { Component, computed, signal, Signal, WritableSignal } from '@angular/core';

import { LibraryUploadError } from './components/library-upload-error/library-upload-error';
import { LibraryHeader } from './components/library-header/library-header';
import { LibrarySearch } from './components/library-search/library-search';
import { LibraryEmpty } from './components/library-empty/library-empty';
import { LibraryTable } from './components/library-table/library-table';
import { BookModal } from './components/book-modal/book-modal';
import { ParsedBooksResult } from './interfaces/parse-xml';
import { Book } from './interfaces/book';
import { LibrarySearchEmpty } from './components/library-search-empty/library-search-empty';

@Component({
  imports: [
    LibraryEmpty,
    LibraryHeader,
    LibrarySearch,
    LibraryTable,
    LibraryUploadError,
    BookModal,
    LibrarySearchEmpty,
  ],
  selector: 'app-library',
  styleUrl: './library.scss',
  templateUrl: './library.html',
})
export class Library {
  protected readonly books: WritableSignal<Book[]> = signal<Book[]>([]);

  protected readonly search: WritableSignal<string | null> = signal<string | null>(null);
  protected readonly errorText: WritableSignal<string | null> = signal<string | null>(null);
  protected readonly selectedBookUuidToEdit: WritableSignal<string | null> = signal<string | null>(
    null,
  );

  protected readonly isBookModalVisible: WritableSignal<boolean> = signal<boolean>(false);

  protected readonly selectedBook: Signal<Book | null> = computed<Book | null>(
    (): Book | null =>
      this.books().find((book: Book): boolean => book.uuid === this.selectedBookUuidToEdit()) ??
      null,
  );

  protected readonly filteredBooks: Signal<Book[]> = computed<Book[]>((): Book[] => {
    const query: string | undefined = this.search()?.trim()?.toLowerCase();

    if (!query) {
      return this.books();
    }

    return this.books().filter(
      (book: Book): boolean =>
        book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query),
    );
  });

  public loadBooksFromXML(result: ParsedBooksResult): void {
    this.resetState();

    if (!result.ok) {
      this.errorText.set(result.error);
      return;
    }

    this.books.set(result.books);
  }

  public closeBookModal(): void {
    this.selectedBookUuidToEdit.set(null);
    this.isBookModalVisible.set(false);
  }

  public startEditBook(bookUuid: string): void {
    this.selectedBookUuidToEdit.set(bookUuid);
    this.isBookModalVisible.set(true);
  }

  public deleteBook(bookUuid: string): void {
    this.books.update((books: Book[]): Book[] =>
      books.filter((book: Book): boolean => book.uuid !== bookUuid),
    );
  }

  public saveBook(bookValue: Book): void {
    const uuid: string | null = this.selectedBookUuidToEdit();

    if (uuid) {
      this.books.update((books: Book[]): Book[] =>
        books.map((book: Book): Book =>
          book.uuid === uuid ? { ...book, ...bookValue, uuid } : book,
        ),
      );
    } else {
      this.books.update((books: Book[]): Book[] => [
        { ...bookValue, uuid: crypto.randomUUID() },
        ...books,
      ]);
    }

    this.closeBookModal();
  }

  public dismissError(): void {
    this.errorText.set(null);
  }

  public resetState(): void {
    this.search.set(null);
    this.errorText.set(null);
    this.selectedBookUuidToEdit.set(null);
  }
}
