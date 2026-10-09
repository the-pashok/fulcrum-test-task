export type SortDirection = 'asc' | 'desc';

export type SortColumn = 'title' | 'author' | 'pages';

export interface Sort {
  column: SortColumn;
  direction: SortDirection;
}
