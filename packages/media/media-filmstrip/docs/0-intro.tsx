import * as React from 'react';
import { md, code, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage appearance="warning">
    <p>
      <strong>
        Note: This component is designed for internal Atlassian development.
      </strong>
    </p>
    <p>
      External contributors will be able to use this component but will not be
      able to submit issues.
    </p>
  </SectionMessage>
)}
  This component displays multiple media cards horizontally. Allows to navigate through the stored cards.

  ## Usage

  ${code`
  import React from 'react';
  import { FilmstripView } from '@atlaskit/media-filmstrip';

  class FilmstripViewExample extends React.Component {
    state = {
      animate: false,
      offset: 0,
    };

    handleSizeChange = ({ offset }) => this.setState({ offset });

    handleScrollChange = ({ animate, offset }) =>
      this.setState({ animate, offset });

    render() {
      const { animate, offset, children } = this.state;
      return (
        <FilmstripView
          animate={animate}
          offset={offset}
          onSize={this.handleSizeChange}
          onScroll={this.handleScrollChange}
        >
          <div>#1</div>
          <div>#2</div>
          <div>#3</div>
          <div>#4</div>
          <div>#5</div>
        </FilmstripView>
      );
    }
  }
`}

${(
  <Example
    Component={require('../examples/0-editable').default}
    title="Editable"
    source={require('!!raw-loader!../examples/0-editable')}
  />
)}

${(
  <Props props={require('!!extract-react-types-loader!../src/filmstripView')} />
)}
`;
