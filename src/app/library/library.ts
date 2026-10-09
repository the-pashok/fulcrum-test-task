import { Component, computed, signal, Signal, WritableSignal } from '@angular/core';

import { LibraryUploadError } from './components/library-upload-error/library-upload-error';
import { LibrarySearchEmpty } from './components/library-search-empty/library-search-empty';
import { LibraryHeader } from './components/library-header/library-header';
import { LibrarySearch } from './components/library-search/library-search';
import { LibraryEmpty } from './components/library-empty/library-empty';
import { LibraryTable } from './components/library-table/library-table';
import { BookModal } from './components/book-modal/book-modal';
import { ParsedBooksResult } from './interfaces/parse-xml';
import { Book, BookFormValue } from './interfaces/book';
import { Sort, SortColumn } from './interfaces/sort';

@Component({
  imports: [
    LibraryEmpty,
    LibraryHeader,
    LibrarySearch,
    LibraryTable,
    LibraryUploadError,
    LibrarySearchEmpty,
    BookModal,
  ],
  selector: 'app-library',
  templateUrl: './library.html',
})
export class Library {
  protected readonly books: WritableSignal<Book[]> = signal<Book[]>([]);

  protected readonly search: WritableSignal<string | null> = signal<string | null>(null);
  protected readonly errorText: WritableSignal<string | null> = signal<string | null>(null);
  protected readonly selectedBookUuidToEdit: WritableSignal<string | null> = signal<string | null>(
    null,
  );

  protected readonly sort: WritableSignal<Sort | null> = signal<Sort | null>(null);

  protected readonly isBookModalVisible: WritableSignal<boolean> = signal<boolean>(false);

  // Has value when user wants to edit a book. Depends on selected book uuid
  protected readonly selectedBook: Signal<Book | null> = computed<Book | null>(
    (): Book | null =>
      this.books().find((book: Book): boolean => book.uuid === this.selectedBookUuidToEdit()) ??
      null,
  );

  // Filter books by title or author during the search.
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

  // Sorting books
  protected readonly sortedBooks: Signal<Book[]> = computed<Book[]>((): Book[] => {
    const sort: Sort | null = this.sort();
    const books: Book[] = this.filteredBooks();

    if (!sort) {
      return books;
    }

    const direction: number = sort.direction === 'asc' ? 1 : -1;

    return [...books].sort((prev: Book, next: Book): number => {
      // string or number because we have title and author as stings
      // and pages as number
      const left: string | number = prev[sort.column];
      const right: string | number = next[sort.column];

      // Safe check if type is number
      const result: number = (typeof left === 'number' && typeof right === 'number')
        ? left - right
        // Convert them into string
        : String(left).localeCompare(String(right));

      // Easy way to change the sort
      // * -1 = 1
      // * 1 = -1
      return result * direction;
    });
  });

  /**
   * Update sort signal by setting a current column: "title" or "author" or "pages".
   *
   * @param {SortColumn} column
   * @protected
   */
  protected changeSort(column: SortColumn): void {
    this.sort.update((sort: Sort | null): Sort | null => {
      if (sort?.column !== column) {
        return {
          column,
          direction: 'asc',
        };
      }

      return sort.direction === 'asc' ? { column, direction: 'desc' } : null;
    });
  }

  /**
   * Get books array.
   *
   * @param {ParsedBooksResult} result
   * @protected
   */
  protected loadBooksFromXML(result: ParsedBooksResult): void {
    this.resetState();

    if (!result.ok) {
      this.errorText.set(result.error);
      return;
    }

    this.books.set(result.books);
  }

  /**
   * Close a modal and reset selected book uuid tp null.
   *
   * @protected
   */
  protected closeBookModal(): void {
    this.selectedBookUuidToEdit.set(null);
    this.isBookModalVisible.set(false);
  }

  /**
   * Edit a book. Display a modal.
   *
   * @param {string} bookUuid
   * @protected
   */
  protected startEditBook(bookUuid: string): void {
    this.selectedBookUuidToEdit.set(bookUuid);
    this.isBookModalVisible.set(true);
  }

  /**
   * Delete a selected book.
   *
   * @param {string} bookUuid
   * @protected
   */
  protected deleteBook(bookUuid: string): void {
    this.books.update((books: Book[]): Book[] =>
      books.filter((book: Book): boolean => book.uuid !== bookUuid),
    );
  }

  /**
   * Save a book and add to library table. Detects if editing or adding a new book.
   *
   * @param {BookFormValue} bookValue
   * @protected
   */
  protected saveBook(bookValue: BookFormValue): void {
    const uuid: string | null = this.selectedBookUuidToEdit();

    if (uuid) {
      // Editing
      this.books.update((books: Book[]): Book[] =>
        books.map((book: Book): Book =>
          book.uuid === uuid ? { ...book, ...bookValue, uuid } : book,
        ),
      );
    } else {
      // Adding
      this.books.update((books: Book[]): Book[] => [
        ...books,
        { ...bookValue, uuid: crypto.randomUUID() },
      ]);
    }

    this.closeBookModal();
  }

  /**
   * Clear error state.
   *
   * @protected
   */
  protected dismissError(): void {
    this.errorText.set(null);
  }

  /**
   * Resets search, error and selected book uuid states.
   *
   * @protected
   */
  protected resetState(): void {
    this.search.set(null);
    this.errorText.set(null);
    this.selectedBookUuidToEdit.set(null);
  }
}
