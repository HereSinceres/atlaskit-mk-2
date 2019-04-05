import {
  doc,
  createEditorFactory,
  p,
  a,
  blockquote,
  table,
  th,
  tr,
  td,
  ul,
  panel,
  bodiedExtension,
  taskItem,
  taskList,
  decisionList,
  decisionItem,
  li,
  insertText,
  createAnalyticsEventMock,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import { Fragment, Slice } from 'prosemirror-model';

import { pluginKey } from '../../../../plugins/card/pm-plugins/main';
import cardPlugin from '../../../../plugins/card';
import { CardProvider, CardPluginState } from '../../../../plugins/card/types';
import {
  setProvider,
  queueCards,
} from '../../../../plugins/card/pm-plugins/actions';

import { setTextSelection } from '../../../../utils';
import { queueCardsFromChangedTr } from '../../../../plugins/card/pm-plugins/doc';
import { panelPlugin } from '../../../../plugins';
import tablePlugin from '../../../../plugins/table';
import listsPlugin from '../../../../plugins/lists';
import tasksAndDecisionsPlugin from '../../../../plugins/tasks-and-decisions';
import extensionPlugin from '../../../../plugins/extension';
import { INPUT_METHOD } from '../../../../plugins/analytics';
import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next-types';
import { createCardRequest, setupProvider, ProviderWrapper } from './_helpers';

const inlineCardAdf = {
  type: 'inlineCard',
  attrs: {
    url: '',
    data: {
      '@context': 'https://www.w3.org/ns/activitystreams',
      '@type': 'Document',
      name: 'Welcome to Atlassian!',
      url: 'http://www.atlassian.com',
    },
  },
};
const atlassianUrl = 'http://www.atlassian.com/';
const googleUrl = 'http://www.google.com/';

describe('card', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEventInterface>;
  const editor = (doc: any) => {
    createAnalyticsEvent = createAnalyticsEventMock();
    const editorWrapper = createEditor({
      doc,
      editorProps: {
        allowTables: {
          advanced: true,
        },
        allowAnalyticsGASV3: true,
      },
      editorPlugins: [
        cardPlugin,
        panelPlugin,
        tablePlugin(),
        listsPlugin,
        tasksAndDecisionsPlugin,
        extensionPlugin,
      ],
      createAnalyticsEvent: createAnalyticsEvent as any,
      pluginKey,
    });

    createAnalyticsEvent.mockClear();

    return editorWrapper;
  };

  describe('doc', () => {
    describe('#state.update', async () => {
      it('keeps positions the same for typing after the link', () => {
        const { editorView, refs } = editor(
          doc(
            p(
              'hello have a link {<>}',
              a({ href: atlassianUrl })(atlassianUrl),
            ),
          ),
        );

        const { state, dispatch } = editorView;
        dispatch(
          queueCards([createCardRequest(atlassianUrl, refs['<>'])])(state.tr),
        );

        // should be at initial pos
        const initialState = {
          requests: [
            expect.objectContaining({
              url: atlassianUrl,
              pos: refs['<>'],
            }),
          ],
          provider: null,
        } as CardPluginState;
        expect(pluginKey.getState(editorView.state)).toEqual(initialState);

        // type something at end
        setTextSelection(editorView, editorView.state.doc.nodeSize - 2);
        insertText(editorView, 'more text', editorView.state.selection.from);

        // nothing should have changed
        expect(pluginKey.getState(editorView.state)).toEqual(initialState);
      });

      it('queues the link in a slice as the only node', () => {
        const linkDoc = p(
          a({
            href: atlassianUrl,
          })(atlassianUrl),
        );

        const { editorView } = editor(doc(p('blah')));

        const from = 0;
        const to = editorView.state.doc.nodeSize - 2;
        const tr = editorView.state.tr.replaceRange(
          from,
          to,
          new Slice(Fragment.from(linkDoc(editorView.state.schema)), 1, 1),
        );

        editorView.dispatch(
          queueCardsFromChangedTr(editorView.state, tr, INPUT_METHOD.CLIPBOARD),
        );

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            {
              url: 'http://www.atlassian.com/',
              pos: 1,
              appearance: 'inline',
              compareLinkText: true,
              source: 'clipboard',
            },
          ],
          provider: null,
        });
      });

      it('remaps positions for typing before the link', () => {
        const { editorView, refs } = editor(
          doc(
            p(
              '{<>}hello have a link',
              a({ href: atlassianUrl })('{link}' + atlassianUrl),
            ),
          ),
        );

        const { state, dispatch } = editorView;
        dispatch(
          queueCards([createCardRequest(atlassianUrl, refs['link'])])(state.tr),
        );

        // type something at start
        const typedText = 'before everything';
        insertText(editorView, typedText, refs['<>']);

        // nothing should have changed
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            expect.objectContaining({
              url: atlassianUrl,
              pos: refs['link'] + typedText.length,
            }),
          ],
          provider: null,
        } as CardPluginState);
      });

      it('only remaps the relevant link based on position', () => {
        const hrefs = {
          A: atlassianUrl,
          B: googleUrl,
        };

        // create a doc with 2 links
        const { editorView, refs } = editor(
          doc(
            p(
              'hello have a link {<>}',
              a({ href: hrefs.A })('{A}' + hrefs.B),
              ' and {middle} another ',
              a({ href: hrefs.B })('{B}' + hrefs.B),
            ),
          ),
        );

        const { dispatch } = editorView;

        // queue both links
        (Object.keys(hrefs) as Array<keyof typeof hrefs>).map(key => {
          dispatch(
            queueCards([createCardRequest(hrefs[key], refs[key])])(
              editorView.state.tr,
            ),
          );
        });

        // everything should be at initial pos
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            expect.objectContaining({
              url: hrefs['A'],
              pos: refs['A'],
            }),
            expect.objectContaining({
              url: hrefs['B'],
              pos: refs['B'],
            }),
          ],
          provider: null,
        });

        // type something in between the links
        insertText(editorView, 'ok', refs['middle']);

        // only B should have moved 2 to the right
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            expect.objectContaining({
              url: hrefs['A'],
              pos: refs['A'],
            }),
            expect.objectContaining({
              url: hrefs['B'],
              pos: refs['B'] + 2,
            }),
          ],
          provider: null,
        });
      });
    });

    describe('does not replace if provider', () => {
      const initialDoc = doc(
        p(
          'hello have a link ',
          a({ href: atlassianUrl })('{<>}' + atlassianUrl),
        ),
      );

      let view: EditorView;
      let provider: CardProvider;

      beforeEach(() => {
        const { editorView } = editor(initialDoc);
        view = editorView;
      });

      afterEach(async () => {
        // queue should now be empty, and document should remain the same
        expect(pluginKey.getState(view.state)).toEqual({
          requests: [],
          provider: provider,
        });

        expect(view.state.doc).toEqualDocument(initialDoc);
      });

      test('returns invalid ADF', async () => {
        const { dispatch } = view;
        const invalidADF = {
          type: 'panel',
          content: [
            {
              type: 'panel',
              content: [
                {
                  text: 'hello world',
                  type: 'text',
                },
              ],
            },
          ],
        };
        const providerWrapper = setupProvider(invalidADF);
        providerWrapper.addProvider(view);
        ({ provider } = providerWrapper);

        // try to replace the link using bad provider
        dispatch(
          queueCards([
            createCardRequest(atlassianUrl, view.state.selection.from),
          ])(view.state.tr),
        );
      });

      test('rejects', async () => {
        const { dispatch } = view;
        provider = new class implements CardProvider {
          resolve(url: string): Promise<any> {
            return Promise.reject('error').catch(() => {});
          }
        }();

        dispatch(setProvider(provider)(view.state.tr));

        // try to replace the link using bad provider
        dispatch(
          queueCards([
            createCardRequest(atlassianUrl, view.state.selection.from),
          ])(view.state.tr),
        );
      });
    });

    describe('changed document', () => {
      let providerWrapper: ProviderWrapper;

      beforeEach(() => {
        providerWrapper = setupProvider();
      });

      it('does not replace if link text changes', async () => {
        const href = 'http://www.sick.com/';
        const { editorView } = editor(
          doc(p('hello have a link ', a({ href })('{<>}' + href))),
        );

        const { dispatch } = editorView;
        providerWrapper.addProvider(editorView);

        // queue it
        dispatch(
          queueCards([
            createCardRequest(href, editorView.state.selection.from),
          ])(editorView.state.tr),
        );

        // now, change the link text (+1 so we change inside the text node with the mark, otherwise
        // we prefer to change on the other side of the boundary)
        insertText(editorView, 'change', editorView.state.selection.from + 1);

        await providerWrapper.waitForRequests();

        // link should not have been replaced, but text will have changed
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'hello have a link ',
              a({ href })(href[0] + 'change{<>}' + href.slice(1)),
            ),
          ),
        );

        // queue should be empty
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [],
          provider: providerWrapper.provider,
        });
      });

      it('replaces anyway if compareLinkText is false', async () => {
        const { editorView } = editor(
          doc(
            p(
              'hello have a link ',
              a({
                href: atlassianUrl,
              })('{<>}renamed link'),
            ),
          ),
        );

        const { dispatch } = editorView;
        providerWrapper.addProvider(editorView);

        // queue it
        dispatch(
          queueCards([
            createCardRequest(atlassianUrl, editorView.state.selection.from, {
              compareLinkText: false,
            }),
          ])(editorView.state.tr),
        );

        // the test cardProvider stores the promise for each card it's converting
        // resolve all the promises to allow the card plugin to convert the cards to links
        await providerWrapper.waitForRequests();

        // this test provider replaces links with the ADF of: p('hello world')
        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello have a link '), p('hello world'), p()),
        );
      });

      it('does not replace if position is some other content', async () => {
        const initialDoc = doc(
          p('hello have a link '),
          p('{<>}' + atlassianUrl),
        );

        const { editorView } = editor(initialDoc);

        const { dispatch } = editorView;
        providerWrapper.addProvider(editorView);

        // queue a non-link node
        dispatch(
          queueCards([
            createCardRequest(atlassianUrl, editorView.state.selection.from),
          ])(editorView.state.tr),
        );

        // resolve the provider
        await providerWrapper.waitForRequests();

        // nothing should change
        expect(editorView.state.doc).toEqualDocument(initialDoc);
      });
    });

    describe('analytics GAS V3', () => {
      const providerWrapper = setupProvider(inlineCardAdf);

      it('should create analytics GAS V3 event if insert card', async () => {
        const { editorView } = editor(
          doc(
            p(
              'hello have a link ',
              a({
                href: atlassianUrl,
              })(`{<>}${atlassianUrl}`),
            ),
          ),
        );

        providerWrapper.addProvider(editorView);

        // queue it
        editorView.dispatch(
          queueCards([
            createCardRequest(atlassianUrl, editorView.state.selection.from),
          ])(editorView.state.tr),
        );

        await providerWrapper.waitForRequests();

        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'inserted',
          actionSubject: 'document',
          actionSubjectId: 'smartLink',
          eventType: 'track',
          attributes: expect.objectContaining({
            domainName: 'www.atlassian.com',
            nodeType: 'inlineCard',
          }),
        });
      });

      function testWithContext(initialDoc: object, expectedContext: string) {
        test(`should create analytics GAS V3 with node context ${expectedContext}`, async () => {
          const { editorView } = editor(initialDoc);

          providerWrapper.addProvider(editorView);

          // queue it
          editorView.dispatch(
            queueCards([
              createCardRequest(atlassianUrl, editorView.state.selection.from),
            ])(editorView.state.tr),
          );

          await providerWrapper.waitForRequests();

          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'smartLink',
            eventType: 'track',
            attributes: expect.objectContaining({
              nodeContext: expectedContext,
            }),
          });
        });
      }

      // Test analytics with right context
      [
        {
          initialDoc: doc(
            blockquote(
              p(
                'hello have a link ',
                a({
                  href: atlassianUrl,
                })(`{<>}${atlassianUrl}`),
              ),
            ),
          ),
          expectedContext: 'blockquote',
        },
        {
          initialDoc: doc(
            table()(
              tr(
                th({ colwidth: [100] })(p('1')),
                th({ colwidth: [100] })(p('2')),
                th({ colwidth: [480] })(p('3')),
              ),
              tr(
                td({ colwidth: [100] })(
                  p(
                    'hello have a link ',
                    a({
                      href: atlassianUrl,
                    })(`{<>}${atlassianUrl}`),
                  ),
                ),
                td({ colwidth: [100] })(p('5')),
                td({ colwidth: [480] })(p('6')),
              ),
            ),
          ),
          expectedContext: 'tableCell',
        },
        {
          initialDoc: doc(
            table()(
              tr(
                th({ colwidth: [100] })(
                  p(
                    'hello have a link ',
                    a({
                      href: atlassianUrl,
                    })(`{<>}${atlassianUrl}`),
                  ),
                ),
                th({ colwidth: [100] })(p('2')),
                th({ colwidth: [480] })(p('3')),
              ),
              tr(
                td({ colwidth: [100] })(p('4')),
                td({ colwidth: [100] })(p('5')),
                td({ colwidth: [480] })(p('6')),
              ),
            ),
          ),
          expectedContext: 'tableHeader',
        },
        {
          initialDoc: doc(
            ul(
              li(
                p(
                  'hello have a link ',
                  a({
                    href: atlassianUrl,
                  })(`{<>}${atlassianUrl}`),
                ),
              ),
            ),
          ),
          expectedContext: 'listItem',
        },
        {
          initialDoc: doc(
            decisionList()(
              decisionItem({ localId: 'local-decision' })(
                'hello have a link ',
                a({
                  href: atlassianUrl,
                })(`{<>}${atlassianUrl}`),
              ),
            ),
          ),
          expectedContext: 'decisionList',
        },
        {
          initialDoc: doc(
            taskList()(
              taskItem({ localId: 'local-task' })(
                'hello have a link ',
                a({
                  href: atlassianUrl,
                })(`{<>}${atlassianUrl}`),
              ),
            ),
          ),
          expectedContext: 'taskList',
        },
        {
          initialDoc: doc(
            panel()(
              p(
                'hello have a link ',
                a({
                  href: atlassianUrl,
                })(`{<>}${atlassianUrl}`),
              ),
            ),
          ),
          expectedContext: 'panel',
        },
        {
          initialDoc: doc(
            bodiedExtension({
              extensionType: 'com.atlassian.confluence.macro.core',
              extensionKey: 'expand',
            })(
              p(
                'hello have a link ',
                a({
                  href: atlassianUrl,
                })(`{<>}${atlassianUrl}`),
              ),
            ),
          ),
          expectedContext: 'bodiedExtension',
        },
      ].forEach(({ initialDoc, expectedContext }) =>
        testWithContext(initialDoc, expectedContext),
      );
    });
  });
});
