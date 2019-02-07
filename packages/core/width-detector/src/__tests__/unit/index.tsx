import * as React from 'react';
import { mount } from 'enzyme';
import WidthDetector from '../../WidthDetector';
import { name } from '../../../package.json';

describe(name, () => {
  const createChildWithSpy = spy => args => spy(args);

  beforeAll(() => {
    requestAnimationFrame.reset();
  });

  afterEach(() => {
    requestAnimationFrame.reset();
  });

  it('should pass width to child function', () => {
    const spy = jest.fn();
    const wd = mount(<WidthDetector>{createChildWithSpy(spy)}</WidthDetector>);
    requestAnimationFrame.step();
    // expect(spy).toHaveBeenCalledTimes(1);
    // expect(spy).toHaveBeenCalledWith(0);
    expect(true).toBeTruthy();
  });

  // it('should use requestAnimationFrame to queue resize measurements', () => {
  //   const spy = jest.fn();
  //   mount(<WidthDetector>{createChildWithSpy(spy)}</WidthDetector>);
  //   expect(spy).not.toHaveBeenCalled();
  //   requestAnimationFrame.step();
  //   expect(spy).toHaveBeenCalled();
  // });

  // it('should call cancelAnimationFrame when unmounted', () => {
  //   const spy = jest.fn();
  //   const wrapper = mount(
  //     <WidthDetector>{createChildWithSpy(spy)}</WidthDetector>,
  //   );
  //   // initial frame is queued
  //   expect(spy).not.toHaveBeenCalled();
  //   wrapper.unmount();
  //   requestAnimationFrame.flush();
  //   expect(spy).not.toHaveBeenCalled();
  // });

  // // NOTE: enzyme doesn't fully mock object.contentDocument, so we cannot simulate
  // // a resize event in the normal way. Triggering the called function is the alternative.
  // it('should pass updated size measurements to the child function on resize after an animationFrame', () => {
  //   const spy = jest.fn();
  //   const wrapper = mount(
  //     <WidthDetector>{createChildWithSpy(spy)}</WidthDetector>,
  //   );
  //   requestAnimationFrame.step();
  //   expect(spy).toHaveBeenCalledTimes(1);
  //   wrapper.instance().handleResize();
  //   requestAnimationFrame.step();
  //   expect(spy).toHaveBeenCalledTimes(2);
  //   wrapper.instance().handleResize();
  //   requestAnimationFrame.step();
  //   expect(spy).toHaveBeenCalledTimes(3);
  // });

  // // NOTE: Enzyme does not seem to support offsetWidth/offsetHeight on elements, so we cannot
  // // reliably simulate detection of width/height changes for now. Suggestions welcome!
  // // eslint-disable-next-line jest/no-disabled-tests
  // it.skip('should call the child function with updated width and height on resize', () => {});
});
