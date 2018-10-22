export default {
  props: {
    version: { type: 'enum', values: [1] },
    type: { type: 'enum', values: ['doc'] },
    content: {
      type: 'array',
      items: [
        [
          'paragraph',
          'bulletList',
          'mediaSingle',
          'orderedList',
          'heading',
          'panel',
          'blockquote',
          'rule',
          'table',
          'codeBlock',
          'mediaGroup',
          'applicationCard',
          'decisionList',
          'taskList',
          'extension',
          'bodiedExtension',
          'blockCard',
          'layoutSection',
        ],
      ],
      allowUnsupportedBlock: true,
    },
  },
};
