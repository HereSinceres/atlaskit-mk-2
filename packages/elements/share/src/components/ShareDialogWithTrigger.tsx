import InlineDialog from '@atlaskit/inline-dialog';
import { LoadOptions } from '@atlaskit/user-picker';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { messages } from '../i18n';
import {
  DialogContentState,
  InvitationsCapabilitiesResponse,
  ShareButtonStyle,
} from '../types';
import { ShareButton } from './ShareButton';
import { ShareForm } from './ShareForm';

type RenderChildren = (
  args: { onClick: () => void; loading: boolean; error?: ShareError },
) => React.ReactNode;

type DialogState = {
  isDialogOpen: boolean;
  isSharing: boolean;
  shareError?: ShareError;
  ignoreIntermediateState: boolean;
  defaultValue: DialogContentState;
};

export type State = DialogState;

type ShareError = {
  message: string;
};

export type Props = {
  buttonStyle?: ShareButtonStyle;
  capabilities?: InvitationsCapabilitiesResponse;
  children?: RenderChildren;
  copyLink: string;
  dialogPlacement: string;
  isDisabled?: boolean;
  loadUserOptions?: LoadOptions;
  onLinkCopy?: Function;
  onShareSubmit?: (shareContentState: DialogContentState) => Promise<any>;
  shouldShowCommentField?: boolean;
  shouldCloseOnEscapePress?: boolean;
};

const InlineDialogFormWrapper = styled.div`
  width: 352px;
  margin: -16px 0;
`;

export const defaultShareContentState: DialogContentState = {
  users: [],
  comment: {
    format: 'plain_text' as 'plain_text',
    value: '',
  },
};

export class ShareDialogWithTrigger extends React.Component<Props, State> {
  static defaultProps = {
    buttonStyle: 'icon-only' as 'icon-only',
    isDisabled: false,
    dialogPlacement: 'bottom-end',
    shouldCloseOnEscapePress: false,
  };
  private containerRef = React.createRef<HTMLDivElement>();

  escapeIsHeldDown: boolean = false;

  state: State = {
    isDialogOpen: false,
    isSharing: false,
    ignoreIntermediateState: false,
    defaultValue: defaultShareContentState,
  };

  private handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { isDialogOpen } = this.state;
    if (isDialogOpen) {
      switch (event.key) {
        case 'Escape':
          event.stopPropagation();
          this.setState({
            isDialogOpen: false,
            ignoreIntermediateState: true,
            defaultValue: defaultShareContentState,
            shareError: undefined,
          });
      }
    }
  };

  private onTriggerClick = () => {
    // TODO: send analytics
    this.setState(
      {
        isDialogOpen: !this.state.isDialogOpen,
        ignoreIntermediateState: false,
      },
      () => {
        if (this.containerRef.current) {
          this.containerRef.current.focus();
        }
      },
    );
  };

  private handleCloseDialog = (_: { isOpen: boolean; event: any }) => {
    // TODO: send analytics
    this.setState({
      isDialogOpen: false,
    });
  };

  private handleShareSubmit = (data: DialogContentState) => {
    if (!this.props.onShareSubmit) {
      return;
    }

    this.setState({ isSharing: true });

    this.props
      .onShareSubmit(data)
      .then(() => {
        this.handleCloseDialog({ isOpen: false, event });
        this.setState({ isSharing: false });
      })
      .catch((err: Error) => {
        this.setState({
          isSharing: false,
          shareError: {
            message: err.message,
          },
        });
        // send analytic event about the err
      });
  };

  private handleFormDismiss = (data: DialogContentState) => {
    this.setState(({ ignoreIntermediateState }) =>
      ignoreIntermediateState ? null : { defaultValue: data },
    );
  };

  handleShareFailure = (_err: Error) => {
    // TBC: FS-3429 replace send button with retry button
    // will need a prop to pass through the error message to the ShareForm
  };

  render() {
    const { isDialogOpen, isSharing, shareError, defaultValue } = this.state;
    const {
      capabilities,
      copyLink,
      dialogPlacement,
      isDisabled,
      loadUserOptions,
    } = this.props;

    // for performance purposes, we may want to have a lodable content i.e. ShareForm
    return (
      <div
        tabIndex={0}
        onKeyDown={this.handleKeyDown}
        style={{ outline: 'none' }}
        ref={this.containerRef}
      >
        <InlineDialog
          content={
            <InlineDialogFormWrapper>
              <ShareForm
                copyLink={copyLink}
                loadOptions={loadUserOptions}
                isSharing={isSharing}
                onShareClick={this.handleShareSubmit}
                shareError={shareError}
                onDismiss={this.handleFormDismiss}
                defaultValue={defaultValue}
                capabilities={capabilities}
              />
            </InlineDialogFormWrapper>
          }
          isOpen={isDialogOpen}
          onClose={this.handleCloseDialog}
          placement={dialogPlacement}
        >
          {this.props.children ? (
            this.props.children({
              onClick: this.onTriggerClick,
              loading: isSharing,
              error: shareError,
            })
          ) : (
            <ShareButton
              text={
                this.props.buttonStyle === 'icon-with-text' ? (
                  <FormattedMessage {...messages.shareTriggerButtonText} />
                ) : null
              }
              onClick={this.onTriggerClick}
              isSelected={isDialogOpen}
              isDisabled={isDisabled}
            />
          )}
        </InlineDialog>
      </div>
    );
  }
}
