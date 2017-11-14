import { shallow, mount } from 'enzyme';
import * as React from 'react';
import codeBlockPlugins, { CodeBlockState } from '../../src/plugins/code-block';
import { FloatingToolbar } from '../../src/ui/LanguagePicker/styles';
import Select from '@atlaskit/single-select';
import { TrashToolbarButton } from '../../src/ui/LanguagePicker/styles';
import LanguagePicker from '../../src/ui/LanguagePicker';
import { code_block, doc, p, makeEditor, createEvent } from '@atlaskit/editor-test-helpers';
import defaultSchema from '../../src/test-helper/schema';

describe('@atlaskit/editor-core/ui/LanguagePicker', () => {
  const event = createEvent('event');
  const editor = (doc: any) => makeEditor<CodeBlockState>({
    doc,
    plugins: codeBlockPlugins(defaultSchema),
  });

  describe('when toolbarVisible is false', () => {
    it('does not render toolbar', () => {
      const { editorView, pluginState } = editor(doc(code_block()('text')));

      const languagePicker = shallow(<LanguagePicker pluginState={pluginState} editorView={editorView} />);
      languagePicker.setState({ toolbarVisible: false });

      expect(languagePicker.find(FloatingToolbar).length).toBe(0);
    });
  });

  describe('when toolbarVisible is true', () => {
    it('renders toolbar', () => {
      const { editorView, pluginState } = editor(doc(code_block()('text')));

      const languagePicker = shallow(<LanguagePicker pluginState={pluginState} editorView={editorView} />);
      languagePicker.setState({ toolbarVisible: true });

      expect(languagePicker.find(FloatingToolbar).length).toBe(1);
    });
  });

  describe('when languageSelectFocused is true', () => {
    it('renders toolbar', () => {
      const { editorView, pluginState } = editor(doc(code_block()('text')));

      const languagePicker = shallow(<LanguagePicker pluginState={pluginState} editorView={editorView} />);
      languagePicker.setState({ languageSelectFocused: true, toolbarVisible: false });

      expect(languagePicker.find(Select).length).toBe(1);
    });
  });

  describe('click on a code block element', () => {
    it('sets toolbarVisible to be true', () => {
      const { editorView, plugin, pluginState, sel } = editor(doc(code_block()('text')));
      const languagePicker = mount(<LanguagePicker pluginState={pluginState} editorView={editorView} />);

      plugin.props.onFocus!(editorView, event);
      plugin.props.handleClick!(editorView, sel, event);

      expect(languagePicker.state('toolbarVisible')).toBe(true);
      languagePicker.unmount();
    });
  });

  describe('click on a non code block element', () => {
    it('sets current code-block element to be undefined', () => {
      const { editorView, plugin, pluginState, sel } = editor(doc(p('text')));
      const languagePicker = mount(<LanguagePicker pluginState={pluginState} editorView={editorView} />);

      plugin.props.handleClick!(editorView, sel, event);

      expect(languagePicker.state('element')).toBe(undefined);
      languagePicker.unmount();
    });
  });

  describe('editor is blur', () => {
    it('LanguagePicker produce null HTML', () => {
      const { editorView, plugin, pluginState, sel } = editor(doc(p('paragraph'), code_block()('{<}codeBlock{>}')));

      plugin.props.onFocus!(editorView, event);
      plugin.props.handleClick!(editorView, sel, event);

      const languagePicker = mount(<LanguagePicker pluginState={pluginState} editorView={editorView} />);

      expect(languagePicker.html()).not.toBe(null);
      plugin.props.onBlur!(editorView, event);
      expect(languagePicker.html()).toEqual(null);
      languagePicker.unmount();
    });
  });

  describe('when code block has a language', () => {
    it('shows the formatted language', () => {
      const { editorView, pluginState } = editor(doc(code_block({ language: 'js' })('text')));
      const languagePicker = mount(<LanguagePicker pluginState={pluginState} editorView={editorView} />);

      expect(languagePicker.state('activeLanguage').name).toEqual('JavaScript');
      languagePicker.unmount();
    });

    it('updates plugin with the formatted langauge', () => {
      const { editorView, pluginState } = editor(doc(code_block({ language: 'js' })('text')));
      const languagePicker = mount(<LanguagePicker pluginState={pluginState} editorView={editorView} />);

      expect(pluginState.language).toEqual('javascript');
      languagePicker.unmount();
    });
  });

  describe('when code block has no language set', () => {
    it('shows no specific language', () => {
      const { editorView, pluginState } = editor(doc(code_block()('text')));
      const languagePicker = mount(<LanguagePicker pluginState={pluginState} editorView={editorView} />);

      expect(languagePicker.state('language')).toBe(undefined);
      languagePicker.unmount();
    });
  });

  describe('TrashIcon', () => {
    it('should be rendered in language picker floating toolbar', () => {
      const { editorView, pluginState } = editor(doc(code_block({ language: 'js' })('text')));

      const languagePicker = shallow(<LanguagePicker pluginState={pluginState} editorView={editorView} />);
      languagePicker.setState({ languageSelectFocused: true, toolbarVisible: false });

      expect(languagePicker.find(TrashToolbarButton).length).toBe(1);
    });
  });
});
