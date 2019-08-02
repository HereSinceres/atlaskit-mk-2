import React, { Component, ReactNode } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

interface Props {
  /** The content to render inside the action button. */
  children?: ReactNode;
  /** Handler called when the element is clicked. */
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  /** Handler called when the element is focused. */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  /** Handler called when the element is moused over. */
  onMouseOver?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

class ActionItem extends Component<Props, {}> {
  render() {
    const { children, onClick, onFocus, onMouseOver } = this.props;
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <span onClick={onClick} onFocus={onFocus} onMouseOver={onMouseOver}>
        <Button appearance="subtle-link" spacing="none" type="button">
          {children}
        </Button>
      </span>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}

export { ActionItem as CommentActionWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext<Props>({
  componentName: 'commentAction',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents<Props>({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'commentAction',

      attributes: {
        componentName: 'commentAction',
        packageName,
        packageVersion,
      },
    }),
  })(ActionItem),
);
