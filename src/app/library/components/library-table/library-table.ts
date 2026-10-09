import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

import { Book } from '../../interfaces/book';
import { Sort, SortColumn } from '../../interfaces/sort';

@Component({
  selector: 'app-library-table',
  styleUrl: './library-table.scss',
  templateUrl: './library-table.html',
})
export class LibraryTable {
  public readonly books: InputSignal<Book[]> = input<Book[]>([]);

  public readonly sort: InputSignal<Sort | null> = input<Sort | null>(null);

  public readonly sortChange: OutputEmitterRef<SortColumn> = output<SortColumn>();

  public readonly editBook: OutputEmitterRef<string> = output<string>();

  public readonly deleteBook: OutputEmitterRef<string> = output<string>();

  /**
   * Returns a specific icon depending on sort column.
   *
   * @param {SortColumn} column
   * @protected
   */
  protected sortIcon(column: SortColumn): string | undefined {
    const sort: Sort | null = this.sort();

    if (sort?.column !== column) {
      return;
    }

    return sort.direction === 'asc' ? '\u2191' : '\u2193';
  }
}
