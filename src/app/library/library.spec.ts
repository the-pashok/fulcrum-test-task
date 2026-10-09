import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Library } from './library';

let component: Library;
let element: HTMLElement;
let fixture: ComponentFixture<Library>;

beforeEach(async (): Promise<void> => {
  HTMLDialogElement.prototype.showModal = vi.fn();

  await TestBed.configureTestingModule({ imports: [Library] }).compileComponents();

  fixture = TestBed.createComponent(Library);
  component = fixture.componentInstance;
  element = fixture.nativeElement;

  await fixture.whenStable();
});

// helper method to find a search input field and set a value
const search = async (query: string): Promise<void> => {
  const input: HTMLInputElement | null = element.querySelector('input[type="search"]');
  expect(input).toBeTruthy();
  input!.value = query;
  input!.dispatchEvent(new Event('input'));
  await fixture.whenStable();
};

// helper method for clicking buttons in some elements
// For example: Add a new book button
const clickButton = async (text: string, root: Element = element): Promise<void> => {
  const button: HTMLButtonElement | undefined = [...root.querySelectorAll('button')].find(
    (candidate: HTMLButtonElement): boolean => candidate.textContent.trim() === text,
  );
  expect(button).toBeTruthy();
  button!.click();
  await fixture.whenStable();
};

// helper method for clicking buttons in table row: Edit, Delete
const clickButtonInRow = async (rowIndex: number, text: string): Promise<void> => {
  const rows: NodeListOf<HTMLTableRowElement> = element.querySelectorAll('tbody tr');
  expect(rows[rowIndex]).toBeTruthy();
  await clickButton(text, rows[rowIndex]);
};

// returns header column by column name
const getHeaderColumn = (headerColName: string): HTMLTableCellElement => {
  const headerColumnToClick: HTMLTableCellElement | undefined =
    [...element.querySelectorAll<HTMLTableCellElement>('thead th')]
      .find((headerColumn: HTMLTableCellElement): boolean => {
        return headerColumn.textContent.trim().includes(headerColName);
      });

  expect(headerColumnToClick).toBeTruthy();

  return headerColumnToClick!;
}

const clickHeaderColumn = async (headerColName: string) => {
  getHeaderColumn(headerColName).click();
  await fixture.whenStable();
}

// get only book titles to sort by them not by all the entity columns
const getBooksTitles = (): string[] => {
  return tableRows().map((row: string[]): string => row[0]);
}

// fills form data - book-modal.ts
const fillData = async (id: string, value: string): Promise<void> => {
  const inputElement: HTMLInputElement | null = element.querySelector(`#${id}`);
  expect(inputElement).toBeTruthy();
  inputElement!.value = value;
  inputElement!.dispatchEvent(new Event('input'));
  await fixture.whenStable();
};

// helper method for submitting form
const submitForm = async (): Promise<void> => {
  const form: Element | null = element.querySelector('dialog form');
  expect(form).toBeTruthy();
  form!.dispatchEvent(new Event('submit'));
  await fixture.whenStable();
};

// prepare data, submit form and add a book.
const addBook = async (title: string, author: string, pages: string): Promise<void> => {
  await clickButton('Add Book');
  await fillData('title', title);
  await fillData('author', author);
  await fillData('pages', pages);
  await submitForm();
};

// Table content: only first 3 items: title, author and pages. without books
const tableRows = (): string[][] =>
  [...element.querySelectorAll<HTMLTableRowElement>('tbody tr')].map(
    (row: HTMLTableRowElement): string[] =>
      [...row.cells].slice(0, 3).map((cell: HTMLTableCellElement): string =>
        cell.textContent.trim(),
      ),
  );

describe('Books CRUD', (): void => {
  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should add a new book', async (): Promise<void> => {
    await addBook('title 1', 'author 1', '315');
    expect(tableRows()).toEqual([
      ['title 1', 'author 1', '315'],
    ]);
  });

  it('should remove a book', async (): Promise<void> => {
    await addBook('title 1', 'title 1', '315');
    await addBook('title 2', 'title 2', '135');

    expect(tableRows()).toEqual([
      ['title 1', 'title 1', '315'],
      ['title 2', 'title 2', '135'],
    ]);

    await clickButtonInRow(1, 'Delete');

    expect(tableRows()).toEqual([
      ['title 1', 'title 1', '315'],
    ]);
  });

  it('should edit a book', async (): Promise<void> => {
    await addBook('title 1', 'author 1', '115');

    expect(tableRows()).toEqual([
      ['title 1', 'author 1', '115'],
    ]);

    await clickButtonInRow(0, 'Edit');

    expect(element.querySelector('dialog h2')!.textContent.trim()).toBe('Edit book');
    expect(element.querySelector<HTMLInputElement>('#title')!.value).toBe('title 1');
    expect(element.querySelector<HTMLInputElement>('#author')!.value).toBe('author 1');
    expect(element.querySelector<HTMLInputElement>('#pages')!.value).toBe('115');

    await fillData('title', 'John Doe');
    await fillData('author', 'Poul Newman');
    await submitForm();

    expect(tableRows()).toEqual([
      ['John Doe', 'Poul Newman', '115'],
    ]);
  });
});

describe('Search', (): void => {
  beforeEach(async (): Promise<void> => {
    await addBook('Book Name 1', 'Book Author 1', '215');
    await addBook('Book Name 2', 'Book Author 2', '315');
  });

  it('should search by title', async (): Promise<void> => {
    await search('Book Name 2');

    expect(tableRows()).toEqual([
      ['Book Name 2', 'Book Author 2', '315'],
    ]);
  });

  it('should search by author', async (): Promise<void> => {
    await search('Book Author 1');

    expect(tableRows()).toEqual([
      ['Book Name 1', 'Book Author 1', '215'],
    ]);
  });

  it('should restore library when search is empty', async (): Promise<void> => {
    await search('Book Author 1');
    await search('');

    expect(tableRows()).toHaveLength(2);
  });
});

describe('sorting', (): void => {
  beforeEach(async (): Promise<void> => {
    await addBook('Title 1', 'Author 1', '156');
    await addBook('Title 2', 'Author 2', '290');
    await addBook('Title 3', 'Author 3', '312');
  });

  it('should display initial sort order', () => {
    expect(getBooksTitles()).toEqual(['Title 1', 'Title 2', 'Title 3']);
  });

  it('should sort by title asc order', async (): Promise<void> => {
    await clickHeaderColumn('Title');
    expect(getBooksTitles()).toEqual(['Title 1', 'Title 2', 'Title 3']);
  });

  it('should sort by title desc order', async (): Promise<void> => {
    await clickHeaderColumn('Title');
    await clickHeaderColumn('Title');
    expect(getBooksTitles()).toEqual(['Title 3', 'Title 2', 'Title 1']);
  });
});
