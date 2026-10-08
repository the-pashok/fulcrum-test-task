import { Component, model, ModelSignal } from '@angular/core';

@Component({
  selector: 'app-library-search',
  styleUrl: './library-search.scss',
  templateUrl: './library-search.html',
})
export class LibrarySearch {
  public readonly search: ModelSignal<string | null> = model<string | null>(null);

  protected onSearch(event: Event): void {
    const element = event.target as HTMLInputElement;

    this.search.set(element.value);
  }
}
