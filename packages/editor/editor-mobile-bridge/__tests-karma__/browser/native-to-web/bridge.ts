import * as sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { mountEditor } from './utils';
import { toNativeBridge } from '../../../src/editor/web-to-native';
import mobileEditor from '../../../src/editor/mobile-editor-element';
import { browser } from '@atlaskit/editor-common';

declare var bridge;

describe('NativeToWebBridge', () => {
  const originalContent = {
    version: 1,
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'test' }] }],
  };
  let editor;
  beforeEach(async () => {
    editor = mount(mobileEditor({}));
  });

  afterEach(() => {
    editor.unmount();
  });

  it('sets content', async () => {
    bridge.setContent(JSON.stringify(originalContent));

    const value = await bridge.editorActions.getValue();
    expect(value).to.be.deep.equal(originalContent);
  });

  it('gets content', () => {
    bridge.editorActions.replaceDocument(JSON.stringify(originalContent));

    const content = bridge.getContent();
    expect(JSON.parse(content)).to.be.deep.equal(originalContent);
  });

  it('can set headings', () => {
    const withHeading = {
      version: 1,
      type: 'doc',
      content: [
        {
          attrs: { level: 2 },
          type: 'heading',
          content: [{ type: 'text', text: 'test' }],
        },
      ],
    };

    bridge.editorActions.replaceDocument(JSON.stringify(originalContent));
    bridge.onBlockSelected('heading2');
    const content = bridge.getContent();
    expect(JSON.parse(content)).to.be.deep.equal(withHeading);
  });
});

describe('insert media', () => {
  let editor;
  beforeEach(async () => {
    editor = await mountEditor();
  });

  afterEach(() => {
    editor.unmount();
  });

  const contentWithMedia = {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'mediaGroup',
        content: [
          {
            type: 'media',
            attrs: {
              id: '116ba70f-9e28-41a1-ac81-6cdaef0665a0',
              collection: 'MediaServicesSample',
              type: 'file',
            },
          },
        ],
      },
      {
        type: 'paragraph',
        content: [],
      },
    ],
  };
  it('should dispatch media picker events', async () => {
    if (browser.ie) {
      this.skip();
    }
    sendSampleMediaEvents();
    const content = bridge.getContent();
    expect(JSON.parse(content)).to.be.deep.equal(contentWithMedia);
  });

  it('should update content on native side', async () => {
    if (browser.ie) {
      this.skip();
    }
    const mock = sinon.mock(toNativeBridge);
    mock
      .expects('updateText')
      .atLeast(1)
      .calledWith(JSON.stringify(contentWithMedia));
    sendSampleMediaEvents();
    mock.verify();
  });
});

function sendSampleMediaEvents() {
  bridge.onMediaPicked(
    'upload-preview-update',
    '{"file":{"id":"116ba70f-9e28-41a1-ac81-6cdaef0665a0","name":"IMG_20180406_001117.jpg","type":"file"},"public":{}}',
  );
  bridge.onMediaPicked(
    'upload-processing',
    '{"file":{"id":"116ba70f-9e28-41a1-ac81-6cdaef0665a0","name":"IMG_20180406_001117.jpg","type":"file"},"public":{}}',
  );
}

describe('set padding', () => {
  let editor;
  beforeEach(async () => {
    editor = await mountEditor();
  });

  afterEach(() => {
    editor.unmount();
  });

  it('sets padding on the editor', () => {
    bridge.setPadding(
      20 /* Top */,
      10 /* Right */,
      20 /* Bottom */,
      10 /* Left */,
    );

    const root = bridge.getRootElement();
    expect(root.style.padding).to.equal('20px 10px');
  });
});
