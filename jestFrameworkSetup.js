// @flow
/*
  This file is executed after the test framework is setup for each test file. Addons that modify
  the `expect` object can be applied here.
  @see https://facebook.github.io/jest/docs/configuration.html#setuptestframeworkscriptfile-string
*/
// require('jest-styled-components');
const pmModel = require('./node_modules/prosemirror-model');
const diff = require('./node_modules/jest-diff');

/**
 * Polyfill DOMElement.innerText because JSDOM lacks support for it.
 * @link https://github.com/tmpvar/jsdom/issues/1245
 */
if (document && !('innerText' in document.createElement('a'))) {
  const getInnerText = node =>
    Array.prototype.slice.call(node.childNodes).reduce((text, child) => {
      if (child.nodeType === child.TEXT_NODE) {
        return `${text}${child.textContent}`;
      }

      if (child.childNodes.length) {
        return `${text}${getInnerText(child)}`;
      }

      return text;
    }, '');

  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    configurable: true,
    get: function get() { return getInnerText(this); },
    set: function set(text) {
      const textNodes = Array.prototype.slice
        .call(this.childNodes)
        .filter(node => node.nodeType === node.TEXT_NODE)
      ;

      // If there's only one child that is a text node, update it
      if (textNodes.length === 1) {
        textNodes[0].textContent = text;
        return;
      }

      // Remove all child nodes as per WHATWG LS Spec
      Array.prototype.slice.call(this.childNodes).forEach(node => this.removeChild(node));

      // Append a single text child node with the text
      this.appendChild(document.createTextNode(text));
    },
  });
}

/* eslint-disable no-undef */
expect.extend({
  toEqualDocument(actual, expected) {
    if (!(expected instanceof pmModel.Node) || !(actual instanceof pmModel.Node)) {
      return {
        pass: false,
        actual,
        expected,
        name: 'toEqualDocument',
        message: 'Expected both values to be instance of prosemirror-model Node.',
      };
    }

    const pass = this.equals(actual.toJSON(), expected.toJSON());
    const message = pass
      ? () =>
        `${this.utils.matcherHint('.not.toEqualDocument')}\n\n` +
        `Expected JSON value of document to not equal:\n  ${this.utils.printExpected(expected)}\n` +
        `Actual JSON:\n  ${this.utils.printReceived(actual)}`
      : () => {
        const diffString = diff(expected, actual, {
          expand: this.expand,
        });
        return (
          `${this.utils.matcherHint('.toEqualDocument')}\n\n` +
          `Expected JSON value of document to equal:\n${this.utils.printExpected(expected)}\n` +
          `Actual JSON:\n  ${this.utils.printReceived(actual)}` +
          `${(diffString ? `\n\nDifference:\n\n${diffString}` : '')}`
        );
      }
    ;

    return {
      pass,
      actual,
      expected,
      message,
      name: 'toEqualDocument',
    };
  },
});
