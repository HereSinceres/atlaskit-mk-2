import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlDateTimePicker = getExampleUrl(
  'core',
  'datetime-picker',
  'date-picker-states',
);
/* Css used for the test */
const datePicker = '[data-testid="datePicker--container"]';
const menu = `[aria-label="calendar"]`;
const date =
  '[aria-label="calendar"] > table > tbody > tr:nth-child(5) > td:nth-child(6)';
const input = 'input#react-select-datepicker-input';
const value = `${datePicker} > div > div > div:first-child > div:first-child`;

// BrowserTestCase(
//   'When the user enters a partial date and hits enter, the value should be selected from the calendar',
//   {},
//   async (client: any) => {
//     const page = new Page(client);

//     await page.goto(urlDateTimePicker);
//     await page.click(datePicker);
//     await page.type(input, ['2016', 'Enter']);
//     await page.waitForSelector(menu);

//     const nextDate = await page.getText(value);

//     expect(nextDate).toBe(`2016/01/01`);

//     await page.checkConsoleErrors();
//   },
// );

// BrowserTestCase(
//   'When the user enters an invalid date and hits enter, the value should be selected from the calendar',
//   {},
//   async (client: any) => {
//     const page = new Page(client);

//     await page.goto(urlDateTimePicker);
//     await page.click(datePicker);
//     await page.waitForSelector(menu);
//     await page.type(input, ['2016', '/abcd']);
//     await page.type(input, ['Enter']);
//     await page.waitForSelector(menu);

//     const nextDate = await page.getText(value);

//     expect(nextDate).toEqual(`2016/01/01`);

//     await page.checkConsoleErrors();
//   },
// );

BrowserTestCase(
  'When DatePicker is focused & backspace pressed, the input should be cleared',
  { skip: ['firefox'] },
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlDateTimePicker);
    await page.click(datePicker);
    await page.waitForSelector(menu);
    await page.click(date);

    await page.type(input, ['1/2/2001']);
    await page.keys(input, ['Enter']);
    await page.waitForSelector(menu);

    const currentDate = await page.getText(value);

    expect(currentDate).toEqual('1/2/2001');

    await page.keys(['Backspace']);

    const nextDate = await page.getText(value);

    expect(nextDate).toBe('');
  },
);

BrowserTestCase(
  'When choosing another day in a Datetime picker focused, the date should be updated to the new value',
  {},
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlDateTimePicker);
    await page.click(datePicker);
    await page.waitForSelector(menu);
    await page.click(date);

    const previousDate = await page.getText(value);

    await page.click(datePicker);
    await page.keys(['ArrowLeft']);
    await page.keys(['ArrowLeft']);
    await page.keys(['Enter']);

    expect(await page.getText(value)).not.toBe(previousDate);
    await page.checkConsoleErrors();
  },
);
