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

  protected readonly openAddBookModal: OutputEmitterRef<void> = output<void>();

  protected readonly loadBooksFromXML: OutputEmitterRef<ParsedBooksResult> = output<ParsedBooksResult>();

  private readonly parseXmlService: ParseXmlService = inject(ParseXmlService);

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const reader = new FileReader();

    const file: File = input.files[0];

    reader.onload = (event: ProgressEvent<FileReader>): void => {
      const xml = event.target?.result as string;

      if (xml) {
        const result: ParsedBooksResult = this.parseXmlService.getParsedBooks(xml, file.name);

        this.loadBooksFromXML.emit(result);
      }
    }

    reader.readAsText(file);
  }

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
