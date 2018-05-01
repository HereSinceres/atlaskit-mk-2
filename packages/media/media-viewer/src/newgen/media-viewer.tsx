import * as React from 'react';
import { Context } from '@atlaskit/media-core';
import { ItemViewer } from './item-viewer';
import { Identifier } from './domain';
import { Blanket, Content, HeaderWrapper } from './styled';
import Navigation from './navigation';
import Header from './header';

export type Props = {
  onClose?: () => void;
  selectedItem: Identifier;
  items: Identifier[];
  context: Context;
};

export type State = {
  selectedItem: Identifier;
};

export class MediaViewer extends React.Component<Props, State> {
  state: State = { selectedItem: this.props.selectedItem };

  render() {
    const { onClose, context, items } = this.props;
    const { selectedItem } = this.state;

    return (
      <Blanket onClick={onClose}>
        <Content>
          <HeaderWrapper>
            <Header context={context} identifier={selectedItem} />
          </HeaderWrapper>
          <ItemViewer context={context} identifier={selectedItem} />
          <Navigation
            items={items}
            selectedItem={selectedItem}
            onChange={this.onNavigationChange}
          />
        </Content>
      </Blanket>
    );
  }

  onNavigationChange = (selectedItem: Identifier) => {
    this.setState({ selectedItem });
  };
}
