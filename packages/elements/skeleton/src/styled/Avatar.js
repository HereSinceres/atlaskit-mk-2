// @flow

import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme';
import { getColor } from './utils';

const gridSizeValue: number = gridSize();

const sizes = {
  xsmall: gridSizeValue * 2,
  small: gridSizeValue * 3,
  medium: gridSizeValue * 4,
  large: gridSizeValue * 5,
  xlarge: gridSizeValue * 12,
  xxlarge: gridSizeValue * 16,
};

// border radius applies to "square" avatars
const radiusSizes = {
  xsmall: 2,
  small: 2,
  medium: 3,
  large: 3,
  xlarge: 6,
  xxlarge: 12,
};

export default styled.div`
  width: ${props => sizes[props.size]}px;
  height: ${props => sizes[props.size]}px;
  display: inline-block;
  border-radius: ${props => radiusSizes[props.size]}px;
  background-color: ${props => getColor(props.color)};
  opacity: 0.15;
`;
