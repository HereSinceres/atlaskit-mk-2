import { getAutocomplete } from '../../../util/autocomplete';

describe('Autocomplete-util', () => {
  it('should not provide autocomplete if not typed anything', () => {
    expect(getAutocomplete('', ['auto', 'car'])).toBeUndefined();
  });

  const testData = [
    // autocomplete array, expected autocomplete text
    [undefined, undefined],
    [[], 'au'],
    [['auto', 'automatic'], 'auto'],
    [['AuTo', 'automatic'], 'auTo'],
  ];

  test.each(testData)(
    'should autocomplete "au" based on %j to %s',
    (autocompleteArray, expected) => {
      expect(getAutocomplete('au', autocompleteArray)).toBe(expected);
    },
  );
});
