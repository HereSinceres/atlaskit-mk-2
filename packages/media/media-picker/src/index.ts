export {
  DropzoneUploadEventPayloadMap,
  PopupUploadEventPayloadMap,
} from './components/types';

import {
  BinaryUploader,
  BinaryUploaderConstructor,
  BinaryConfig,
  Browser,
  BrowserConfig,
  BrowserConstructor,
  ClipboardConfig,
  Popup,
  PopupConfig,
  PopupConstructor,
  DropzoneConfig,
  DropzoneConstructor,
  Dropzone,
} from './components/types';

import { Context } from '@atlaskit/media-core';

export const isBinaryUploader = (
  component: any,
): component is BinaryUploader => {
  return 'upload' in component;
};
export const isBrowser = (component: any): component is Browser =>
  component && 'browse' in component && 'teardown' in component;
export const isDropzone = (component: any): component is Dropzone =>
  component && 'activate' in component && 'deactivate' in component;
export const isPopup = (component: any): component is Popup =>
  component &&
  ['show', 'cancel', 'teardown', 'hide'].every(
    (prop: string) => prop in component,
  );

// Events public API and types
export {
  UploadsStartEventPayload,
  UploadStatusUpdateEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadEventPayloadMap,
  isImagePreview,
} from './domain/uploadEvent';

export { MediaFile } from './domain/file';
export { MediaProgress } from './domain/progress';
export { MediaError } from './domain/error';
export { ImagePreview, Preview, NonImagePreview } from './domain/preview';

// Constructor public API and types
export interface MediaPickerConstructors {
  binary: BinaryUploaderConstructor;
  browser: BrowserConstructor;
  dropzone: DropzoneConstructor;
  popup: PopupConstructor;
}

export { BinaryUploader, Browser, Dropzone, Popup };
export type MediaPickerComponent = BinaryUploader | Browser | Dropzone | Popup;

export interface MediaPickerComponents {
  binary: BinaryUploader;
  browser: Browser;
  dropzone: Dropzone;
  popup: Popup;
}

export { UploadParams } from './domain/config';

export {
  BrowserConfig,
  DropzoneConfig,
  PopupConfig,
  BinaryConfig,
  ClipboardConfig,
};
export interface ComponentConfigs {
  binary: BinaryConfig;
  browser: BrowserConfig;
  clipboard: ClipboardConfig;
  dropzone: DropzoneConfig;
  popup: PopupConfig;
}

export {
  BinaryUploaderConstructor,
  BrowserConstructor,
  DropzoneConstructor,
  PopupConstructor,
};

export async function MediaPicker<K extends keyof MediaPickerComponents>(
  componentName: K,
  context: Context,
  pickerConfig?: ComponentConfigs[K],
): Promise<MediaPickerComponents[K]> {
  switch (componentName) {
    case 'binary':
      const {
        BinaryUploaderImpl,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-binary" */ './components/binary');
      return new BinaryUploaderImpl(context, pickerConfig as BinaryConfig);
    case 'browser':
      const {
        BrowserImpl,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-browser" */ './components/browser');
      return new BrowserImpl(context, pickerConfig as
        | BrowserConfig
        | undefined);
    case 'dropzone':
      const {
        DropzoneImpl,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-dropzone" */ './components/dropzone');
      return new DropzoneImpl(context, pickerConfig as
        | DropzoneConfig
        | undefined);
    case 'popup':
      const {
        PopupImpl,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-popup" */ './components/popup');
      return new PopupImpl(context, pickerConfig as PopupConfig);
    default:
      throw new Error(`The component ${componentName} does not exist`);
  }
}

// REACT COMPONENTS

export { Clipboard } from './components/clipboard';
