import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test.skip('Page server side rendering', async done => {
  const examples = await getExamplesFor('page');
  for (const example of examples) {
    const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  }
  done();
});
