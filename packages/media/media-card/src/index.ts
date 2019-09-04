import { MouseEvent } from 'react';
import {
  FileDetails,
  MediaType,
  FileProcessingStatus,
  MediaClient,
  Identifier,
  ImageResizeMode,
} from '@atlaskit/media-client';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { CardAction } from './actions';
import { MediaViewerDataSource } from '@atlaskit/media-viewer';

export { default as Card } from './root/card/cardLoader';

export { CardAction, CardEventHandler } from './actions';

export type CardStatus =
  | 'uploading'
  | 'loading'
  | 'processing'
  | 'complete'
  | 'error'
  | 'failed-processing';

export type CardAppearance = 'auto' | 'image' | 'square' | 'horizontal';

export type CardDimensionValue = number | string;

export interface CardDimensions {
  width?: CardDimensionValue;
  height?: CardDimensionValue;
}

export interface CardEvent {
  event: MouseEvent<HTMLElement>;
  mediaItemDetails?: FileDetails;
}

export interface OnSelectChangeFuncResult {
  selected: boolean;
  mediaItemDetails?: FileDetails;
}

export interface OnSelectChangeFunc {
  (result: OnSelectChangeFuncResult): void;
}

export interface OnLoadingChangeState {
  readonly type: CardStatus;
  readonly payload?: Error | FileDetails;
}

export interface OnLoadingChangeFunc {
  (state: OnLoadingChangeState): void;
}

export interface SharedCardProps {
  readonly appearance?: CardAppearance;
  readonly dimensions?: CardDimensions;

  readonly actions?: Array<CardAction>;
  readonly selectable?: boolean;
  readonly selected?: boolean;
}

export interface CardOnClickCallback {
  (result: CardEvent, analyticsEvent?: UIAnalyticsEvent): void;
}

export interface CardEventProps {
  readonly onClick?: CardOnClickCallback;
  readonly onMouseEnter?: (result: CardEvent) => void;
  readonly onSelectChange?: OnSelectChangeFunc;
  readonly onLoadingChange?: OnLoadingChangeFunc;
}

export interface AnalyticsFileAttributes {
  fileMediatype?: MediaType;
  fileMimetype?: string;
  fileStatus?: FileProcessingStatus;
  fileSize?: number;
}

export interface AnalyticsLinkAttributes {
  linkDomain: string;
}

export interface AnalyticsViewAttributes {
  viewPreview: boolean;
  viewActionmenu: boolean;
  viewSize?: CardAppearance;
}

export interface BaseAnalyticsContext {
  // These fields are requested to be in all UI events. See guidelines:
  // https://extranet.atlassian.com/display/PData/UI+Events
  packageVersion: string; // string — in a format like '3.2.1'
  packageName: string;
  componentName: string;
  actionSubject: string; // ex. MediaCard
  actionSubjectId: string | null; // file/link id
}

export interface CardAnalyticsContext extends BaseAnalyticsContext {}

export interface CardViewAnalyticsContext extends BaseAnalyticsContext {
  loadStatus: 'fail' | 'loading_metadata' | 'uploading' | 'complete';
  viewAttributes: AnalyticsViewAttributes;
  fileAttributes?: AnalyticsFileAttributes;
  linkAttributes?: AnalyticsLinkAttributes;
}

export interface CardProps extends SharedCardProps, CardEventProps {
  readonly mediaClient: MediaClient;
  readonly identifier: Identifier;
  readonly isLazy?: boolean;
  readonly resizeMode?: ImageResizeMode;

  // only relevant to file card with image appearance
  readonly disableOverlay?: boolean;
  readonly useInlinePlayer?: boolean;
  readonly shouldOpenMediaViewer?: boolean;
  readonly mediaViewerDataSource?: MediaViewerDataSource;
  readonly contextId?: string;
}

export interface CardState {
  status: CardStatus;
  isCardVisible: boolean;
  previewOrientation: number;
  isPlayingFile: boolean;
  mediaViewerSelectedItem?: Identifier;
  metadata?: FileDetails;
  dataURI?: string;
  progress?: number;
  error?: Error;
}

export { CardLoading } from './utils/lightCards/cardLoading';
export { CardError } from './utils/lightCards/cardError';
export { defaultImageCardDimensions } from './utils/cardDimensions';
