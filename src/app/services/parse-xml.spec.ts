import { TestBed } from '@angular/core/testing';
import { ParseXml } from './parse-xml';

describe('ParseXml', () => {
  let service: ParseXml;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParseXml);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
