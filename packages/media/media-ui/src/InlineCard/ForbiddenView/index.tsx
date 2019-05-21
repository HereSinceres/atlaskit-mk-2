import * as React from 'react';
import { colors } from '@atlaskit/theme';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import Button from '@atlaskit/button';
import { truncateUrlForErrorView } from '../utils';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { AKIconWrapper } from '../Icon';
import { messages } from '../../messages';
import { FormattedMessage } from 'react-intl';
import { ForbiddenWrapper } from './styled';

export interface InlineCardForbiddenViewProps {
  /** The url to display */
  url: string;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** The optional handler for "Connect" button */
  onAuthorise?: () => void;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
}

export class InlineCardForbiddenView extends React.Component<
  InlineCardForbiddenViewProps
> {
  handleRetry = (event: React.MouseEvent<HTMLElement>) => {
    const { onAuthorise } = this.props;
    event.preventDefault();
    event.stopPropagation();
    onAuthorise!();
  };

  render() {
    const { url, onClick, isSelected, onAuthorise } = this.props;
    return (
      <Frame onClick={onClick} isSelected={isSelected}>
        <IconAndTitleLayout
          icon={
            <AKIconWrapper>
              <LockIcon label="error" size="small" primaryColor={colors.B400} />
            </AKIconWrapper>
          }
          title={truncateUrlForErrorView(url)}
          titleColor={colors.N500}
        />
        {!onAuthorise ? (
          ''
        ) : (
          <>
            <ForbiddenWrapper>
              {` - `}
              <FormattedMessage {...messages.invalid_permissions} />
              {` `}
            </ForbiddenWrapper>
            <Button spacing="none" appearance="link" onClick={this.handleRetry}>
              <FormattedMessage {...messages.try_another_account} />
            </Button>
          </>
        )}
      </Frame>
    );
  }
}
