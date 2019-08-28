import * as React from 'react';
import Button from '@atlaskit/button';
import Drawer from '@atlaskit/drawer';
import { mockEndpoints, REQUEST_FAST } from './helpers/mock-endpoints';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';
import * as colors from '@atlaskit/theme/colors';
import { createCustomTheme } from '../src/theme/theme-builder';
class JiraSwitcherExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    this.openDrawer();
  }

  openDrawer = () => {
    mockEndpoints(
      'jira',
      originalMockData => {
        return {
          ...originalMockData,
          LICENSE_INFORMATION_DATA: {
            hostname: 'https://some-random-instance.atlassian.net',
            firstActivationDate: 1492488658539,
            maintenanceEndDate: '2017-04-24',
            maintenanceStartDate: '2017-04-17',
            products: {
              'jira-software.ondemand': {
                billingPeriod: 'ANNUAL',
                state: 'ACTIVE',
              },
            },
          },
        };
      },
      REQUEST_FAST,
    );
    this.setState({
      isDrawerOpen: true,
    });
  };

  onClose = () => {
    this.setState({
      isDrawerOpen: false,
    });
  };

  onTriggerXFlow = (productKey: string, sourceComponent: string) => {
    console.log(
      `Triggering xflow for => ${productKey} from ${sourceComponent}`,
    );
  };

  render() {
    const redishColorScheme = {
      primaryTextColor: colors.text,
      secondaryTextColor: '#ff4c4c',
      primaryHoverBackgroundColor: '#ffcccc',
      secondaryHoverBackgroundColor: '#ffe5e5',
    };

    const theme = createCustomTheme(redishColorScheme);

    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="jira"
            cloudId="some-cloud-id"
            triggerXFlow={this.onTriggerXFlow}
            theme={theme}
          />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(JiraSwitcherExample));
