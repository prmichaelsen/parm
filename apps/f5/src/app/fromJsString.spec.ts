import { parseJson } from './fromJsString';

describe('fromJsString', () => {
  it('parse empty obj', () => {
    // Assemble
    const input = '{}';
    const expected = {};

    // Act
    const actual = parseJson(input);

    // Assert
    expect(actual).toEqual(expected);
  });
  it('parse obj', () => {
    // Assemble
    const input = "{ \"a\": 'val' }";
    const expected = { a: 'val' };

    // Act
    const actual = parseJson(input);

    // Assert
    expect(actual).toEqual(expected);
  });
  it('parse empty arr', () => {
    // Assemble
    const input = "[]";
    const expected = [];

    // Act
    const actual = parseJson(input);

    // Assert
    expect(actual).toEqual(expected);
  });
  it('parse array el 1', () => {
    // Assemble
    const input = "[1]";
    const expected = [1];

    // Act
    const actual = parseJson(input);

    // Assert
    expect(actual).toEqual(expected);
  });
  it('parse nested', () => {
    // Assemble
    const input = "{ nest: { value: 'val' }}";
    const expected = { nest: { value: 'val' }};

    // Act
    const actual = parseJson(input);

    // Assert
    expect(actual).toEqual(expected);
  });
});