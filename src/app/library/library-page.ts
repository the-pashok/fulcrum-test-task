import { Component } from '@angular/core';

import { LibraryHeader } from './components/library-header/library-header';
import { LibrarySearch } from './components/library-search/library-search';
import { LibraryTable } from './components/library-table/library-table';

@Component({
  imports: [LibraryHeader, LibrarySearch, LibraryTable],
  selector: 'app-library-page',
  styleUrl: './library-page.scss',
  templateUrl: './library-page.html',
})
export class LibraryPage {}
