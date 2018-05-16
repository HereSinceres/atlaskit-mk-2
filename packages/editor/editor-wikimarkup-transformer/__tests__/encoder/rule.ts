import { defaultSchema } from '@atlaskit/editor-common';
import WikiMarkupTransformer from '../../src';

import { doc, h1, hr, li, p, panel, ul } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup - Panel', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert rule node', () => {
    const node = doc(
      p('This is a ruler'),
      hr(),
      p('I am in between a ruler'),
      hr(),
      p('I am under a ruler'),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});
