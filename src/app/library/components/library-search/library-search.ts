import { Component, model, ModelSignal } from '@angular/core';

@Component({
  selector: 'app-library-search',
  styleUrl: './library-search.scss',
  templateUrl: './library-search.html',
})
export class LibrarySearch {
  // Two-way binding search from child to parent
  public readonly search: ModelSignal<string | null> = model<string | null>(null);

  /**
   * Safe way to set a value from input search field.
   *
   * @param {Event} event
   * @protected
   */
  protected onSearch(event: Event): void {
    const element = event.target as HTMLInputElement;

    this.search.set(element.value);
  }
}
