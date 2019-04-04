import { code, md } from '@atlaskit/docs';
// import DynamicTable from '@atlaskit/dynamic-table';

export default md`
## v8 to v9

### ⚡️ Highlights
- **New API:** The exposed named exports are now InlineEdit and InlineEditableTextfield. These components
  are built to be standalone, not used within a Form, but rather, updating data individually. The props API for each
  of these components is similar in some ways, but simplified and clarified.
  - **InlineEdit** is a controlled component which receives a read view and an edit view as props, and facilitates
    the changing of editing state. It is designed to be simple but flexible.
  - **InlineEditableTextfield** is a component which abstracts away most of the complexity of the InlineEdit
    component and simply switches between a single line of text and a textfield.
- **Underlying technical improvements:**
  - Supports the use of Textfield and Textarea components (as an improvement over the
    soon-to-be deprecated Field-text and Field-text-area components).
  - Includes validation with an inline dialog, which is not loaded if a validate function
    is not provided, improving performance.
- **Typescript**: Inline Edit is now written in Typescript. The props are exported as Typescript types. This also
  means we are dropping support for Flow in this component.


**Note: the most major conceptual API change is that the new value is now only passed to the consumer
in the onConfirm handler, rather than in the input's onChange handler.**

### 💻 Upgrading:

In v8, we used to create inline edit components as follows:

${code`
  <InlineEdit
    editView={
      <SingleLineTextInput
        isEditing
        isInitiallySelected
        onChange={e => this.setState({ editValue: e.target.value })}
      />
    }
    readView={
      <SingleLineTextInput
        isEditing={false}
        value={this.state.editValue || 'Click to enter value'}
      />
    }
    onConfirm={() => console.log('onConfirm')}
    onCancel={() => console.log('onCancel')}
  />
`}

The above code could be written in v9 as:

${code`
  <InlineEdit
    editValue={this.state.editValue}
    editView={editViewProps => <TextField {...editViewProps} />}
    readView={() => (
      <ReadViewContainer>
        {this.state.editValue || 'Click to enter value'}
      </ReadViewContainer>
    )}
    onConfirm={value => this.setState({ editValue: value })}
  />
`}

Or even as:

${code`
  <InlineEditableTextfield
    editValue={this.state.editValue}
    onConfirm={value => this.setState({ editValue: value })}
    placeholder="Click to enter value"
  />
`}

### 🆕 Props added:

- **editValue**: The value which the input starts with when entering the edit view.
  Should be updated in the onConfirm handler. (***Required***)
- **startWithEditViewOpen:** Mount the component in an editing state.
- **keepEditViewOpenOnBlur:** Determines whether onConfirm handler is called when user clicks
  away from the inline edit (default) or not.
- **validate:** A function which takes a value and returns an error message, or undefined if
  valid. You can find more information about this validate function in the
  [Form package](/packages/core/form/docs/validation).
- **hideActionButtons:** Hides the confirm and cancel buttons from the edit view. Generally,
  depending on the type of input used in the edit view, users may press Enter or Ctrl + Enter
  to confirm, or focus away from the input (unless ***keepEditViewOpenOnBlur*** is true) to confirm,
  and press Esc to cancel.
- **readViewFitContainerWidth:** Determines whether the readView fits content (default) or
  stretches to fit its parent.

### 🚨 Deprecated Props:

- **isFitContainerWidthReadView:** Renamed to ***readViewFitContainerWidth***.
- **isWaiting:** Not implemented. Can be implemented in the read view by the consumer.
- **isInvalid:** Validation handled by ***validate*** prop. Please use this instead.
- **isLabelHidden:** This is not required as ***label*** prop is optional.
- **areActionButtonsHidden:** Renamed to ***hideActionButtons***.
- **isConfirmOnBlurDisabled:** Renamed to ***keepEditViewOpenOnBlur***.
- **onCancel:** Not exposed.
- **labelHtmlFor:** Not implemented.
- **shouldConfirmOnEnter:** Implemented by a combination of the Form component used internally
and the type of input used by the consumer in the edit view. Fields like textfield, select and
textarea have this functionality built in.
- **disableEditViewFieldBase:** Obsolete (component no longer uses field-base).
- **invalidMessage:** The validation message should be the return value of the function passed through
  the ***validate*** prop.
- **isEditing:** The InlineEdit component now fully controls the editing state. An uncontrolled
version is not currently exported.
- **onEditRequested:** Not exposed.


### ⏫ Props updated:

- **readView:** The function signature has been updated to \`() => React.ReactChild\`
- **editView:** The function signature has been updated to \`(editViewProps) => React.ReactChild\`
  - Where editViewProps should be spread onto the returned input node
- **onConfirm:** The function signature has been updated to \`(value: any, analyticsEvent: UIAnalyticsEvent) => void\`

`;
