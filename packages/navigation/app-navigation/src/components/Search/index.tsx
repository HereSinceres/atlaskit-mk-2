/** @jsx jsx */
import SearchIcon from '@atlaskit/icon/glyph/search';
import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import { ThemedIconButton } from '../IconButton';
import { TriggerManager } from '../TriggerManager';

import {
  searchInputContainerCSS,
  searchIconCSS,
  searchInputCSS,
  searchInputIconCSS,
} from './styles';
import { SearchProps } from './types';

type SearchComponentProps = {
  onClick: SearchProps['onClick'];
  text: SearchProps['text'];
};

const SearchComponent = (props: SearchComponentProps) => {
  const { onClick, text } = props;

  const onChange = (...args: any[]) => {
    // @ts-ignore
    onClick && onClick(...args);
  };

  return (
    <div css={searchInputContainerCSS}>
      <div css={searchInputIconCSS}>
        <SearchIcon label={text} />
      </div>
      <input
        css={searchInputCSS}
        placeholder={text}
        onChange={onChange}
        onClick={onClick}
        value=""
      />
    </div>
  );
};

export const Search = (props: SearchProps) => {
  const { text, tooltip, ...triggerManagerProps } = props;

  return (
    <TriggerManager {...triggerManagerProps}>
      {({ onTriggerClick }) => (
        <Fragment>
          <SearchComponent onClick={onTriggerClick} text={text} />
          <ThemedIconButton
            css={searchIconCSS}
            icon={<SearchIcon label={tooltip} />}
            onClick={onTriggerClick}
            tooltip={tooltip}
          />
        </Fragment>
      )}
    </TriggerManager>
  );
};
