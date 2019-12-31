import React, { useState, useEffect } from 'react';
import Avatar from '@atlaskit/avatar';
import Button, { ButtonGroup } from '@atlaskit/button';
import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import {
  MenuGroup,
  Section,
  SkeletonItem,
  SkeletonHeadingItem,
  HeadingItem,
  ButtonItem,
} from '../src';

const Item = ({ isLoading, ...props }: any) => {
  if (isLoading) {
    return <SkeletonItem {...props} />;
  }

  let icon;
  let content;

  if (props.hasIcon) {
    icon = <EmojiCustomIcon label="" />;
    content = 'Create';
  } else if (props.hasAvatar) {
    icon = <Avatar size="xsmall" />;
    content = 'John Smith';
  } else {
    content = 'Action name';
  }

  return <ButtonItem elemBefore={icon}>{content}</ButtonItem>;
};

const Heading = ({ isLoading }: any) => {
  if (isLoading) {
    return <SkeletonHeadingItem />;
  }

  return <HeadingItem>Heading</HeadingItem>;
};

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoLoading, setIsAutoLoading] = useState(true);

  useEffect(() => {
    if (!isAutoLoading) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsAutoLoading(false);
    }, 1000);
  }, [isAutoLoading]);

  return (
    <div>
      <ButtonGroup>
        <Button onClick={() => setIsAutoLoading(true)}>Load again</Button>
        <Button onClick={() => setIsLoading(prev => !prev)}>
          Set {isLoading ? 'Loaded' : 'Loading'}
        </Button>
      </ButtonGroup>
      <div
        style={{
          display: 'flex',
        }}
      >
        <div
          style={{
            width: '200px',
            border: '1px solid #EFEFEF',
            margin: '10px auto',
            borderRadius: '4px',
            alignSelf: 'flex-start',
          }}
        >
          <MenuGroup maxHeight={300}>
            <Section>
              <Heading isLoading={isLoading} />
              {Array(3)
                .fill(undefined)
                .map((_, index) => (
                  <Item isLoading={isLoading} key={index} hasAvatar />
                ))}
            </Section>
            <Section hasSeparator>
              <Heading isLoading={isLoading} />
              {Array(1)
                .fill(undefined)
                .map((_, index) => (
                  <Item isLoading={isLoading} key={index} hasIcon />
                ))}
            </Section>
          </MenuGroup>
        </div>
        <div
          style={{
            width: '200px',
            border: '1px solid #EFEFEF',
            margin: '10px auto',
            borderRadius: '4px',
          }}
        >
          <MenuGroup maxHeight={300}>
            <Section>
              <Heading isLoading={isLoading} />
            </Section>
            <Section isScrollable hasSeparator>
              {Array(5)
                .fill(undefined)
                .map((_, index) => (
                  <Item isLoading={isLoading} key={index} hasIcon />
                ))}
            </Section>
            <Section hasSeparator>
              {Array(2)
                .fill(undefined)
                .map((_, index) => (
                  <Item isLoading={isLoading} key={index} />
                ))}
            </Section>
          </MenuGroup>
        </div>
      </div>
    </div>
  );
};
