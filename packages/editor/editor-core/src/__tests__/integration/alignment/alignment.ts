import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, editable } from '../_helpers';
import { messages } from '../../../plugins/block-type/types';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

const alignButton = 'button[aria-label="Text alignment"]';
const alignRightButton = 'span[aria-label="Align right"]';
const headingButton = 'button[aria-label="Font style"]';
const headingh1 = 'div[role="group"] h1';

BrowserTestCase(
  'alignment: should be able to add alignment to paragraphs',
  { skip: [] },
  async client => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
    });

    await page.type(editable, 'hello');
    await page.waitFor(alignButton);
    await page.click(alignButton);
    await page.waitForSelector(alignRightButton);
    await page.click(alignRightButton);
    expect(await page.$eval(editable, getDocFromElement)).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'alignment: should be able to add alignment to headings',
  { skip: [] },
  async client => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
    });

    await page.type(editable, 'hello');
    await page.waitFor(headingButton);
    await page.click(headingButton);
    await page.waitFor(headingh1);
    await page.click(headingh1);
    await page.waitFor(alignButton);
    await page.click(alignButton);
    await page.waitForSelector(alignRightButton);
    await page.click(alignRightButton);
    expect(await page.$eval(editable, getDocFromElement)).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'alignment: disabled when inside special nodes',
  { skip: [] },
  async client => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      allowCodeBlocks: true,
    });

    await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);
    await page.waitFor(alignButton);
    const isEnabled = await page.isEnabled(alignButton);
    expect(isEnabled).toBe(false);
  },
);

BrowserTestCase(
  'alignment: disabled when editor is disabled',
  { skip: [] },
  async client => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      disabled: true,
    });
    const isEnabled = await page.isEnabled(alignButton);
    expect(isEnabled).toBe(false);
  },
);
