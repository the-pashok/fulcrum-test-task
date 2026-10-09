import { TestBed } from '@angular/core/testing';

import { ParseXmlService } from './parse-xml';

describe('ParseXmlService', () => {
  let service: ParseXmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParseXmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('exports xml file', (): void => {
    const xml: string = service.exportXML([
      {
        uuid: 'id1',
        title: 'Title 1',
        author: 'Author 1',
        pages: 100,
      },
      {
        uuid: 'id2',
        title: 'Title 2',
        author: 'Author 2',
        pages: 200,
      },
    ]);

    expect(xml).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<library>' +
      '<book><title>Title 1</title><author>Author 1</author><pages>100</pages></book>' +
      '<book><title>Title 2</title><author>Author 2</author><pages>200</pages></book>' +
      '</library>',
    );
  });
});
