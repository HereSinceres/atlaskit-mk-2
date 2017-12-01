// @flow
import '@atlaskit/polyfills/array-prototype-includes';
import React, { Component } from 'react';
import Tooltip from '@atlaskit/tooltip';

import { validIconSizes, propsOmittedFromClickData } from './constants';
import Presence from './Presence';
import Image from './AvatarImage';
import Status from './Status';

import Outer, { PresenceWrapper, StatusWrapper } from '../styled/Avatar';

import { omit } from '../utils';
import { getProps, getStyledAvatar } from '../helpers';
import { mapProps, withPseudoState } from '../hoc';

import type { AvatarPropTypes, AvatarPropTypesBase } from '../types';

export const AvatarDefaultProps = {
  appearance: 'circle',
  enableTooltip: true,
  size: 'medium',
};

const warn = message => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(message); // eslint-disable-line no-console
  }
};

class Avatar extends Component<AvatarPropTypes> {
  node: ?HTMLElement;

  static defaultProps = AvatarDefaultProps;

  // expose blur/focus to consumers via ref
  blur = () => {
    if (this.node) this.node.blur();
  };
  focus = () => {
    if (this.node) this.node.focus();
  };

  // disallow click on disabled avatars
  // only return avatar data properties
  guardedClick = (event: KeyboardEvent | MouseEvent) => {
    const { isDisabled, onClick } = this.props;

    if (isDisabled || typeof onClick !== 'function') return;

    const item: Object = omit(this.props, ...propsOmittedFromClickData);

    onClick({ item, event });
  };

  // enforce status / presence rules
  /* eslint-disable no-console */
  renderIcon = () => {
    const { appearance, borderColor, presence, size, status } = this.props;
    const showPresence = !!presence;
    const showStatus = !!status;

    // add warnings for various invalid states
    if (!validIconSizes.includes(size) && (showPresence || showStatus)) {
      warn(
        `Avatar size "${String(size)}" does NOT support ${
          showPresence ? 'presence' : 'status'
        }`,
      );
      return null;
    }
    if (showPresence && showStatus) {
      warn('Avatar supports `presence` OR `status` properties, not both.');
      return null;
    }

    let indicator;

    if (showPresence) {
      const customPresenceNode = typeof presence === 'object' ? presence : null;

      indicator = (
        <PresenceWrapper appearance={appearance} size={size}>
          <Presence
            borderColor={borderColor}
            presence={!customPresenceNode && presence}
            size={size}
          >
            {customPresenceNode}
          </Presence>
        </PresenceWrapper>
      );
    } else if (showStatus) {
      indicator = (
        <StatusWrapper appearance={appearance} size={size}>
          <Status status={status} borderColor={borderColor} size={size} />
        </StatusWrapper>
      );
    }

    return indicator;
  };

  setNode = (ref: ?HTMLElement) => {
    this.node = ref;
  };

  /* eslint-enable no-console */

  render() {
    const {
      appearance,
      enableTooltip,
      onClick,
      name,
      size,
      src,
      stackIndex,
    } = this.props;

    // Since we augment the onClick handler below we can't use the
    // same type definition that we do for the Avatar's onClick prop
    type AvatarInnerProps = AvatarPropTypesBase & {
      onClick?: Function,
    };
    // distill props from context, props, and state
    const props: AvatarInnerProps = getProps(this);

    // provide element type based on props
    const Inner: any = getStyledAvatar(this.props);

    // augment the onClick handler
    props.onClick = onClick && this.guardedClick;

    const AvatarNode = (
      <Outer size={size} stackIndex={stackIndex}>
        <Inner innerRef={this.setNode} {...props}>
          <Image alt={name} appearance={appearance} size={size} src={src} />
        </Inner>

        {this.renderIcon()}
      </Outer>
    );

    return enableTooltip && name ? (
      <Tooltip content={name}>{AvatarNode}</Tooltip>
    ) : (
      AvatarNode
    );
  }
}

/**
 *  1. Higher order components seem to ignore default properties. Mapping
 *     `appearance` explicity here circumvents the issue.
 *  2. The withPseudoState HOC should remain generic so rather than pass on
 *     `enableTooltip` we map it to `isInteractive`.
 *  3. Handle keyboard/mouse events and pass props to the wrapped component:
 *     - isActive
 *     - isFocus
 *     - isHover
 */
export default mapProps({
  appearance: props => props.appearance || Avatar.defaultProps.appearance, // 1
  isInteractive: props =>
    props.enableTooltip || Avatar.defaultProps.enableTooltip, // 2
})(withPseudoState(Avatar)); // 3
