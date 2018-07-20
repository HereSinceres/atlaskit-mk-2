export const ANALYTICS_CHANNEL = 'fabric-editor';

export type createAnalyticsEvent = (
  event: object,
) => { fire: (channel: string) => void };

export enum analyticsEvents {
  commentCreateStart = 'commentCreateStart',
  commentEditStart = 'commentEditStart',
  commentRequestCancel = 'commentRequestCancel',
  commentRequestRetry = 'commentRequestRetry',
  commentDelete = 'commentDelete',
  commentCreateSave = 'commentCreateSave',
  commentCreateCancel = 'commentCreateCancel',
  commentEditSave = 'commentEditSave',
  commentEditCancel = 'commentEditCancel',
}

export function fireEvent(
  action: analyticsEvents,
  containerId: string = '',
  analyticsEvent: any,
  commentLevel?: number,
) {
  analyticsEvent.update({
    actionSubjectId: action,
    action: 'clicked',
    containerId: containerId,
    attributes: {
      ...analyticsEvent.attributes,
      commentLevel,
    },
  });
  analyticsEvent.fire(ANALYTICS_CHANNEL);
}
