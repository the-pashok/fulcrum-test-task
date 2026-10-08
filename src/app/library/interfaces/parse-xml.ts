import { Book } from './book';

export type ParseXmlResult = { ok: true; document: Document; } | { ok: false; error: string; };

export type ParsedBooksResult = { ok: true; books: Book[]; } | { ok: false; error: string; };
