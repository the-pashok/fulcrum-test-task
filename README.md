# Library

A single-screen book library built with Angular 22. Books are loaded from an XML file, edited in
the browser, and exported back to XML.

## Features

- **Load XML**
- **Save XML**
- **Add / Edit / Delete**
- **Search**
- **Sort**

## XML format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<library>
  <book>
    <title>The Hobbit</title>
    <author>J. R. R. Tolkien</author>
    <pages>310</pages>
  </book>
</library>
```

## Getting started

Install dependencies and start the dev server:

```bash
npm install
```

```bash
npm start
```

The app runs at `http://localhost:4200/` and reloads on source changes.

Other commands:

```bash
npm run build
```

```bash
npm test
```

```bash
npm run lint
```

## Project structure

```
src/app/
  library/
    components/ - feature components (header, table, search, modal, empty/error states)
    interfaces/ - Book, Sort, parser result types
    services/ - XML import and export
    library.ts - container: owns state, wires children together
  app.ts - shell
src/styles/ - SCSS primitives (buttons, grid, table, inputs)
```

`Library` is the only stateful component. Everything under `components/` receives data through inputs.

## Design decisions

**No router.** There is one screen, so it becomes useless with a second screen.

**State lives in the `Library` container.**

**Native `<dialog>` instead of a UI library.** The project has no runtime UI dependencies.

**UUID are runtime-only.** Each book gets a `random uuid` identifier used for `@for`
tracking and for edit/delete lookups.

**Nothing is persisted** - reloading the page clears the library.
