/* sample-data.js */
import * as React from 'react';
import Avatar from '@atlaskit/avatar';
import styled from 'styled-components';
import presidents from './numerical.json';

interface President {
  id: number;
  nm: string;
  pp: string;
  num: number;
}

function createKey(input: string) {
  return input ? input.replace(/\s/g, '') : input;
}

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
`;

export const caption = 'Sample Numerical Data';

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'name',
        content: 'Name',
        isSortable: true,
        width: withWidth ? 25 : undefined,
      },
      {
        key: 'party',
        content: 'Party',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'numeric',
        content: 'Arbitrary Number',
        isSortable: true,
        width: withWidth ? 10 : undefined,
      },
    ],
  };
};

export const head = createHead(true);

export const rows = presidents.map((president: President, index: number) => ({
  key: `row-${index}-${president.nm}`,
  cells: [
    {
      key: createKey(president.nm),
      content: (
        <NameWrapper>
          <AvatarWrapper>
            <Avatar
              name={president.nm}
              size="medium"
              src={`https://api.adorable.io/avatars/24/${encodeURIComponent(
                president.nm,
              )}.png`}
            />
          </AvatarWrapper>
          <a href="https://atlassian.design">{president.nm}</a>
        </NameWrapper>
      ),
    },
    {
      key: createKey(president.pp),
      content: president.pp,
    },
    {
      key: president.num,
      content: president.num,
    },
  ],
}));