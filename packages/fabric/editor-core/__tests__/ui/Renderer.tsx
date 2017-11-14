import * as React from 'react';
import { mount } from 'enzyme';
import Renderer from '../../src/ui/Renderer';

describe('@atlaskit/editor-core/ui/Renderer', () => {
  it('should catch errors and render unsupported content text', () => {
    const doc = {
      type: 'doc',
      content: 'foo',
    };

    const renderer = mount(<Renderer document={doc} />);
    expect(renderer.find('UnsupportedBlockNode').length).toBe(1);
    renderer.unmount();
  });
});
