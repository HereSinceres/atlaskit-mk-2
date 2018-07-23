// @flow

import React from 'react';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import {
  ContainerHeader,
  Item as BaseItem,
  ItemPrimitive,
  Section as SectionComponent,
  Separator,
  Group as GroupComponent,
  GroupHeading as GroupHeadingComponent,
  Switcher,
  withNavigationUI,
  withNavigationViewController,
} from '../';
import type {
  GoToItemProps,
  GroupProps,
  ItemProps,
  ItemsRendererProps,
  SectionProps,
  GroupHeadingProps,
} from './types';

const iconMap = {
  ArrowRightIcon,
  BacklogIcon,
  BoardIcon,
  DashboardIcon,
  GraphLineIcon,
  FolderIcon,
  IssuesIcon,
  ShipIcon,
};

const gridSize = gridSizeFn();

/**
 * ITEMS
 */

// GoToItem
const GoToItemBase = ({
  after: afterProp,
  goTo,
  navigationUI,
  navigationViewController,
  ...rest
}: GoToItemProps) => {
  let after;
  if (typeof afterProp === 'undefined') {
    after = ({ isActive, isHover }: *) =>
      isActive || isHover ? <ArrowRightIcon size="small" /> : null;
  }

  const props = { ...rest, after };
  const handleClick = e => {
    e.preventDefault();

    const { activeView } = navigationViewController.state;

    if (navigationUI.state.isPeeking) {
      if (activeView && goTo === activeView.id) {
        // If we're peeking and goTo points to the active view, unpeek.
        navigationUI.unPeek();
      } else {
        // If we're peeking and goTo does not point to the active view, update
        // the peek view.
        navigationViewController.setPeekView(goTo);
      }
    } else {
      // If we're not peeking, update the active view.
      navigationViewController.setView(goTo);
    }
  };

  return <Item onClick={e => handleClick(e)} {...props} />;
};
const GoToItem = withNavigationUI(withNavigationViewController(GoToItemBase));

// Item
const Item = ({ before: beforeProp, icon, ...rest }: ItemProps) => {
  let before = beforeProp;
  if (!before && icon && iconMap[icon]) {
    before = iconMap[icon];
  }

  const props = { ...rest, before };
  return props.goTo ? <GoToItem {...props} /> : <BaseItem {...props} />;
};

// BackItem
const backItemPrimitiveStyles = styles => ({
  ...styles,
  itemBase: { ...styles.itemBase, cursor: 'default' },
});

const BackItem = ({ goTo, href, subText, text = 'Back' }: *) => (
  <div css={{ display: 'flex', marginBottom: '8px' }}>
    <div css={{ flexShrink: 0 }}>
      <GoToItem
        after={null}
        goTo={goTo}
        href={href}
        text={<ArrowLeftIcon size="small" />}
      />
    </div>
    <div css={{ flexGrow: 1 }}>
      <ItemPrimitive
        spacing="compact"
        styles={backItemPrimitiveStyles}
        subText={subText}
        text={text}
      />
    </div>
  </div>
);

// Title
const GroupHeading = ({ text, ...props }: GroupHeadingProps) => (
  <GroupHeadingComponent {...props}>{text}</GroupHeadingComponent>
);

const Debug = props => (
  <pre
    css={{
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      fontSize: '10px',
      overflowX: 'auto',
      padding: `${gridSize / 2}px`,
    }}
  >
    {JSON.stringify(props, null, 2)}
  </pre>
);

/**
 * GROUPS
 */

// Group
const Group = ({
  customComponents,
  hasSeparator,
  heading,
  items,
}: GroupProps) =>
  items.length ? (
    <GroupComponent heading={heading} hasSeparator={hasSeparator}>
      <ItemsRenderer items={items} customComponents={customComponents} />
    </GroupComponent>
  ) : null;

// Section
const Section = ({
  customComponents,
  id,
  items,
  nestedGroupKey,
  parentId,
}: SectionProps) =>
  items.length ? (
    <SectionComponent id={id} key={nestedGroupKey} parentId={parentId}>
      {({ css }) => (
        <div css={{ ...css }}>
          <ItemsRenderer items={items} customComponents={customComponents} />
        </div>
      )}
    </SectionComponent>
  ) : null;

const itemComponents = {
  ContainerHeader,
  Debug,
  GoToItem,
  Item,
  BackItem,
  Separator,
  GroupHeading,
  Switcher,
};

const groupComponents = {
  Group,
  Section,
};

const components = { ...itemComponents, ...groupComponents };

/**
 * RENDERER
 */
export const ItemsRenderer = ({
  customComponents = {},
  items,
}: ItemsRendererProps) =>
  items.map(({ type, ...props }) => {
    const key =
      typeof props.nestedGroupKey === 'string'
        ? props.nestedGroupKey
        : props.id;

    if (groupComponents[type]) {
      const G = groupComponents[type];
      return <G key={key} {...props} customComponents={customComponents} />;
    }

    if (itemComponents[type]) {
      const I = itemComponents[type];
      return <I key={key} {...props} />;
    }

    if (customComponents[type]) {
      const C = customComponents[type];
      return (
        <C
          key={key}
          {...props}
          // We pass our in-built components through to custom components so
          // they can wrap/render them if they want to.
          components={components}
          customComponents={customComponents}
        />
      );
    }

    return <Debug key={key} type={type} {...props} />;
  });
