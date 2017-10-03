// @flow
import React from 'react';
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom';
import styled, { injectGlobal } from 'styled-components';
import { AkNavigationItem, AkNavigationItemGroup } from '@atlaskit/navigation';

import { PACKAGES } from '../constants';
import { getList as getExampleList } from '../utils/examples';
import ChangeLogExplorer from './ChangeLogExplorer';
import Home from './Home';
import Example from './Example';
import FourOhFour from './FourOhFour';
import Nav from './Nav';
import Package from './Package';
import Pattern from './Pattern';

/* eslint-disable no-unused-expressions */
injectGlobal`
  *, ::before, ::after {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  html, body, #app {
    position: relative;
    width: 100%;
    height: 100%;
  }

  body {
    margin: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
`;
/* eslint-enable no-unused-expressions */

const AppContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const AppNav = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 20rem;
`;

const AppContent = styled.div`
  position: absolute;
  left: 20rem;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
`;

const NavItemLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

export type AppProps = {};
export default class App extends React.PureComponent<AppProps> {
  props: AppProps;

  render() {
    return (
      <BrowserRouter>
        <AppContainer>
          <AppNav>
            <Nav title="Packages">
              <AkNavigationItemGroup title="Packages">
                {PACKAGES.elements.map(pkg => (
                  <NavItemLink key={pkg.name} to={`/packages/${pkg.group}/${pkg.name}`}>
                    <AkNavigationItem text={pkg.name} />
                  </NavItemLink>
                ))}
                {PACKAGES.fabric.map(pkg => (
                  <NavItemLink key={pkg.name} to={`/packages/${pkg.group}/${pkg.name}`}>
                    <AkNavigationItem text={pkg.name} />
                  </NavItemLink>
                ))}
              </AkNavigationItemGroup>
              <AkNavigationItemGroup title="Patterns">
                {getExampleList('patterns').map(({ link, name }) => (
                  <NavItemLink key={name} to={`/patterns/${link}`}>
                    <AkNavigationItem text={name} />
                  </NavItemLink>
                ))}
              </AkNavigationItemGroup>
            </Nav>
          </AppNav>
          <AppContent>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/packages/:group/:name/examples/:example" component={Example} />
              <Route path="/packages/:group/:name" component={Package} />
              <Route path="/patterns/:example" component={Pattern} />
              <Route path="/changelog/:group/:name/:semver?" component={ChangeLogExplorer} />
              <Route component={FourOhFour} />
            </Switch>
          </AppContent>
        </AppContainer>
      </BrowserRouter>
    );
  }
}
