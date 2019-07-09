import { pluginKey } from '../../../../plugins/card/pm-plugins/main';
import {
  setProvider,
  queueCards,
  resolveCard,
} from '../../../../plugins/card/pm-plugins/actions';

import {
  doc,
  createEditorFactory,
  p,
  EditorTestCardProvider,
  createAnalyticsEventMock,
  inlineCard,
  blockCard,
  Refs,
} from '@atlaskit/editor-test-helpers';
import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next';
import { setNodeSelection } from '../../../../utils';
import { visitCardLink, removeCard } from '../../../../plugins/card/toolbar';
import { EditorView } from 'prosemirror-view';
import { createCardRequest } from './_helpers';

const atlassianUrl = 'http://www.atlassian.com/';

describe('card', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEventInterface>;

  const editor = (doc: any) => {
    createAnalyticsEvent = createAnalyticsEventMock();
    const wrapper = createEditor({
      doc,
      pluginKey,
      createAnalyticsEvent: createAnalyticsEvent as any,
      editorProps: { allowAnalyticsGASV3: true, UNSAFE_cards: {} },
    });
    createAnalyticsEvent.mockClear();
    return wrapper;
  };

  describe('actions', () => {
    describe('setProvider', () => {
      it('sets the card provider', () => {
        const { editorView } = editor(doc(p()));
        const { state, dispatch } = editorView;

        const provider = new EditorTestCardProvider();
        dispatch(setProvider(provider)(state.tr));

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [],
          provider: provider,
        });
      });
    });

    describe('queueCard', () => {
      it('queues a url', () => {
        const { editorView } = editor(doc(p()));
        const cardRequest = createCardRequest(atlassianUrl, 24);
        const {
          dispatch,
          state: { tr },
        } = editorView;

        dispatch(queueCards([cardRequest])(tr));

        expect(pluginKey.getState(editorView.state)).toEqual(
          expect.objectContaining({
            requests: [cardRequest],
          }),
        );
      });

      it('can queue the same url with different positions', () => {
        const { editorView } = editor(doc(p()));
        const { dispatch } = editorView;

        const cardRequestOne = createCardRequest(atlassianUrl, 24);
        const cardRequestTwo = createCardRequest(atlassianUrl, 420);

        dispatch(
          queueCards([cardRequestOne, cardRequestTwo])(editorView.state.tr),
        );

        expect(pluginKey.getState(editorView.state)).toEqual(
          expect.objectContaining({
            requests: [cardRequestOne, cardRequestTwo],
          }),
        );
      });
    });

    describe('resolve', () => {
      it('eventually resolves the url from the queue', async () => {
        const { editorView } = editor(doc(p()));
        const atlassianCardRequest = createCardRequest(atlassianUrl, 1);
        editorView.dispatch(
          queueCards([atlassianCardRequest])(editorView.state.tr),
        );

        editorView.dispatch(resolveCard(atlassianUrl)(editorView.state.tr));

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [],
          provider: null,
        });
      });
    });
  });

  describe('analytics', () => {
    const linkTypes = [
      {
        name: 'inlineCard',
        element: p('{<}', inlineCard({ url: atlassianUrl })('{>}')),
      },
      {
        name: 'blockCard',
        element: blockCard({ url: atlassianUrl })(),
      },
    ];

    linkTypes.forEach(type => {
      describe(`Toolbar ${type.name}`, () => {
        let editorView: EditorView;
        let refs: Refs;

        beforeEach(() => {
          ({ editorView, refs } = editor(doc(type.element)));
          if (type.name === 'blockCard') {
            setNodeSelection(editorView, 0);
          } else {
            setNodeSelection(editorView, refs['<']);
          }
        });

        describe('delete command', () => {
          beforeEach(() => {
            removeCard(editorView.state, editorView.dispatch);
          });

          it('should create analytics V3 event', () => {
            expect(createAnalyticsEvent).toHaveBeenCalledWith({
              action: 'deleted',
              actionSubject: 'smartLink',
              actionSubjectId: type.name,
              attributes: { inputMethod: 'toolbar', displayMode: type.name },
              eventType: 'track',
            });
          });
        });

        describe('visit command', () => {
          let windowSpy: jest.MockInstance<any>;
          beforeEach(() => {
            windowSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
            visitCardLink(editorView.state, editorView.dispatch);
          });

          afterEach(() => {
            windowSpy.mockRestore();
          });

          it('should create analytics V3 event', () => {
            expect(createAnalyticsEvent).toHaveBeenCalledWith({
              action: 'visited',
              actionSubject: 'smartLink',
              actionSubjectId: type.name,
              attributes: { inputMethod: 'toolbar' },
              eventType: 'track',
            });
          });

          it('should open a new tab with the right url', () => {
            expect(windowSpy).toHaveBeenCalledWith(atlassianUrl);
          });
        });
      });
    });
  });
});
