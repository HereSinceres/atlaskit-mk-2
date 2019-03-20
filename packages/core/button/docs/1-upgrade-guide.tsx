import { code, md } from '@atlaskit/docs';

export default md`

## v11 to v12

### ⚡️ Highlights
- **New theming API** - Button now supports the new Atlaskit theming API, which allows for powerful custom theming of Buttons and
  its internal components.
- **Speed improvements** - Button has been re-written from the ground up - on heavy-load benchmarks, Button is twice as fast 
  (taking 48% of the time to load).
- **Emotion support** - Button is now built using Emotion 10! This is part of a wider push
  for Emotion across all Atlaskit components.

### 💥 Breaking Changes:
- The old theming API is no longer supported.
- Styling a Button using Styled Components is no longer supported.
- Custom components passed into Button will no longer have props filtered out for them.
- Camel-case ARIA props have been renamed (**ariaExpanded**, **ariaHaspopup** and **ariaLabel**).

### 🔧 In-depth upgrade guide:
#### Theming

Button now supports the updated Theming API. Custom theming functions have access to all of Button's props, as well as the to the original ADG theme - meaning that the custom theme can
change appearance based on different props, and even ignore the ADG styling completely. Custom
themes can modify any CSS prop on the button body, the internal icons, or the loading spinner.

For more details on building a custom Button theme, see the Theming Guide.

#### Dark Mode support

In \`v11\` we would add _dark mode_ to a button as follows:

${code`<Button theme="dark">Button</Button>`}

The above code could be written in \`v12\` as:

${code`
<Button theme={(theme, props) => theme({ ...props, mode: 'dark' })}
 Button
</Button>
`}

#### Styled-components support
In \`v11\`, Button could be styled using styled-components' \`styled\` function:

${code`
import styled from 'styled-components'

const CustomButton = styled(Button)\`
  background-color: red
\`)
`}

With the shift to Emotion in \`v12\`, we recommend using Emotion’s own \‘styled\’ function, or for more advanced use cases the new theming API:

${code`
import styled from '@emotion/styled'

const CustomButton = styled(Button)\`
  background-color: red
\`)
`}

The recommended action is to move your project from Styled Components to Emotion. We have created a codemod which aims to reduce the amount of busy work to upgrade, as much of the syntax is very similar. Here is how to get up and running:

1. Clone the [Atlaskit Codemod repository](https://bitbucket.org/atlassian/atlaskit-codemods/src/master/).
2. Follow the setup instructions on the [README](https://bitbucket.org/atlassian/atlaskit-codemods/src/master/README.md).
3. The codemod created for this upgrade is the [styled-components-to-emotion](https://bitbucket.org/atlassian/atlaskit-codemods/src/master/src/styled-components-to-emotion/README.md) codemod. The README in that directory contains all the information about setting up and running the codemod.


#### Custom component

In \`v11\`, Button would filter out its own props before passing to the child. This included for any custom children defined using the \`component\` prop:

${code`
const CustomComponent = (
  { children, innerRef, ...props }
) => <div {...props}>{children}</div>;

<Button component={CustomComponent}>Custom Button</Button>`}

In \`v12\` Buttons with custom child components will no longer filter out props automatically,
 and will need to be handled by the consumer. The above code could be written in \`v12\` as:

${code`
import { filterHTMLAttributes } from '@atlaskit/button';

const CustomComponent = (
  { children, innerRef, ...props }
) => <div {...filterHTMLAttributes(props)}>{children}</div>;

<Button component={CustomComponent}>Custom Button</Button>`}

#### ARIA attributes

ARIA attributes for Button now use kebab-case standard in React. The old attributes have
 been deprecated.

In \`v11\` we would use ARIA props as follows:

${code`
<Button
  ariaExpanded
  ariaHaspopup
  ariaLabel="special button"
>
  Arial Button
</Button>
`}

The above code could be written in \`v12\` as:

${code`
<Button
  aria-expanded
  aria-haspopup
  aria-label="special button"
>
  Arial Button
</Button>
`}

`;
