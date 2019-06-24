import * as React from 'react';
import { BrowserProps } from './browser';
import { WithContextOrMediaClientConfigProps } from '@atlaskit/media-client';

type BrowserWithMediaClientConfigProps = WithContextOrMediaClientConfigProps<
  BrowserProps
>;
type BrowserWithMediaClientConfigComponent = React.ComponentType<
  BrowserWithMediaClientConfigProps
>;

type State = {
  Browser?: BrowserWithMediaClientConfigComponent;
};

export class BrowserLoader extends React.PureComponent<
  BrowserWithMediaClientConfigProps,
  State
> {
  static displayName = 'AsyncBrowser';
  static Browser?: BrowserWithMediaClientConfigComponent;

  state = {
    Browser: BrowserLoader.Browser,
  };

  async componentWillMount() {
    if (!this.state.Browser) {
      const [mediaClient, browserModule] = await Promise.all([
        import(/* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'),
        import(/* webpackChunkName:"@atlaskit-internal_Browser" */ './browser'),
      ]);

      BrowserLoader.Browser = mediaClient.withMediaClient(
        browserModule.Browser,
      );

      this.setState({
        Browser: BrowserLoader.Browser,
      });
    }
  }

  render() {
    if (!this.state.Browser) {
      return null;
    }

    return <this.state.Browser {...this.props} />;
  }
}