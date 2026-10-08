import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-library-search-empty',
  styleUrl: './library-search-empty.scss',
  templateUrl: './library-search-empty.html',
})
export class LibrarySearchEmpty {
  public readonly search: InputSignal<string | null> = input<string | null>(null);
}
