import { Schema } from 'prosemirror-model';
import { inputRules } from 'prosemirror-inputrules';
import { Transaction, Plugin } from 'prosemirror-state';
import {
  createInputRule,
  leafNodeReplacementCharacter,
} from '../../../utils/input-rules';
import { analyticsService } from '../../../analytics';
import { TypeAheadHandler } from '../types';

export function inputRulePlugin(
  schema: Schema,
  typeAheads: TypeAheadHandler[],
): Plugin | undefined {
  const triggers = typeAheads.map(t => t.trigger).join('|');

  if (!triggers.length) {
    return;
  }

  const regex = new RegExp(
    `(^|[\\s\(${leafNodeReplacementCharacter}])(${triggers})$`,
  );

  const typeAheadInputRule = createInputRule(regex, (state, match, start, end):
    | Transaction
    | undefined => {
    const mark = schema.mark('typeAheadQuery', { trigger: match[0] });
    const { tr } = state;

    analyticsService.trackEvent(
      'atlassian.fabric.mention.picker.trigger.shortcut',
    );

    return tr.replaceSelectionWith(schema.text(match[0], [mark]), false);
  });

  return inputRules({ rules: [typeAheadInputRule] });
}

export default inputRulePlugin;
