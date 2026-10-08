import { Component } from '@angular/core';

import { ParseXmlService } from '../../../services/parse-xml';

@Component({
  selector: 'app-library-header',
  styleUrl: './library-header.scss',
  templateUrl: './library-header.html',
})
export class LibraryHeader {
  constructor(private readonly parseXmlService: ParseXmlService) {}

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
        console.log('parsed data:');
        console.log(this.parseXmlService.getBooks(xml));
      }
    }

    reader.readAsText(file);
  }
}
