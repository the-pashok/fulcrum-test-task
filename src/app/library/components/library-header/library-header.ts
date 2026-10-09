import { Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

import { ParseXmlService } from '../../services/parse-xml';
import { ParsedBooksResult } from '../../interfaces/parse-xml';
import { Book } from '../../interfaces/book';

@Component({
  selector: 'app-library-header',
  styleUrl: './library-header.scss',
  templateUrl: './library-header.html',
})
export class LibraryHeader {
  public readonly books: InputSignal<Book[]> = input<Book[]>([]);

  public readonly openAddBookModal: OutputEmitterRef<void> = output<void>();

  public readonly loadBooksFromXML: OutputEmitterRef<ParsedBooksResult> = output<ParsedBooksResult>();

  private readonly parseXmlService: ParseXmlService = inject(ParseXmlService);

  /**
   * Method is called when user clicks on file upload button: Upload XML.
   *
   * @param {Event} event
   * @protected
   */
  protected onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }

    const reader = new FileReader();

    const file: File = fileInput.files[0];

    reader.onload = (event: ProgressEvent<FileReader>): void => {
      const xml = event.target?.result as string;

      if (xml) {
        const result: ParsedBooksResult = this.parseXmlService.getParsedBooks(xml);

        this.loadBooksFromXML.emit(result);
      }

      // reset file input
      fileInput.value = '';
    }

    // Deteck errors
    reader.onerror = (): void => {
      this.loadBooksFromXML.emit({
        ok: false,
        error: `Couldn't read ${file.name}`,
      });

      // reset file input
      fileInput.value = '';
    };

    reader.readAsText(file);
  }

  /**
   * Save XML document and generate a link for triggering download.
   *
   * @protected
   */
  protected onSaveXmlClick(): void {
    const xml: string = this.parseXmlService.exportXML(this.books());
    const blob: Blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url: string = URL.createObjectURL(blob);
    const link: HTMLAnchorElement = document.createElement('a');

    link.href = url;
    link.download = 'library.xml';
    link.click();

    URL.revokeObjectURL(url);
  }
}
