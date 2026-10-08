import { Service } from '@angular/core';

import { Book } from '../library/interfaces/book';

const FILE_FORMAT: DOMParserSupportedType = 'text/xml';

@Service()
export class ParseXmlService {
  private parseXml(xml: string): Document | undefined {
    const parser = new DOMParser();

    const xmlDoc: Document = parser.parseFromString(xml, FILE_FORMAT);

    const parserError: Element | null = xmlDoc.querySelector('parsererror');

    if (parserError) {
      console.error('XML Parsing Error:', parserError.textContent);
      return;
    }

    return xmlDoc;
  }

  public getBooks(xml: string): Book[] {
    const xmlDoc: Document | undefined = this.parseXml(xml);
    console.log(xmlDoc);

    if (!xmlDoc) {
      return [];
    }

    const parsedBooks: Book[] = [];
    const bookElements: HTMLCollectionOf<Element> = xmlDoc.getElementsByTagName('book');

    for (let i: number = 0; i < bookElements.length; i++) {
      const bookNode: Element = bookElements[i];

      const title: string = bookNode.getElementsByTagName('title')[0]?.textContent || 'Unknown Title';
      const author: string = bookNode.getElementsByTagName('author')[0]?.textContent || 'Unknown Author';
      const pagesText: string = bookNode.getElementsByTagName('pages')[0]?.textContent || '0';

      parsedBooks.push({
        title,
        author,
        pages: parseInt(pagesText, 10) || 0
      });
    }

    return parsedBooks;
  }
}
