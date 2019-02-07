import * as React from 'react';
import rafSchedule from 'raf-schd';

const containerDivStyle: React.CSSProperties = {
  width: '100%',
  position: 'relative',
};

// Not using styled-components here for performance
// and framework-agnostic reasons.
const sizerStyle: React.CSSProperties = {
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
  height: 0,
  width: '100%',
  opacity: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: -1,
};

type Props = {
  children?: (width: Number) => JSX.Element;
  onResize?: (width: Number) => void;
  /** Optional styles to be applied to the containing element */
  containerStyle?: React.CSSProperties;
};

type State = {
  width?: Number;
};

// add a definition for a data field to the resize object
// since HTMLElements do not have this.
type ResizeObject = HTMLElement & {
  data: String;
  contentDocument: HTMLDocument;
};

export default class WidthDetector extends React.Component<Props, State> {
  props: Props;
  state: State = {};
  container?: HTMLDivElement;
  resizeObjectDocument?: Window;
  resizeObject?: ResizeObject;

  static defaultProps = {
    containerStyle: {},
  };

  handleResize = rafSchedule(() => {
    const { container } = this;
    if (!container) {
      return;
    }

    const width = container.offsetWidth;

    this.setState({
      width,
    });

    if (this.props.onResize) {
      this.props.onResize(width);
    }
  });

  componentDidMount() {
    if (this.resizeObject) {
      this.resizeObject.data = 'about:blank';
    }
  }

  componentWillUnmount() {
    this.handleResize.cancel();

    if (this.resizeObjectDocument) {
      this.resizeObjectDocument.removeEventListener(
        'resize',
        this.handleResize,
      );
    }
  }

  handleContainerRef = (ref?: HTMLDivElement) => {
    if (!ref) {
      return;
    }
    this.container = ref;
  };

  handleObjectRef = (ref?: ResizeObject) => {
    if (!ref) {
      return;
    }
    this.resizeObject = ref;
  };

  handleObjectLoad = () => {
    if (!this.resizeObject) {
      return;
    }

    this.resizeObjectDocument = this.resizeObject.contentDocument.defaultView;
    this.resizeObjectDocument.addEventListener('resize', this.handleResize);

    // Calculate width first time, after object has loaded.
    // Prevents it from getting in a weird state where width is always 0.
    this.handleResize();
  };

  renderChildren = () => {
    const { width } = this.state;
    if (width === null || width === undefined) {
      return null;
    }
    return this.props.children(width);
  };

  render() {
    let sizerEl;
    let { width } = this.state;
    // @TODO: Add alternative method using IntersectionObserver or ResizeObserver
    sizerEl = (
      <object
        type="text/html"
        style={sizerStyle}
        ref={this.handleObjectRef}
        onLoad={this.handleObjectLoad}
        aria-hidden
        tabIndex={-1}
      />
    );

    return (
      <React.Fragment>
        <div
          className="ak-width-detector-container"
          style={{ ...containerDivStyle, ...this.props.containerStyle }}
          ref={this.handleContainerRef}
        >
          {this.props.children(this.state.width)}
          {sizerEl}
        </div>
      </React.Fragment>
    );
  }
}
