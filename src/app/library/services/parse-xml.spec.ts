import { TestBed } from '@angular/core/testing';

import { ParseXmlService } from './parse-xml';
import { Book } from '../interfaces/book';

const library = (inner: string): string => `<library>${inner}</library>`;

const HOBBIT = `
  <book>
    <title>The Hobbit</title>
    <author>J. R. R. Tolkien</author>
    <pages>310</pages>
  </book>
`;

const DUNE = `
  <book>
    <title>Dune</title>
    <author>Frank Herbert</author>
    <pages>412</pages>
  </book>
`;

describe('ParseXmlService', () => {
  let service: ParseXmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParseXmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('well-formed documents', () => {
    it('maps every <book> element to a Book', () => {
      const books: Book[] = service.getBooks(library(HOBBIT + DUNE));

      expect(books).toHaveLength(2);
      expect(books[0]).toMatchObject({
        title: 'The Hobbit',
        author: 'J. R. R. Tolkien',
        pages: 310,
      });
      expect(books[1]).toMatchObject({
        title: 'Dune',
        author: 'Frank Herbert',
        pages: 412,
      });
    });

    it('parses <pages> as a number, not a string', () => {
      const [book]: Book[] = service.getBooks(library(HOBBIT));

      expect(book.pages).toBe(310);
      expect(typeof book.pages).toBe('number');
    });

    it('assigns a unique id to every book', () => {
      const books: Book[] = service.getBooks(library(HOBBIT + DUNE + HOBBIT));
      const ids = new Set<string>(books.map((book: Book): string => book.id));

      expect(ids.size).toBe(3);
      books.forEach((book: Book): void => {
        expect(book.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      });
    });

    it('returns an empty array for a library with no books', () => {
      expect(service.getBooks(library(''))).toEqual([]);
    });

    it('ignores unknown elements', () => {
      const books: Book[] = service.getBooks(library(`<shelf>Fiction</shelf>${HOBBIT}`));

      expect(books).toHaveLength(1);
      expect(books[0].title).toBe('The Hobbit');
    });
  });

  describe('missing or empty fields', () => {
    it('falls back to "Unknown Title" when <title> is absent', () => {
      const [book]: Book[] = service.getBooks(
        library('<book><author>Tolkien</author><pages>310</pages></book>'),
      );

      expect(book.title).toBe('Unknown Title');
    });

    it('falls back to "Unknown Title" when <title> is empty', () => {
      const [book]: Book[] = service.getBooks(
        library('<book><title></title><author>Tolkien</author><pages>310</pages></book>'),
      );

      expect(book.title).toBe('Unknown Title');
    });

    it('falls back to "Unknown Author" when <author> is absent', () => {
      const [book]: Book[] = service.getBooks(
        library('<book><title>The Hobbit</title><pages>310</pages></book>'),
      );

      expect(book.author).toBe('Unknown Author');
    });

    it('falls back to 0 when <pages> is absent', () => {
      const [book]: Book[] = service.getBooks(
        library('<book><title>The Hobbit</title><author>Tolkien</author></book>'),
      );

      expect(book.pages).toBe(0);
    });

    it('falls back to 0 when <pages> is not a number', () => {
      const [book]: Book[] = service.getBooks(
        library('<book><title>The Hobbit</title><author>Tolkien</author><pages>many</pages></book>'),
      );

      expect(book.pages).toBe(0);
    });

    it('keeps a book whose fields are all missing, using every fallback', () => {
      const [book]: Book[] = service.getBooks(library('<book></book>'));

      expect(book).toMatchObject({
        title: 'Unknown Title',
        author: 'Unknown Author',
        pages: 0,
      });
    });
  });

  describe('malformed input', () => {
    it('returns an empty array for XML that does not parse', () => {
      expect(service.getBooks('<library><book></library>')).toEqual([]);
    });

    it('returns an empty array for an empty string', () => {
      expect(service.getBooks('')).toEqual([]);
    });

    it('returns an empty array for input that is not XML at all', () => {
      expect(service.getBooks('just some text')).toEqual([]);
    });

    // NOTE: these cases are indistinguishable from a valid but empty <library/>.
    // Until getBooks() reports failure separately, the caller cannot show an
    // upload error — see the `isErrorVisible` path in Library, which is never set.
  });
});
