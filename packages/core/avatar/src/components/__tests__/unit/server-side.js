/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';
import Avatar from '../../Avatar';

test('Avatar server side rendering', async () => {
  (await getExamplesFor('avatar')).forEach(examples => {
    // $StringLitteral
    const Example = require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  });
});

test('Avatar server side render directly renders image src', () => {
  const avatar = {
    src: 'IMAGES/FOO.BMP',
  };
  const actualMarkup = ReactDOMServer.renderToString(<Avatar {...avatar} />);
  expect(actualMarkup).toContain(avatar.src);
});
