/**
 * TODO remove when using styled-components > v1.
 *
 * @jest-environment node
 */
// @flow

import Paragraph from '../Paragraph';

import { assertCorrectColors } from './util';

test('correctly sets color from prop', () => {
  assertCorrectColors(Paragraph);
});
