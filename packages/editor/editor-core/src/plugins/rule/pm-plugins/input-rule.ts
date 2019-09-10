import { InputRule, inputRules } from 'prosemirror-inputrules';
import { Fragment, Schema } from 'prosemirror-model';
import { Plugin, EditorState, Transaction } from 'prosemirror-state';
import { analyticsService } from '../../../analytics';
import {
  createInputRule,
  leafNodeReplacementCharacter,
} from '../../../utils/input-rules';
import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
  EVENT_TYPE,
} from '../../analytics';
import { safeInsert } from '../../../utils/insert';

export const createHorizontalRule = (
  state: EditorState,
  start: number,
  end: number,
  inputMethod:
    | INPUT_METHOD.QUICK_INSERT
    | INPUT_METHOD.TOOLBAR
    | INPUT_METHOD.INSERT_MENU
    | INPUT_METHOD.FORMATTING
    | INPUT_METHOD.SHORTCUT,
) => {
  if (!state.selection.empty) {
    return null;
  }

  /**
   * This is a workaround to get rid of the typeahead text when using quick insert
   * Once we insert *nothing*, we get a new transaction, so we can use the new selection
   * without considering the extra text after the `/` command.
   **/
  let tr: Transaction<any> | null = state.tr.replaceWith(
    start,
    end,
    Fragment.empty,
  );

  // let tr: Transaction<any> | null = insert(Fragment.empty);
  tr = safeInsert(state.schema.nodes.rule.createChecked(), tr.selection.from)(
    tr,
  );

  if (!tr) {
    /**
     * This piece of code `might` be deprecated and never used.
     * Because `---` command is only triggered at the start of a paragraph, which will covered by `saveInsert`.
     * TODO: evaluate if we can get rid of this piece of code.
     */
    const { $from } = state.selection;
    const $afterRule = state.doc.resolve($from.after());
    const { paragraph } = state.schema.nodes;

    if ($afterRule.nodeAfter && $afterRule.nodeAfter.type === paragraph) {
      // if there's already a paragraph after, just insert the rule into
      // the current paragraph
      end = end + 1;
    }

    tr = state.tr.replaceWith(
      start,
      end,
      Fragment.from(state.schema.nodes.rule.createChecked()),
    );
  }

  return addAnalytics(tr, {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.DIVIDER,
    attributes: { inputMethod },
    eventType: EVENT_TYPE.TRACK,
  });
};

const createHorizontalRuleAutoformat = (
  state: EditorState,
  start: number,
  end: number,
) => {
  analyticsService.trackEvent(
    `atlassian.editor.format.horizontalrule.autoformatting`,
  );

  return createHorizontalRule(state, start, end, INPUT_METHOD.FORMATTING);
};

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const rules: Array<InputRule> = [];

  if (schema.nodes.rule) {
    // '---' and '***' for hr
    rules.push(
      // -1, so that it also replaces the container paragraph
      createInputRule(
        /^(\-\-\-|\*\*\*)$/,
        (state, _match, start, end) =>
          createHorizontalRuleAutoformat(state, start - 1, end),
        true,
      ),
    );

    // '---' and '***' after shift+enter for hr
    rules.push(
      createInputRule(
        new RegExp(`${leafNodeReplacementCharacter}(\\-\\-\\-|\\*\\*\\*)`),
        (state, _match, start, end) => {
          const { hardBreak } = state.schema.nodes;
          if (state.doc.resolve(start).nodeAfter!.type !== hardBreak) {
            return null;
          }
          return createHorizontalRuleAutoformat(state, start, end);
        },
        true,
      ),
    );
  }

  if (rules.length !== 0) {
    return inputRules({ rules });
  }

  return;
}

export default inputRulePlugin;
