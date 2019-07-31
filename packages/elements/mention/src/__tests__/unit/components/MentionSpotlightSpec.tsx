import * as React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import { noop } from '@babel/types';
import Button from '@atlaskit/button';
import MentionSpotlight, { Props } from '../../../components/MentionSpotlight';
import * as SpotlightAnalytics from '../../../util/analytics';
function render(props: Partial<Props>) {
  return mountWithIntl(
    <MentionSpotlight
      createTeamLink="somelink"
      onClose={() => noop}
      {...props}
    />,
  );
}

let mockRegisterRender = jest.fn();
let mockRegisterCreateLinkClick = jest.fn();
let mockFireAnalyticsSpotlightMentionEvent = jest.fn();
//mockFireAnalyticsSpotlightMentionEvent.mockReturnValue = () => jest.fn();

jest.mock('../../../util/analytics', () => {
  const mockActualAnalytics = require.requireActual('../../../util/analytics');

  return {
    Actions: mockActualAnalytics.Actions,
    ComponentNames: mockActualAnalytics.ComponentNames,
    fireAnalyticsSpotlightMentionEvent: () =>
      mockFireAnalyticsSpotlightMentionEvent,
  };
});

describe('MentionSpotlight', () => {
  it('Should call onCall callback when the x is clicked', () => {
    const onClose = jest.fn();
    const spotlight = render({ onClose: onClose });

    spotlight.find(Button).simulate('click');

    expect(onClose).toHaveBeenCalled();
  });

  it('Should register render on mount', () => {
    const onClose = jest.fn();
    render({ onClose: onClose });

    expect(mockRegisterRender).toHaveBeenCalled();
  });

  it('Should register link on click', () => {
    const onClose = jest.fn();
    const spotlight = render({ onClose: onClose });

    spotlight.find('a').simulate('click');

    expect(mockRegisterCreateLinkClick).toHaveBeenCalled();
  });

  it('should not show the highlight if the spotlight has been closed by the user', () => {
    const onClose = jest.fn();
    const spotlight = render({ onClose: onClose });
    expect(spotlight.html()).not.toBeNull();
    spotlight.find(Button).simulate('click');
    expect(spotlight.html()).toBeNull();
  });

  it('should send analytics data if the spotlight has been closed by the user', () => {
    const onClose = jest.fn();
    const spotlight = render({ onClose: onClose });
    expect(spotlight.html()).not.toBeNull();
    spotlight.find(Button).simulate('click');
    expect(mockFireAnalyticsSpotlightMentionEvent).toHaveBeenCalledWith(
      SpotlightAnalytics.ComponentNames.SPOTLIGHT,
      SpotlightAnalytics.Actions.CLOSED,
      SpotlightAnalytics.ComponentNames.MENTION,
      'closeButton',
    );
  });
});
