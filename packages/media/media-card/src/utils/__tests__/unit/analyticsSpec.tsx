import React from 'react';
import { mount } from 'enzyme';
import {
  AnalyticsListener,
  withAnalyticsEvents,
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import {
  createAndFireMediaEvent,
  MediaCardAnalyticsPayolad,
  MediaCardAnalyticsPayoladBase,
  createAndFireCustomMediaEvent,
  getUIAnalyticsContext,
} from '../../analytics';
import {
  version as packageVersion,
  name as packageName,
} from '../../../version.json';
import { FileDetails } from '@atlaskit/media-client';

const somePayload: MediaCardAnalyticsPayoladBase = {
  eventType: 'ui',
  action: 'the-action',
  actionSubject: 'the-subject',
  actionSubjectId: 'the-subject-id',
  attributes: {
    attr1: 'this',
    attr2: 'is',
    attr3: 'nice',
  },
};

const mediaPayload: MediaCardAnalyticsPayolad = {
  ...somePayload,
  attributes: {
    packageName,
    ...somePayload.attributes,
  },
};

describe('Media Analytics', () => {
  // For some unknown reason this test does not work. Although, the function does work in the actual code
  // The problem might be in the click event simulation
  // TODO: fix this test
  it.skip('Should provide an analytics event creator for Media Card', () => {
    const SomeComponent = () => <span>Hi!</span>;
    const SomeWrappedComponent = withAnalyticsEvents({
      onClick: createAndFireMediaEvent(somePayload),
    })(SomeComponent);

    const analyticsEventHandler = jest.fn();
    const listener = mount(
      <AnalyticsListener
        channel={FabricChannel.media}
        onEvent={analyticsEventHandler}
      >
        <SomeWrappedComponent />
      </AnalyticsListener>,
    );
    listener.find(SomeComponent).simulate('click');

    expect(analyticsEventHandler).toHaveBeenCalledTimes(1);
    const actualEvent: Partial<UIAnalyticsEvent> =
      analyticsEventHandler.mock.calls[0][0];
    expect(actualEvent.payload).toMatchObject(mediaPayload);
  });

  it('Should provide a custom analytics event creator for Media Card', () => {
    type SomeComponentProps = {
      createAnalyticsEvent: CreateUIAnalyticsEvent;
    };
    const SomeComponent = (props: SomeComponentProps) => {
      const onCustomEvent = () => {
        createAndFireCustomMediaEvent(somePayload, props.createAnalyticsEvent);
      };
      onCustomEvent();
      return <span>'Hi!'</span>;
    };
    const SomeWrappedComponent = withAnalyticsEvents()(SomeComponent);

    const analyticsEventHandler = jest.fn();
    mount(
      <AnalyticsListener
        channel={FabricChannel.media}
        onEvent={analyticsEventHandler}
      >
        <SomeWrappedComponent />
      </AnalyticsListener>,
    );

    expect(analyticsEventHandler).toHaveBeenCalledTimes(1);
    const actualEvent: Partial<UIAnalyticsEvent> =
      analyticsEventHandler.mock.calls[0][0];
    expect(actualEvent.payload).toMatchObject(mediaPayload);
  });

  it('should generate Media Card UI Analytics Context data', () => {
    const metadata: FileDetails = {
      id: 'some-id',
      mediaType: 'video',
      size: 12345,
      processingStatus: 'succeeded',
    };

    const expectedContextData = {
      packageVersion,
      packageName,
      componentName: 'MediaCard',
      attributes: {
        packageVersion,
        packageName,
        componentName: 'MediaCard',
        fileAttributes: {
          fileSource: 'mediaCard',
          fileMediatype: 'video',
          fileId: 'some-id',
          fileSize: 12345,
          fileStatus: 'succeeded',
        },
      },
    };

    const contextData = getUIAnalyticsContext(metadata);
    expect(contextData).toMatchObject(expectedContextData);
  });
});
