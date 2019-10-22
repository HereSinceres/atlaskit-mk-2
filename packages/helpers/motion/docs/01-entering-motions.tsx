import React from 'react';
import { md, Props, Example } from '@atlaskit/docs';

export default md`
  ## \`<FadeIn />\`

  Useful for fading in one or more elements.

  ${(
    <Example
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-out-single-element').default}
      title="Single element"
      source={require('!!raw-loader!../examples/fade-out-single-element')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/fade-in')}
    />
  )}

  ## \`<StaggeredEntrance />\`

  Useful for staggering an entering motion over many elements.

  ${(
    <Example
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-in-list-of-elements').default}
      title="List of elements"
      source={require('!!raw-loader!../examples/fade-in-list-of-elements')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-in-grid-of-elements').default}
      title="Grid of elements"
      source={require('!!raw-loader!../examples/fade-in-grid-of-elements')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/staggered-entrance')}
    />
  )}

  ## \`<ExitingPersistence />\`

  Useful for enabling elements to persist and animate away when they are removed from the DOM.

  ${(
    <Example
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-between-elements').default}
      title="Single element"
      source={require('!!raw-loader!../examples/fade-between-elements')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/motion"
      Component={require('../examples/fade-out-list-of-elements').default}
      title="List of elements"
      source={require('!!raw-loader!../examples/fade-out-list-of-elements')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/entering/exiting-persistence')}
    />
  )}
`;
