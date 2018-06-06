import * as React from 'react';
import { colors } from '@atlaskit/theme';
import Objects24ImageIcon from '@atlaskit/icon/glyph/objects/24/image';
import { media, mediaGroup, mediaSingle } from '@atlaskit/editor-common';

import { EditorPlugin } from '../../types';
import { nodeViewFactory } from '../../nodeviews';
import WithPluginState from '../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../width';

import {
  stateKey as pluginKey,
  createPlugin,
  MediaProvider,
  MediaState,
  MediaStateManager,
  DefaultMediaStateManager,
} from './pm-plugins/main';
import keymapMediaSinglePlugin from './pm-plugins/keymap-media-single';
import keymapPlugin from './pm-plugins/keymap';
import ToolbarMedia from './ui/ToolbarMedia';
import MediaSingleEdit from './ui/MediaSingleEdit';
import ReactMediaGroupNode from './nodeviews/media-group';
import ReactMediaNode from './nodeviews/media';
import ReactMediaSingleNode from './nodeviews/media-single';
import { CustomMediaPicker } from './types';

export {
  MediaState,
  MediaStateManager,
  DefaultMediaStateManager,
  MediaProvider,
  CustomMediaPicker,
};

export interface MediaOptions {
  provider?: Promise<MediaProvider>;
  allowMediaSingle?: boolean | MediaSingleOptions;
  allowMediaGroup?: boolean;
  customDropzoneContainer?: HTMLElement;
  customMediaPicker?: CustomMediaPicker;
}

export interface MediaSingleOptions {
  disableLayout?: boolean;
}

const mediaPlugin = (options?: MediaOptions): EditorPlugin => ({
  nodes() {
    return [
      { name: 'mediaGroup', node: mediaGroup, rank: 1700 },
      { name: 'mediaSingle', node: mediaSingle, rank: 1750 },
      { name: 'media', node: media, rank: 1800 },
    ].filter(node => {
      const { allowMediaGroup = true, allowMediaSingle = false } =
        options || {};

      if (node.name === 'mediaGroup') {
        return allowMediaGroup;
      }

      if (node.name === 'mediaSingle') {
        return allowMediaSingle;
      }

      return true;
    });
  },

  pmPlugins() {
    return [
      {
        rank: 1200,
        plugin: ({
          schema,
          props,
          dispatch,
          eventDispatcher,
          providerFactory,
          errorReporter,
        }) =>
          createPlugin(
            schema,
            {
              providerFactory,
              nodeViews: {
                mediaGroup: nodeViewFactory(providerFactory, {
                  mediaGroup: ReactMediaGroupNode,
                  media: ReactMediaNode,
                }),
                mediaSingle: nodeViewFactory(providerFactory, {
                  mediaSingle: ({ view, node, ...props }) => (
                    <WithPluginState
                      editorView={view}
                      eventDispatcher={eventDispatcher}
                      plugins={{
                        width: widthPluginKey,
                      }}
                      render={({ width }) => (
                        <ReactMediaSingleNode
                          view={view}
                          node={node}
                          width={width}
                          {...props}
                        />
                      )}
                    />
                  ),
                  media: ReactMediaNode,
                }),
              },
              errorReporter,
              uploadErrorHandler: props.uploadErrorHandler,
              waitForMediaUpload: props.waitForMediaUpload,
              customDropzoneContainer:
                options && options.customDropzoneContainer,
              customMediaPicker: options && options.customMediaPicker,
            },
            dispatch,
            props.appearance,
          ),
      },
      { rank: 1220, plugin: ({ schema }) => keymapPlugin(schema) },
    ].concat(
      options && options.allowMediaSingle
        ? {
            rank: 1250,
            plugin: ({ schema }) => keymapMediaSinglePlugin(schema),
          }
        : [],
    );
  },

  contentComponent({ editorView }) {
    if (!options) {
      return null;
    }

    const { allowMediaSingle } = options;
    let disableLayout: boolean | undefined;
    if (typeof allowMediaSingle === 'object') {
      disableLayout = allowMediaSingle.disableLayout;
    }

    if (
      (typeof allowMediaSingle === 'boolean' && allowMediaSingle === false) ||
      (typeof disableLayout === 'boolean' && disableLayout === true)
    ) {
      return null;
    }

    const pluginState = pluginKey.getState(editorView.state);

    return <MediaSingleEdit pluginState={pluginState} />;
  },

  secondaryToolbarComponent({ editorView, disabled }) {
    return (
      <ToolbarMedia
        editorView={editorView}
        pluginKey={pluginKey}
        isDisabled={disabled}
        isReducedSpacing={true}
      />
    );
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Files and images',
        icon: () => (
          <Objects24ImageIcon
            label="Files and images"
            primaryColor={colors.Y300}
          />
        ),
        action(insert, state) {
          const pluginState = pluginKey.getState(state);
          pluginState.showMediaPicker();
          return insert();
        },
      },
    ],
  },
});

export default mediaPlugin;
