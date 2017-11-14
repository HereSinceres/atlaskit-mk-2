import * as React from 'react';
import { shallow } from 'enzyme';
import SubSup from '../../../../src/renderer/react/marks/subsup';

describe('Renderer - React/Marks/Subsup', () => {

  describe('<Sub />', () => {
    const mark = shallow(<SubSup type="sub">This is sub</SubSup>);

    it('should wrap content with <sub>-tag', () => {
      expect(mark.is('sub')).toBe(true);
    });

    it('should output correct html', () => {
      expect(mark.html()).toEqual('<sub>This is sub</sub>');
    });
  });

  describe('<Sup />', () => {
    const mark = shallow(<SubSup type="sup">This is sup</SubSup>);

    it('should wrap content with <sup>-tag', () => {
      expect(mark.is('sup')).toBe(true);
    });

    it('should output correct html', () => {
      expect(mark.html()).toEqual('<sup>This is sup</sup>');
    });
  });

});
