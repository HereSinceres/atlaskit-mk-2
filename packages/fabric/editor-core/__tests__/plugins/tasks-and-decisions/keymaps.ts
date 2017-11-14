import tasksAndDecisionsPlugins from '../../../src/plugins/tasks-and-decisions';
import {

  makeEditor,
  doc,
  p,
  decisionList,
  decisionItem,
  sendKeyToPm,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-test-helpers';
import { uuid } from '@atlaskit/editor-common';


describe('tasks and decisions - keymaps', () => {

  beforeEach(() => {
    uuid.setStatic('local-decision');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editor = (doc: any) => makeEditor({
    doc,
    plugins: tasksAndDecisionsPlugins(defaultSchema)
  });

  describe('decisions', () => {

    describe('Backspace', () => {

      describe('when decisionList exists before paragraph', () => {
        it('should merge paragraph with decisionItem and preserve content', () => {
          const { editorView } = editor(doc(decisionList(decisionItem('Hello')), p('{<>}World')));

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(
            decisionList(
              decisionItem('HelloWorld')
            ),
          ));
        });
        it('should remove paragraph with decisionItem and preserve content', () => {
          const { editorView } = editor(doc(decisionList(decisionItem('Hello')), p('{<>}')));

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(
            decisionList(
              decisionItem('Hello')
            ),
          ));
        });
      });

      describe('when cursor is at the begining of a decisionItem', () => {
        it('should merge content of current item with previous item', () => {
          const { editorView } = editor(doc(decisionList(decisionItem('Hello'), decisionItem('{<>}World'))));

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(
            decisionList(
              decisionItem('HelloWorld'),
            ),
          ));
        });
      });

      describe('when cursor is at the begining of the first decisionItem', () => {
        it('should convert item to paragraph', () => {
          const { editorView } = editor(doc(decisionList(decisionItem('{<>}Hello'), decisionItem('World'))));

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(
            p('Hello'),
            decisionList(
              decisionItem('World'),
            ),
          ));
        });

        it('should convert item to paragraph and remove the list if it is empty', () => {
          const { editorView } = editor(doc(decisionList(decisionItem('{<>}Hello World'))));

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(
            p('Hello World'),
          ));
        });

        it('should delete selection and keep decisionItem', () => {
          const { editorView } = editor(doc(decisionList(decisionItem('{<}Hello {>}World'))));

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(
            decisionList(
              decisionItem('World')
            )
          ));
        });
      });

    });

    describe('Enter', () => {
      describe('when decisionList is empty', () => {
        it('should remove decisionList and replace with paragraph', () => {
          const { editorView } = editor(doc(decisionList(decisionItem('{<>}'))));

          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(doc(
            p()
          ));
        });
      });

      describe('when cursor is at the end of empty decisionItem', () => {
        it('should remove decisionItem and insert a paragraph', () => {
          const { editorView } = editor(doc(decisionList(decisionItem('Hello World'), decisionItem('{<>}'))));

          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(doc(
            decisionList(
              decisionItem('Hello World')
            ),
            p()
          ));
        });
      });

      describe('when cursor is at the end of non-empty decisionItem', () => {
        it('should insert another decisionItem', () => {
          const { editorView } = editor(doc(decisionList(decisionItem('Hello World{<>}'))));

          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(doc(
            decisionList(
              decisionItem('Hello World'),
              decisionItem()
            ),
          ));
        });
      });
    });

  });

  describe('tasks', () => {

    describe('Backspace', () => {

      describe('when taskList exists before paragraph', () => {
        it('should merge paragraph with taskItem and preserve content', () => {
          const { editorView } = editor(doc(taskList(taskItem('Hello')), p('{<>}World')));

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(
            taskList(
              taskItem('HelloWorld')
            ),
          ));
        });

        it('should remove paragraph with taskItem and preserve content', () => {
          const { editorView } = editor(doc(taskList(taskItem('Hello')), p('{<>}')));

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(
            taskList(
              taskItem('Hello')
            ),
          ));
        });
      });

      describe('when cursor is at the begining of a taskItem', () => {
        it('should merge content of current item with previous item', () => {
          const { editorView } = editor(doc(taskList(taskItem('Hello'), taskItem('{<>}World'))));

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(
            taskList(
              taskItem('HelloWorld'),
            ),
          ));
        });
      });

      describe('when cursor is at the begining of the first taskItem', () => {
        it('should convert item to paragraph', () => {
          const { editorView } = editor(doc(taskList(taskItem('{<>}Hello'), taskItem('World'))));

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(
            p('Hello'),
            taskList(
              taskItem('World'),
            ),
          ));
        });

        it('should convert item to paragraph and remove the list if it is empty', () => {
          const { editorView } = editor(doc(taskList(taskItem('{<>}Hello World'))));

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(
            p('Hello World'),
          ));
        });

        it('should delete selection and keep taskItem', () => {
          const { editorView } = editor(doc(taskList(taskItem('{<}Hello {>}World'))));

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(
            taskList(
              taskItem('World')
            )
          ));
        });
      });

    });

    describe('Enter', () => {
      describe('when taskList is empty', () => {
        it('should remove taskList and replace with paragraph', () => {
          const { editorView } = editor(doc(taskList(taskItem('{<>}'))));

          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(doc(
            p()
          ));
        });
      });

      describe('when cursor is at the end of empty taskItem', () => {
        it('should remove decisionItem and insert a paragraph', () => {
          const { editorView } = editor(doc(taskList(taskItem('Hello World'), taskItem('{<>}'))));

          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(doc(
            taskList(
              taskItem('Hello World')
            ),
            p()
          ));
        });
      });

      describe('when cursor is at the end of non-empty taskItem', () => {
        it('should insert another taskItem', () => {
          const { editorView } = editor(doc(taskList(taskItem('Hello World{<>}'))));

          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(doc(
            taskList(
              taskItem('Hello World'),
              taskItem()
            ),
          ));
        });
      });
    });

  });

});
