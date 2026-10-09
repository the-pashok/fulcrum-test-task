export interface Book {
  uuid: string;
  title: string;
  author: string;
  pages: number;
}

export type BookFormValue = Omit<Book, 'uuid'>;
