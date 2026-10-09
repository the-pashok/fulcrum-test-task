import { Service } from '@angular/core';

import { Book } from '../interfaces/book';
import { ParseXmlResult, ParsedBooksResult } from '../interfaces/parse-xml';

const FILE_FORMAT: DOMParserSupportedType = 'text/xml';
const XML_FILE_START = '<?xml version="1.0" encoding="UTF-8"?>';

@Service()
export class ParseXmlService {
  /**
   * Parsing an imported XML file. Returns an object with error or parsed xml document.
   *
   * @param {string} xml
   * @private
   */
  private importXML(xml: string): ParseXmlResult {
    const parser = new DOMParser();

    const xmlDocument: Document = parser.parseFromString(xml, FILE_FORMAT);

    const parserError: Element | null = xmlDocument.querySelector('parsererror');

    if (parserError) {
      return {
        ok: false,
        error: parserError.textContent,
      };
    }

    return {
      ok: true,
      document: xmlDocument,
    };
  }

  /**
   * Exports a XML document. Prepares a document with elements.
   *
   * @param {Book[]} books
   */
  public exportXML(books: Book[]): string {
    const xmlDocument: XMLDocument = document.implementation.createDocument(null, 'library');

    for (const book of books) {
      const bookElement: Element = xmlDocument.createElement('book');

      bookElement.appendChild(this.createTextElement(xmlDocument, 'title', book.title));
      bookElement.appendChild(this.createTextElement(xmlDocument, 'author', book.author));
      bookElement.appendChild(this.createTextElement(xmlDocument, 'pages', String(book.pages)));

      xmlDocument.documentElement.appendChild(bookElement);
    }

    const xml: string = new XMLSerializer().serializeToString(xmlDocument);

    return `${XML_FILE_START}\n${xml}`;
  }

  /**
   * Returns books array from parsed xml document.
   *
   * @param {string} xml
   */
  public getParsedBooks(xml: string): ParsedBooksResult {
    const parseXmlResult: ParseXmlResult = this.importXML(xml);

    if (!parseXmlResult.ok) {
      return {
        ok: false,
        error: parseXmlResult.error,
      };
    }

    const books: Book[] = [];
    const bookElements: HTMLCollectionOf<Element> = parseXmlResult.document.getElementsByTagName('book');

    for (const bookElement of bookElements) {
      const title: string = bookElement.getElementsByTagName('title')[0]?.textContent || 'Unknown Title';
      const author: string = bookElement.getElementsByTagName('author')[0]?.textContent || 'Unknown Author';
      const pagesText: string = bookElement.getElementsByTagName('pages')[0]?.textContent || '0';

      books.push({
        uuid: crypto.randomUUID(),
        title,
        author,
        pages: parseInt(pagesText, 10) || 0
      });
    }

    return {
      ok: true,
      books,
    };
  }

  /**
   * Helper method for creating an element instead of code duplicates.
   * textContent is used to display symbols like "&$ etc." correctly.
   *
   * @param {Document} xmlDocument
   * @param {string} tagName
   * @param {string} textContent
   * @private
   */
  private createTextElement(xmlDocument: Document, tagName: string, textContent: string): Element {
    const element: HTMLElement = xmlDocument.createElement(tagName);

    element.textContent = textContent;

    return element;
  }
}
