import * as React from 'react';
import { intlShape } from 'react-intl';
import * as PropTypes from 'prop-types';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { WidthProvider } from '@atlaskit/editor-common';
import EditorContext from '../../../../ui/EditorContext';
import { EditorActions } from '../../../../index';
import { PortalProviderAPI } from '../../../../ui/PortalProvider';
import { EditorProps } from '../editor-props-type';
import { EditorSharedConfigProvider } from '../context/shared-config';
import { useEditor } from '../hooks/use-editor';
import { EditorContentProvider } from './EditorContent';

export function EditorInternal(props: EditorPropsExtended, context: any) {
  const editorActions =
    ((context || {}).editorActions as EditorActions) || new EditorActions();

  const [editorSharedConfig, mountEditor] = useEditor({
    context,
    editorActions,
    createAnalyticsEvent: props.createAnalyticsEvent,

    disabled: props.disabled,

    transformer: props.transformer,
    defaultValue: props.defaultValue,

    plugins: props.plugins,

    portalProviderAPI: props.portalProviderAPI,
    popupsMountPoint: props.popupsMountPoint,
    popupsBoundariesElement: props.popupsBoundariesElement,
    popupsScrollableElement: props.popupsScrollableElement,

    onChange: props.onChange,
  });

  const onMount = props.onMount;

  React.useEffect(
    () => {
      if (editorSharedConfig) {
        editorActions._privateRegisterEditor(
          editorSharedConfig.editorView,
          editorSharedConfig.eventDispatcher,
        );

        if (onMount) {
          onMount(editorActions);
        }

        return () => {
          editorActions._privateUnregisterEditor();
        };
      }
    },
    [editorSharedConfig, editorActions, onMount],
  );

  return (
    <WidthProvider>
      <EditorContext editorActions={editorActions}>
        <EditorSharedConfigProvider value={editorSharedConfig}>
          <EditorContentProvider value={mountEditor}>
            {props.children}
          </EditorContentProvider>
        </EditorSharedConfigProvider>
      </EditorContext>
    </WidthProvider>
  );
}

EditorInternal.contextTypes = {
  editorActions: PropTypes.object,
  intl: intlShape,
};

export type EditorPropsExtended = EditorProps & {
  portalProviderAPI: PortalProviderAPI;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
};
