# @atlaskit/media-card

## 66.1.2

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fix File Status in Media Card Analytics Events- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/media-viewer@44.1.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/media-client@4.2.0
  - @atlaskit/checkbox@10.1.4
  - @atlaskit/field-text@9.0.14
  - @atlaskit/item@10.2.0
  - @atlaskit/media-ui@11.7.2

## 66.1.1

### Patch Changes

- [patch][139ab68e90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/139ab68e90):

  ED-4359 fix focus being reset on remove mediagroup- Updated dependencies [768bac6d81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/768bac6d81):

  - @atlaskit/analytics-next@6.3.2

## 66.1.0

### Minor Changes

- [minor][c23ff56fb0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c23ff56fb0):

  Introduced new optional prop `testId` that will be applied to `data-testid` prop on top DOM element of Card

### Patch Changes

- [patch][5b2c89203e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b2c89203e):

  Fix linting errors from prettier upgrade

## 66.0.2

### Patch Changes

- [patch][d222c2b987](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d222c2b987):

  Theme has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided.

  ### Breaking

  ** getTokens props changes **
  When defining the value function passed into a ThemeProvider, the getTokens parameter cannot be called without props; if no props are provided an empty object `{}` must be passed in:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t(), backgroundColor: '#333'})}
  >
  ```

  becomes:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t({}), backgroundColor: '#333'})}
  >
  ```

  ** Color palette changes **
  Color palettes have been moved into their own file.
  Users will need to update imports from this:

  ```javascript
  import { colors } from '@atlaskit/theme';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import { colorPalette } from '@atlaskit/theme';

  colorPalette.colorPalette('8');
  ```

  or for multi entry-point users:

  ```javascript
  import * as colors from '@atlaskit/theme/colors';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import * as colorPalettes from '@atlaskit/theme/color-palette';

  colorPalettes.colorPalette('8');
  ```

## 66.0.1

### Patch Changes

- [patch][760bd84462](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/760bd84462):

  fixing analytics failed when user cancels file upload

- Updated dependencies [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/media-client@4.0.0
  - @atlaskit/media-test-helpers@25.2.2
  - @atlaskit/media-viewer@44.0.1

## 66.0.0

### Major Changes

- [major][c3e65f1b9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3e65f1b9e):

  ## Breaking change

  > remove deprecated "context" property from media components in favor of "mediaClientConfig"

  This affects all public media UI components:

  - Card
  - Filmstrip
  - SmartMediaEditor
  - MediaImage
  - Dropzone
  - Clipboard
  - Browser
  - MediaPicker
  - MediaViewer

  **Before**:

  ```
  import {ContextFactory} from '@atlaskit/media-core';
  import {Card} from '@atlaskit/media-card'
  import {SmartMediaEditor} from '@atlaskit/media-editor'
  import {Filmstrip} from '@atlaskit/media-filmstrip'
  import {MediaImage} from '@atlaskit/media-image'
  import {MediaViewer} from '@atlaskit/media-viewer'
  import {Dropzone, Clipboard, Browser, MediaPicker} from '@atlaskit/media-picker';

  const context = ContextFactory.creat({
    authProvider: () => Promise.resolve({})
  })

  const mediaPicker = MediaPicker(context);

  <Card context={context}>
  <SmartMediaEditor context={context}>
  <Filmstrip context={context}>
  <MediaImage context={context}>
  <Dropzone context={context}>
  <Clipboard context={context}>
  <Browser context={context}>
  <MediaViewer context={context}>
  ```

  **Now**:

  ```
  import {MediaClientConfig} from '@atlaskit/media-core';
  import {Card} from '@atlaskit/media-card'
  import {SmartMediaEditor} from '@atlaskit/media-editor'
  import {Filmstrip} from '@atlaskit/media-filmstrip'
  import {MediaImage} from '@atlaskit/media-image'
  import {MediaViewer} from '@atlaskit/media-viewer'
  import {Dropzone, Clipboard, Browser, MediaPicker} from '@atlaskit/media-picker';
  ```

const mediaClientConfig: MediaClientConfig = {
authProvider: () => Promise.resolve({})
}

const mediaPicker = MediaPicker(mediaClientConfig);

  <Card mediaClientConfig={mediaClientConfig}>
  <SmartMediaEditor mediaClientConfig={mediaClientConfig}>
  <Filmstrip mediaClientConfig={mediaClientConfig}>
  <MediaImage mediaClientConfig={mediaClientConfig}>
  <Dropzone mediaClientConfig={mediaClientConfig}>
  <Clipboard mediaClientConfig={mediaClientConfig}>
  <Browser mediaClientConfig={mediaClientConfig}>
  <MediaViewer mediaClientConfig={mediaClientConfig}>
  ```

- [major][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

**FABDODGEM-13 Editor Damask Release**

- [Internal post](http://go.atlassian.com/damask-release)

**BREAKING CHANGES**

- **Media:** Removed deprecated "context" property from media components in favor of "mediaClientConfig". This affects all public media UI components.
  - https://product-fabric.atlassian.net/browse/MS-2038
- **Tasks & Decisions:** Removed containerAri for task-decisions components.
  - https://product-fabric.atlassian.net/browse/ED-7631
- **Renderer:** Adapts to task-decision changes.
- **Editor Mobile Bridge:** Adapts to task-decision changes.
- **Util Data Test:** Adapts to task-decision changes.

---

**Affected Editor Components:**

tables, media, mobile, emoji, tasks & decisions, analytics

**Editor**

- Support nested actions in stage-0 schema; Change DOM representation of actions
  - https://product-fabric.atlassian.net/browse/ED-7674
- Updated i18n translations
  - https://product-fabric.atlassian.net/browse/ED-7750
- Improved analytics & crash reporting (via a new error boundary)
  - https://product-fabric.atlassian.net/browse/ED-7766
  - https://product-fabric.atlassian.net/browse/ED-7806
- Improvements to heading anchor links.
  - https://product-fabric.atlassian.net/browse/ED-7849
  - https://product-fabric.atlassian.net/browse/ED-7860
- Copy/Paste improvements
  - https://product-fabric.atlassian.net/browse/ED-7840
  - https://product-fabric.atlassian.net/browse/ED-7849
- Fixes for the selection state of Smart links.
  - https://product-fabric.atlassian.net/browse/ED-7602?src=confmacro
- Improvements for table resizing & column creation.
  - https://product-fabric.atlassian.net/browse/ED-7698
  - https://product-fabric.atlassian.net/browse/ED-7319
  - https://product-fabric.atlassian.net/browse/ED-7799

**Mobile**

- GASv3 Analytics Events are now relayed from the web to the native context, ready for dispatching.
  - https://product-fabric.atlassian.net/browse/FM-2502
- Hybrid Renderer Recycler view now handles invalid ADF nodes gracefully.
  - https://product-fabric.atlassian.net/browse/FM-2370

**Media**

- Improved analytics
  - https://product-fabric.atlassian.net/browse/MS-2036
  - https://product-fabric.atlassian.net/browse/MS-2145
  - https://product-fabric.atlassian.net/browse/MS-2416
  - https://product-fabric.atlassian.net/browse/MS-2487
- Added shouldOpenMediaViewer property to renderer
  - https://product-fabric.atlassian.net/browse/MS-2393
- Implemented analytics for file copy
  - https://product-fabric.atlassian.net/browse/MS-2036
- New `media-viewed` event dispatched when media is interacted with via the media card or viewer.
  - https://product-fabric.atlassian.net/browse/MS-2284
- Support for `alt` text attribute on media image elements.
  - https://product-fabric.atlassian.net/browse/ED-7776

**i18n-tools**

Bumped dependencies.

### Minor Changes

- [minor][eeb47666dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eeb47666dd):

Emit `media-viewed` event through `globalMediaEventEmitter` when media is viewed, played or downloaded via media card or media viewer.- [minor][550d260bfc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/550d260bfc):

Introducing support for alt-text in media.

- Updated dependencies [e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):
- @atlaskit/media-store@12.0.14
- @atlaskit/media-test-helpers@25.2.0
- @atlaskit/media-viewer@44.0.0
- @atlaskit/media-client@3.0.0

## 65.3.4

### Patch Changes

- [patch][c0bb2ebac5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0bb2ebac5):

check if selection.containsNode is available before using it to fix issue with IE11

## 65.3.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 65.3.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 65.3.1

### Patch Changes

- [patch][9bac6fd58e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9bac6fd58e):

HOT-88731 don't send external image URL as a part of analytics

## 65.3.0

### Minor Changes

- [minor][e44b5324de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e44b5324de):

Card now sends "copied file" on card copy event in editor and renderer- [minor][ab53f33dc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab53f33dc5):

Adding operational events for media card component

## 65.2.1

- Updated dependencies [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
- @atlaskit/button@13.3.1
- @atlaskit/media-ui@11.6.7
- @atlaskit/checkbox@10.0.0
- @atlaskit/docs@8.1.7

## 65.2.0

### Minor Changes

- [minor][b709292a5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b709292a5c):

Add new "contextId?: string" property to Card, to retrieve auth from a given context

### Patch Changes

- [patch][ace05e438f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ace05e438f):

Dont release file preview from Card when an external file is passed

## 65.1.1

### Patch Changes

- [patch][fc79969f86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc79969f86):

Update all the theme imports in media to use multi entry points

## 65.1.0

### Minor Changes

- [minor][b95f6ba701](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b95f6ba701):

Added Analytics events for Media Card Action, Dropdown Menu and Retry buttons

## 65.0.1

### Patch Changes

- [patch][8e2cb88526](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e2cb88526):

Adding Error boundary in Media Card

## 65.0.0

### Major Changes

- [major][af72468517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af72468517):

Media card now emit analytics events which payload and context stuctures reflect GASv3 payload specification.
Media Analytics Listener merges Payload and Context data before sending it to the backend. The merge is based on attributes.packageName equality
Media Analytics Listener adds packageHierarchy attribute to merged payload, the same way Atlaskit Listener does.

## 64.2.1

### Patch Changes

- [patch][9ce6986361](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ce6986361):

CEMS-244: Emit processed state when file gets copied

## 64.2.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

More information about the deprecation of lifecycles methods can be found here:
https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 64.1.0

### Minor Changes

- [minor][44202a6e9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44202a6e9a):

Analytics Event will be fired when InlinePlayer is being clicked

## 64.0.2

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 64.0.1

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

Upgraded Typescript to 3.3.x

## 64.0.0

### Major Changes

- [major][3624730f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3624730f44):

Property `type` was removed from `CardViewAnalyticsContext` interface
File size won't be displayed if it was set to zero or not obtained

## 63.3.12

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

Analytics-next has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No behavioural changes.

**Breaking changes**

- `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
- `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

**Breaking changes to TypeScript annotations**

- `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
- `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
- Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
- Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match source code
- Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match source code
- Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
- Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
- Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
- Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
- Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
- Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 63.3.11

- Updated dependencies [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
- @atlaskit/media-client@2.0.1
- @atlaskit/media-store@12.0.8
- @atlaskit/media-viewer@43.2.10
- @atlaskit/media-ui@11.5.2
- @atlaskit/media-test-helpers@25.0.0

## 63.3.10

### Patch Changes

- [patch][6ad542fe85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ad542fe85):

Adding try/catch in async imports for @atlaskit/media-avatar-picker, @atlaskit/media-card, @atlaskit/media-editor, @atlaskit/media-viewer

## 63.3.9

- Updated dependencies [ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):
- @atlaskit/media-store@12.0.6
- @atlaskit/media-test-helpers@24.3.5
- @atlaskit/media-viewer@43.2.8
- @atlaskit/media-client@2.0.0

## 63.3.8

### Patch Changes

- [patch][8dbc8914cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8dbc8914cd):

Hide inline video player controls during inactivty

## 63.3.7

- Updated dependencies [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
- @atlaskit/toggle@8.0.0

## 63.3.6

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

Consume analytics-next ts type definitions as an ambient declaration.

## 63.3.5

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

bugfix, fixes missing version.json file

## 63.3.4

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

In this PR, we are:

- Re-introducing dist build folders
- Adding back cjs
- Replacing es5 by cjs and es2015 by esm
- Creating folders at the root for entry-points
- Removing the generation of the entry-points at the root
  Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 63.3.3

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

Before:

```typescript
withAnalyticsEvents()(Button) as ComponentClass<Props>;
```

After:

```typescript
withAnalyticsEvents<Props>()(Button);
```

## 63.3.2

- Updated dependencies [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/media-ui@11.4.2
  - @atlaskit/checkbox@9.0.0

## 63.3.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/dropdown-menu@8.0.8
  - @atlaskit/field-radio-group@6.0.4
  - @atlaskit/toggle@7.0.3
  - @atlaskit/media-test-helpers@24.1.2
  - @atlaskit/media-ui@11.4.1
  - @atlaskit/media-viewer@43.1.3
  - @atlaskit/icon@19.0.0

## 63.3.0

### Minor Changes

- [minor][53b1e6a783](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53b1e6a783):

  Add a download button to inline video player to allow download of video binary

## 63.2.0

### Minor Changes

- [minor][09f094a7a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09f094a7a2):

  SL-259: bump react-lazily-render, remove react-lazily-render-scroll-parent.

## 63.1.5

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/checkbox@8.0.2
  - @atlaskit/dropdown-menu@8.0.4
  - @atlaskit/field-radio-group@6.0.2
  - @atlaskit/toggle@7.0.1
  - @atlaskit/media-test-helpers@24.0.3
  - @atlaskit/media-ui@11.2.8
  - @atlaskit/media-viewer@43.1.1
  - @atlaskit/field-range@7.0.4
  - @atlaskit/icon@18.0.0

## 63.1.4

### Patch Changes

- [patch][b37dd8dc38](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b37dd8dc38):

  Use video binary artifact while video is processing

## 63.1.3

### Patch Changes

- [patch][0a313cd541](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a313cd541):

  - rename AsyncCardState

## 63.1.2

- Updated dependencies [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/button@13.0.6
  - @atlaskit/media-ui@11.2.7
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/icon@17.2.0
  - @atlaskit/theme@9.1.0

## 63.1.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 63.1.0

- [minor][a02cbd46c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a02cbd46c0):

  - Now you can provide `MediaClientConfig` as `mediaClientConfig` prop to a Card as an alternative to Context. This is preferential, since Context prop will be dropped very soon.

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
  - @atlaskit/button@13.0.4
  - @atlaskit/media-ui@11.2.5
  - @atlaskit/media-viewer@43.0.2
  - @atlaskit/spinner@12.0.0
  - @atlaskit/media-client@1.2.0
  - @atlaskit/media-store@12.0.2
  - @atlaskit/media-test-helpers@24.0.0

## 63.0.4

- [patch][b91590107b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b91590107b):

  - ED-6178 Fix media wrapper having a transparent background for images

## 63.0.3

- [patch][a6f27f106a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6f27f106a):

  - use componentDidMount in CardLoader to make it SSR hydrate friendly

## 63.0.2

- Updated dependencies [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
  - @atlaskit/media-core@30.0.1
  - @atlaskit/media-store@12.0.1
  - @atlaskit/media-ui@11.1.1
  - @atlaskit/media-viewer@43.0.1
  - @atlaskit/media-test-helpers@23.0.0

## 63.0.1

- [patch][cbc9ff5b6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbc9ff5b6a):

  - Fix support for exif orientation when dropping a picture

## 63.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/media-viewer@43.0.0
  - @atlaskit/docs@8.0.0
  - @atlaskit/analytics-next@5.0.0
  - @atlaskit/button@13.0.0
  - @atlaskit/checkbox@7.0.0
  - @atlaskit/dropdown-menu@8.0.0
  - @atlaskit/field-radio-group@6.0.0
  - @atlaskit/field-range@7.0.0
  - @atlaskit/field-text@9.0.0
  - @atlaskit/icon@17.0.0
  - @atlaskit/spinner@11.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/toggle@7.0.0
  - @atlaskit/media-core@30.0.0
  - @atlaskit/media-store@12.0.0
  - @atlaskit/media-test-helpers@22.0.0
  - @atlaskit/media-ui@11.0.0

## 62.0.0

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/media-viewer@42.0.0
  - @atlaskit/media-store@11.1.1
  - @atlaskit/media-test-helpers@21.4.0
  - @atlaskit/media-core@29.3.0

## 61.0.0

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/media-viewer@41.0.0
  - @atlaskit/media-store@11.1.0
  - @atlaskit/media-test-helpers@21.3.0
  - @atlaskit/media-core@29.2.0

## 60.0.6

- [patch][d3cad2622e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3cad2622e):

  - Removes babel-runtime in favour of @babel/runtime

## 60.0.5

- [patch][8f17450f46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f17450f46):

  - Fix media-card code split from 82kB to 10kB

## 60.0.4

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 60.0.3

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/dropdown-menu@7.0.6
  - @atlaskit/field-radio-group@5.0.3
  - @atlaskit/field-range@6.0.4
  - @atlaskit/field-text@8.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/spinner@10.0.7
  - @atlaskit/toggle@6.0.4
  - @atlaskit/media-ui@10.1.5
  - @atlaskit/media-viewer@40.1.10
  - @atlaskit/theme@8.1.7

## 60.0.2

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 60.0.1

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/checkbox@6.0.3
  - @atlaskit/dropdown-menu@7.0.4
  - @atlaskit/field-radio-group@5.0.2
  - @atlaskit/field-text@8.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/toggle@6.0.3
  - @atlaskit/media-core@29.1.4
  - @atlaskit/media-store@11.0.7
  - @atlaskit/media-ui@10.1.3
  - @atlaskit/media-viewer@40.1.5
  - @atlaskit/field-range@6.0.3
  - @atlaskit/button@12.0.0

## 60.0.0

- [major][0ff405bd0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ff405bd0f):

  - Removed CardView and CardViewLoader from public APIs and replaced it with light-weight and stateless CardLoading and CardError components. Handling of external images is now done by Card component itself using ExternalImageIdentifier interface.

  If you???ve been using CardView for loading:

  ```js
  <CardView status="loading" mediaItemType="file" dimensions={cardDimensions} />
  ```

  Now you can use new component:

  ```js
  <CardLoading dimensions={cardDimensions} />
  ```

  If you were using CardView to show an error

  ```js
  <CardView status="error" mediaItemType={type} dimensions={cardDimensions} />
  ```

  Now you can use new component:

  ```js
  <CardError dimensions={cardDimensions} />
  ```

  In case you were using CardView to show image with known external URI:

  ```js
  <CardView status="complete" dataURI={dataURI} metadata={metadata} />
  ```

  You will have to find a way to switch to using Card component using ExternalImageIdentifier interface:

  ```js
  <Card identifier={identifier} context={context} />
  ```

## 59.1.1

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 59.1.0

- [minor][e1c1fa454a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1c1fa454a):

  - Support external image identifier in MediaViewer

## 59.0.0

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/media-viewer@40.0.0
  - @atlaskit/media-store@11.0.3
  - @atlaskit/media-test-helpers@21.1.0
  - @atlaskit/media-core@29.1.0

## 58.0.1

- [patch][106d046114](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/106d046114):

  - Fix issue with media-viewer opening in CC on inline video player controlls clicked

## 58.0.0

- [major][9c316bd8aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c316bd8aa):

  - Exported MediaImage component is removed from media-card and moved to @atlaskit/media-ui

## 57.0.3

- [patch][d402fdb775](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d402fdb775):

  - FIX ED-6584: Keep card dataURI regardless of previus state

## 57.0.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 57.0.1

- [patch][9192df506a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9192df506a):

  - Do not call given onClick if it's a video file and inline video player is enabled

## 57.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/checkbox@6.0.1
  - @atlaskit/dropdown-menu@7.0.1
  - @atlaskit/field-radio-group@5.0.1
  - @atlaskit/field-text@8.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/toggle@6.0.1
  - @atlaskit/media-viewer@39.0.0
  - @atlaskit/field-range@6.0.1
  - @atlaskit/button@11.0.0
  - @atlaskit/analytics-next-types@4.0.0
  - @atlaskit/media-core@29.0.0
  - @atlaskit/media-store@11.0.0
  - @atlaskit/media-test-helpers@21.0.0
  - @atlaskit/media-ui@10.0.0

## 56.0.0

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/media-test-helpers@20.1.8
  - @atlaskit/media-viewer@38.0.0
  - @atlaskit/media-core@28.0.0
  - @atlaskit/media-store@10.0.0

## 55.0.4

- [patch][ff3f40bc38](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff3f40bc38):

  - Fix remove from cache function, which fixes issue when user is deleting recent image in media picker

## 55.0.3

- [patch][3591859b2f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3591859b2f):

  - use ReactDOM.createPortal to render MediaViewer when shouldOpenMediaViewer=true

## 55.0.2

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/media-core@27.2.3
  - @atlaskit/media-store@9.2.1
  - @atlaskit/media-ui@9.2.1
  - @atlaskit/media-viewer@37.0.1
  - @atlaskit/media-test-helpers@20.1.7
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/checkbox@6.0.0
  - @atlaskit/dropdown-menu@7.0.0
  - @atlaskit/field-radio-group@5.0.0
  - @atlaskit/field-range@6.0.0
  - @atlaskit/field-text@8.0.0
  - @atlaskit/spinner@10.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/toggle@6.0.0

## 55.0.1

- [patch][d18b085e2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d18b085e2a):

  - Integrating truly upfront ID

## 55.0.0

- [patch][6bd4c428e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bd4c428e2):

  - load image preview as soon representation is present instead of waiting for file status to be processed

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/media-test-helpers@20.1.6
  - @atlaskit/media-core@27.2.0
  - @atlaskit/media-store@9.2.0

## 54.1.0

- [minor][eda74c4dce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eda74c4dce):

  - Add shouldOpenMediaViewer + mediaViewerDataSource optional props to Card api to simplify MediaViewer integration

## 54.0.0

- [major][190c4b7bd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/190c4b7bd3):

  - Remove Identifier type + related utilities and use the one from media-core

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
  - @atlaskit/media-store@9.1.7
  - @atlaskit/media-test-helpers@20.1.5
  - @atlaskit/media-core@27.1.0

## 53.0.0

- [major][46dfcfbeca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46dfcfbeca):

  - remove Link support from media-card

## 52.0.7

- [patch][ab6ba14cd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab6ba14cd3):

  - Fix a bug where droping image with EXIF orientation >= 5 end up screwing up proportions for some of the cases

## 52.0.6

- [patch][05c5bf7a93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05c5bf7a93):

  - Dont user pointer cursor for external images in Cards

## 52.0.5

- [patch][c415876da9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c415876da9):

  - add selected state to InlinePlayer in media-card

## 52.0.4

- Updated dependencies [d5bce1ea15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5bce1ea15):
  - @atlaskit/media-test-helpers@20.1.2
  - @atlaskit/media-ui@9.0.0

## 52.0.3

- [patch][ef469cbb0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef469cbb0b):

  - MS-357 replaced @atlaskit/util-shared-styles from media components by @atlaskit/theme

## 52.0.2

- [patch][0e164e542a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e164e542a):

  - MS-1465: Dont fetch file preview if we already have a local one

## 52.0.1

- [patch][1d3e336534](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d3e336534):

  - Show progress bar while file is uploading

## 52.0.0

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/media-test-helpers@20.1.0
  - @atlaskit/media-store@9.1.5
  - @atlaskit/media-core@27.0.0

## 51.0.3

- [patch][a3f8e527aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3f8e527aa):

  - Take into account if image is on it's side according to orientation tag when deciding how to crop/fit and image

## 51.0.2

- Updated dependencies [07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):
  - @atlaskit/media-core@26.2.1
  - @atlaskit/media-store@9.1.4
  - @atlaskit/media-ui@8.2.6
  - @atlaskit/media-test-helpers@20.0.0

## 51.0.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/dropdown-menu@6.1.26
  - @atlaskit/field-radio-group@4.0.15
  - @atlaskit/toggle@5.0.15
  - @atlaskit/media-test-helpers@19.1.1
  - @atlaskit/media-ui@8.2.5
  - @atlaskit/field-range@5.0.14
  - @atlaskit/icon@16.0.0

## 51.0.0

- [patch][b1627a5837](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1627a5837):

  - Enable inline video player in Editor and Renderer

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/media-store@9.1.3
  - @atlaskit/media-test-helpers@19.1.0
  - @atlaskit/media-core@26.2.0

## 50.0.0

- [patch][5b1e270](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b1e270):

  - Minor bug fixes

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
- Updated dependencies [3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):
  - @atlaskit/media-test-helpers@19.0.0
  - @atlaskit/media-core@26.1.0
  - @atlaskit/media-ui@8.2.4

## 49.0.0

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/media-test-helpers@18.9.1
  - @atlaskit/media-core@26.0.0

## 48.0.0

- [minor][72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):

  - Remove deprecated methods from media-core
  - Use context.collection methods in MediaViewer
  - Remove link support from media-card
  - Remove legacy services + providers from media-core
  - Remove link related methods from media-core
  - Remove axios dependency
  - Make context.getImage cancelable

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/media-core@25.0.0
  - @atlaskit/media-test-helpers@18.9.0

## 47.0.0

- [major][135ed00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/135ed00):

  - remove "small" appearance from media-card

## 46.0.1

- [patch][ca16fa9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca16fa9):

  - Add SSR support to media components

## 46.0.0

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/media-test-helpers@18.7.0
  - @atlaskit/media-core@24.7.0

## 45.0.0

- [minor][b5ab1a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5ab1a5):

  - Add stretch as a prop for CardContent and MediaImage; Convert new stretchy-fit resizeMode to stretch=true;

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/media-test-helpers@18.6.2
  - @atlaskit/media-core@24.6.0

## 44.2.0

- [minor][34369e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34369e4):

  - ED-5888 Add dark mode for media-card

## 44.1.4

- [patch][6f44079](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6f44079):

  - ED-5612: make image preview display correctly after replacing Card props

## 44.1.3

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/dropdown-menu@6.1.25
  - @atlaskit/field-radio-group@4.0.14
  - @atlaskit/field-range@5.0.12
  - @atlaskit/field-text@7.0.18
  - @atlaskit/icon@15.0.2
  - @atlaskit/spinner@9.0.13
  - @atlaskit/toggle@5.0.14
  - @atlaskit/media-core@24.5.2
  - @atlaskit/media-ui@8.1.2
  - @atlaskit/docs@6.0.0

## 44.1.2

- [patch][676257b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/676257b):

  - Prepare/fix card to be displayed as video inline player in renderer/editor contexts

## 44.1.1

- [patch][5de3574](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5de3574):

  - CustomVideoPlayer is now CustomMediaPlayer and supports audio through type property. Media Viewer now uses custom audio player for audio everywhere except IE11.

## 44.1.0

- [minor][c1ea81c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1ea81c):

  - use custom video player for inline video in media-card

## 44.0.2

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/dropdown-menu@6.1.23
  - @atlaskit/field-radio-group@4.0.12
  - @atlaskit/toggle@5.0.12
  - @atlaskit/media-test-helpers@18.3.1
  - @atlaskit/media-ui@7.6.2
  - @atlaskit/icon@15.0.0

## 44.0.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/dropdown-menu@6.1.22
  - @atlaskit/field-radio-group@4.0.11
  - @atlaskit/field-text@7.0.15
  - @atlaskit/icon@14.6.1
  - @atlaskit/spinner@9.0.11
  - @atlaskit/toggle@5.0.11
  - @atlaskit/media-core@24.5.1
  - @atlaskit/media-ui@7.6.1
  - @atlaskit/field-range@5.0.9
  - @atlaskit/button@10.0.0
  - @atlaskit/analytics-next-types@3.1.2

## 44.0.0

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/media-test-helpers@18.3.0
  - @atlaskit/media-core@24.5.0

## 43.0.0

- [minor][2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):

  - Allow to inline play video files in media-card

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/media-test-helpers@18.2.12
  - @atlaskit/media-core@24.4.0

## 42.0.0

- [major][04c7192](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04c7192):

  - remove CardList component from media-card

## 41.4.0

- [minor][abef80b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abef80b):

  - ED-5527: apply max-width: 100% and pass container size to Card as dimension

## 41.3.0

- [minor][4718333](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4718333):

  - Add play icon for video files in MediaCard

## 41.2.0

- [minor][439dde6" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/439dde6"
  d):

  - rotate local image preview in cards based on the file orientation

## 41.1.2

- [patch] Updated dependencies [ced32d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ced32d0)
  - @atlaskit/media-test-helpers@18.2.10
  - @atlaskit/media-ui@7.0.0
  - @atlaskit/smart-card@8.4.1

## 41.1.1

- [patch] Override css rules for an image inside a cart [20a15ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/20a15ef)

## 41.1.0

- [minor] Cleanup media + editor integration ???? [2f9d14d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f9d14d)

## 41.0.2

- [patch] Make image in the card non-draggable [615a536](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/615a536)

## 41.0.1

- [patch] User img tag in cards instead of div with background [22ae8bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22ae8bb)

## 41.0.0

- [patch] Split Media + Editor cleanup part 1 [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
- [major] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/media-core@24.3.0
  - @atlaskit/media-test-helpers@18.2.8

## 40.0.1

- [patch] Code split media list [d101ce1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d101ce1)

## 40.0.0

- [major] Remove support for ApplicationCard [6e510d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e510d8)

## 39.0.1

- [patch] Fix bug with download binary [71ebe0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/71ebe0b)

## 39.0.0

- [minor] Media-card: allow to download binary when processing failed, add failed-processing to CardStatus; Media-core: add context.file.downloadBinary, add failed-processing to FileStatus; Media-store: add getFileBinaryURL; [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
- [major] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/media-test-helpers@18.2.5
  - @atlaskit/media-core@24.2.0

## 38.0.1

- [patch] Add pagination to recents view in MediaPicker [4b3c1f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b3c1f5)

## 38.0.0

- [patch] Deprecate context.uploadFile & context.getFile. Instead context.file.upload & context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore as a second argument, not MediaApiConfig [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Deprecate context.uploadFile & context.getFile. Instead context.file.upload & context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore as a second argument, not MediaApiConfig [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
- [major] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [major] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/media-core@24.1.0
  - @atlaskit/media-test-helpers@18.2.3

## 37.0.1

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/button@9.0.13
  - @atlaskit/dropdown-menu@6.1.17
  - @atlaskit/field-radio-group@4.0.8
  - @atlaskit/toggle@5.0.9
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/media-test-helpers@18.2.1
  - @atlaskit/media-ui@6.0.1
  - @atlaskit/icon@14.0.0

## 37.0.0

- [major] Add I18n support to media-card [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)

## 36.1.1

- [patch] Fix rxjs imports to only import what's needed [2e0ce2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e0ce2b)

## 36.1.0

- [minor] Support external image identifiers in media-card [82c8bb9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82c8bb9)

## 36.0.0

- [major] Update RXJS dependency to ^5.5.0 [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
- [major] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/media-core@24.0.0
  - @atlaskit/media-test-helpers@18.0.0

## 35.0.0

- [major] Fix CardView code split + remove private components from public api [1be4bb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1be4bb8)

## 34.1.0

- [minor] Async load media-card modules by default [01416b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/01416b4)

## 34.0.4

- [patch] Refetch image when the dimensions change [a0475c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0475c2)

## 34.0.3

- [patch] Revert fix for MS-667 [43e601f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43e601f)

## 34.0.2

- [patch] use new tsconfig for typechecking [09df171](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09df171)

## 34.0.1

- [patch] Media-card now re-fetches the underlaying image when the dimensions prop changes [59fb6a4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59fb6a4)

## 34.0.0

- [major] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/media-core@23.2.0
  - @atlaskit/media-test-helpers@17.1.0

## 33.0.2

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
  - @atlaskit/media-test-helpers@17.0.2
  - @atlaskit/media-core@23.1.1

## 33.0.1

- [patch] use media tsconfig in media-card [3417d76](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3417d76)

## 33.0.0

- [minor] Expose upfrontId in MediaPicker [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
- [major] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/media-core@23.1.0

## 32.0.6

- [patch] Updated dependencies [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/media-test-helpers@17.0.0
  - @atlaskit/media-core@23.0.2

## 32.0.5

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/badge@9.1.1
  - @atlaskit/media-ui@5.1.2
  - @atlaskit/smart-card@8.0.1

## 32.0.4

- [patch] Updated dependencies [48b95b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48b95b0)
  - @atlaskit/smart-card@8.0.0
- [none] Updated dependencies [e9b1477](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b1477)
  - @atlaskit/smart-card@8.0.0

## 32.0.3

- [patch] ED-5222: bump react-lazily-render package [5844820](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5844820)
- [none] Updated dependencies [5844820](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5844820)
  - @atlaskit/smart-card@7.0.4

## 32.0.2

- [patch] Removing mutational rxjs imports and replace with explicit operators [353f9db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/353f9db)
- [patch] Removing mutational rxjs imports and replace with explicit operators [56c2df9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56c2df9)
- [none] Updated dependencies [353f9db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/353f9db)
  - @atlaskit/media-core@23.0.1
- [none] Updated dependencies [56c2df9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56c2df9)
  - @atlaskit/media-core@23.0.1

## 32.0.1

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next-types@3.0.1
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/field-text@7.0.4
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/toggle@5.0.5
  - @atlaskit/button@9.0.5
  - @atlaskit/lozenge@6.1.4
  - @atlaskit/field-range@5.0.3
  - @atlaskit/badge@9.0.4
  - @atlaskit/spinner@9.0.5
  - @atlaskit/field-radio-group@4.0.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/dropdown-menu@6.1.5
  - @atlaskit/avatar@14.0.6

## 32.0.0

- [patch] Synchronous property "serviceHost" as part of many Interfaces in media components (like MediaApiConfig) is removed and replaced with asynchronous "baseUrl" as part of Auth object. [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
- [major] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-test-helpers@16.0.0
  - @atlaskit/media-core@23.0.0

## 31.3.0

- [minor] change file image cards background color to transparent [59ccb09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59ccb09)

## 31.2.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/smart-card@7.0.2
  - @atlaskit/media-ui@5.0.2
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/toggle@5.0.4
  - @atlaskit/field-radio-group@4.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/media-core@22.2.1
  - @atlaskit/media-test-helpers@15.2.1
  - @atlaskit/lozenge@6.1.3
  - @atlaskit/field-range@5.0.2
  - @atlaskit/badge@9.0.3
  - @atlaskit/spinner@9.0.4
  - @atlaskit/field-text@7.0.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/dropdown-menu@6.1.4
  - @atlaskit/avatar@14.0.5

## 31.2.0

- [minor] expose smart Filmstrip from media-filmstrip [7fa84a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fa84a2)

## 31.1.1

- [patch] pass mimeType to files in uploads-start event in MediaPicker [3485c00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3485c00)
- [patch] Updated dependencies [3485c00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3485c00)
  - @atlaskit/media-core@22.2.0

## 31.1.0

- [minor] use context.getFile in media-card [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
- [minor] Updated dependencies [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
  - @atlaskit/media-test-helpers@15.2.0
  - @atlaskit/media-core@22.1.0

## 31.0.0

- [major] Implemented smart cards and common views for other cards [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
- [minor] Implemented smart cards and common UI elements [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
- [major] Implement smart card [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
- [major] Smart cards implementation and moved UI elements into media-ui package [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
- [major] Updated dependencies [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
  - @atlaskit/smart-card@7.0.0
  - @atlaskit/media-ui@5.0.0
  - @atlaskit/media-test-helpers@15.1.0
- [minor] Updated dependencies [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
  - @atlaskit/smart-card@7.0.0
  - @atlaskit/media-ui@5.0.0
  - @atlaskit/media-test-helpers@15.1.0
- [major] Updated dependencies [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
  - @atlaskit/smart-card@7.0.0
  - @atlaskit/media-ui@5.0.0
  - @atlaskit/media-test-helpers@15.1.0
- [major] Updated dependencies [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
  - @atlaskit/smart-card@7.0.0
  - @atlaskit/media-ui@5.0.0

## 30.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/smart-card@6.0.1
  - @atlaskit/icon@13.1.1
  - @atlaskit/dropdown-menu@6.1.1
  - @atlaskit/avatar@14.0.1

## 30.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/smart-card@6.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/media-ui@4.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/badge@9.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/smart-card@6.0.0
  - @atlaskit/media-ui@4.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/analytics-next-types@3.0.0
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/badge@9.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar@14.0.0

## 29.1.11

- [patch] Use proper analytics-next types [a6ac341](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6ac341)
- [none] Updated dependencies [a6ac341](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6ac341)
  - @atlaskit/analytics-next-types@2.1.9

## 29.1.10

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/smart-card@5.3.3
  - @atlaskit/dropdown-menu@5.2.3
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/smart-card@5.3.3
  - @atlaskit/button@8.2.5
  - @atlaskit/dropdown-menu@5.2.3

## 29.1.9

- [patch] Render empty component in CardList when there are no items in the collection [9a1b6a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a1b6a2)

## 29.1.8

- [patch] Updated dependencies [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-test-helpers@14.0.6
  - @atlaskit/media-core@21.0.0

## 29.1.7

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/smart-card@5.3.2
  - @atlaskit/dropdown-menu@5.2.2

## 29.1.6

- [patch] Bitbucket images were displaying at 100% of the container, and not respect max-width of the image. ED-4946 [370c812](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/370c812)

## 29.1.5

- [patch] Updated dependencies [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/media-test-helpers@14.0.4
  - @atlaskit/media-core@20.0.0

## 29.1.4

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/smart-card@5.3.1
  - @atlaskit/button@8.2.3

## 29.1.3

- [patch] Updated dependencies [74a0d46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74a0d46)
  - @atlaskit/smart-card@5.3.0
- [patch] Updated dependencies [6c6f078](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c6f078)
  - @atlaskit/smart-card@5.3.0
- [patch] Updated dependencies [5bb26b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bb26b4)
  - @atlaskit/smart-card@5.3.0

## 29.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/media-ui@3.1.2
  - @atlaskit/media-test-helpers@14.0.3
  - @atlaskit/media-core@19.1.3
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/field-text@6.0.4
  - @atlaskit/button@8.1.2
  - @atlaskit/toggle@4.0.3
  - @atlaskit/lozenge@5.0.4
  - @atlaskit/field-range@4.0.3
  - @atlaskit/spinner@7.0.2
  - @atlaskit/field-radio-group@3.0.4
  - @atlaskit/icon@12.1.2
  - @atlaskit/dropdown-menu@5.0.4

## 29.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/smart-card@5.2.1
  - @atlaskit/media-ui@3.1.1
  - @atlaskit/media-test-helpers@14.0.2
  - @atlaskit/media-core@19.1.2
  - @atlaskit/spinner@7.0.1
  - @atlaskit/lozenge@5.0.3
  - @atlaskit/icon@12.1.1
  - @atlaskit/analytics-next@2.1.8
  - @atlaskit/field-radio-group@3.0.3
  - @atlaskit/dropdown-menu@5.0.3
  - @atlaskit/button@8.1.1
  - @atlaskit/badge@8.0.3
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 29.1.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/smart-card@5.2.0
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/dropdown-menu@5.0.2
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/media-ui@3.1.0
  - @atlaskit/toggle@4.0.2
  - @atlaskit/field-radio-group@3.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/media-core@19.1.1
  - @atlaskit/media-test-helpers@14.0.1
  - @atlaskit/lozenge@5.0.2
  - @atlaskit/field-text@6.0.2
  - @atlaskit/field-range@4.0.2
  - @atlaskit/badge@8.0.2
  - @atlaskit/analytics-next@2.1.7
  - @atlaskit/button@8.1.0

## 29.0.3

- [patch] Updated dependencies [2de7ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2de7ce7)
  - @atlaskit/smart-card@5.1.1

## 29.0.2

- [patch] Updated dependencies [823caef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/823caef)
  - @atlaskit/smart-card@5.1.0

## 29.0.1

- [patch] Updated dependencies [732d2f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/732d2f5)
  - @atlaskit/smart-card@5.0.0

## 29.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/smart-card@4.0.0
  - @atlaskit/media-ui@3.0.0
  - @atlaskit/media-test-helpers@14.0.0
  - @atlaskit/media-core@19.0.0
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/toggle@4.0.0
  - @atlaskit/field-radio-group@3.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/analytics-next@2.1.4
  - @atlaskit/button@8.0.0
  - @atlaskit/lozenge@5.0.0
  - @atlaskit/field-range@4.0.0
  - @atlaskit/badge@8.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/dropdown-menu@5.0.0
  - @atlaskit/avatar@11.0.0

## 28.0.6

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/smart-card@3.0.4

## 28.0.5

- [patch] Updated dependencies [35d547f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d547f)
  - @atlaskit/smart-card@3.0.3

## 28.0.4

- [patch][f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
- [none] Updated dependencies [f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
  - @atlaskit/media-test-helpers@13.0.2

## 28.0.3

- [patch] Fix Card's defaultProps TS type [527bc9c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/527bc9c)

## 28.0.2

- [patch] Remove card's "shown" analytics event [7877ce6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7877ce6)

## 28.0.1

- [patch] Updated dependencies [bd26d3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd26d3c)
  - @atlaskit/media-core@18.1.1
  - @atlaskit/media-test-helpers@13.0.1

## 28.0.0

- [major] Updated dependencies [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
  - @atlaskit/media-test-helpers@13.0.0
  - @atlaskit/media-core@18.1.0
- [patch] Updated dependencies [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
  - @atlaskit/media-test-helpers@13.0.0
  - @atlaskit/media-core@18.1.0

## 27.1.4

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/smart-card@3.0.2
  - @atlaskit/media-ui@2.1.1
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/toggle@3.0.2
  - @atlaskit/field-radio-group@2.0.3
  - @atlaskit/field-text@5.0.3
  - @atlaskit/media-test-helpers@12.0.4
  - @atlaskit/media-core@18.0.3
  - @atlaskit/analytics-next@2.1.1
  - @atlaskit/dropdown-menu@4.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/field-range@3.0.2
  - @atlaskit/badge@7.1.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4
  - @atlaskit/lozenge@4.0.1

## 27.1.3

- [patch] Renamed smart card components and exposed inline smart card views [1094bb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1094bb6)
- [patch] Updated dependencies [1094bb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1094bb6)
  - @atlaskit/smart-card@3.0.0

## 27.1.2

- [patch] Move toHumanReadableMediaSize to media-ui [b36c763](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b36c763)
- [patch] Updated dependencies [b36c763](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b36c763)
  - @atlaskit/media-ui@2.1.0

## 27.1.0

- [minor] Added "disableOverlay" prop to Card and CardView public API [533d085](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/533d085)

## 27.0.4

- [patch] hide link items from CardList (Sidebard) [dd2c7e7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd2c7e7)

## 27.0.3

- [patch] Turn side effects to true due to rxjs operators imports [668f01c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/668f01c)
- [patch] Turn side effects to true due to rxjs operators imports [5eddd49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5eddd49)

## 27.0.2

- [patch] remove polished dependency [0e54c69](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e54c69)

## 26.0.1

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 26.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 25.2.0

- [minor] use local preview in MediaCard when available [b33788b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b33788b)

## 25.1.6

- [patch] Fix typo and potential memory leak [6ecc601](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ecc601)

## 25.1.5

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 25.1.3

- [patch] Fix/revert TS TDs in analytics-next [1284d32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1284d32)

## 25.1.2

- [patch] ED-4030 Don't reload Image cards again after upload is done [9aff937](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9aff937)

## 25.1.0

- [minor] Add analytics events for click and show actions of media-card [031d5da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/031d5da)
- [minor] Add analytics events for click and show actions of media-card [b361185](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b361185)

## 25.0.0

- [major] icons are now assignable to card actions, which will cause media cards to render upto 2 icon buttons, or a dropdown menu if more than 2 actions are set [649871c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/649871c)

## 24.1.6

- [patch] added a cursor to application cards when the onClick property is passed [97cb9c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97cb9c2)

## 24.1.5

- [patch] Remove TS types that requires styled-components v3 [836e53b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/836e53b)

## 24.1.3

- [patch] Add key as an optional parameter to applicationCard actions [28be081](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28be081)

## 24.1.2

- [patch] fix issues with ellipsing of new smart-card designs [ec2bed9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec2bed9)

## 24.1.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 24.0.6

- [patch] Introduce media-ui package [39579e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/39579e2)

## 24.0.5

- [patch] fix new smart-card design which is showing the dropdown below consecutive smart-cards [5574b67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5574b67)
- [patch] fix issue with smart-card dropdown being hidden behind successive cards in new designs [ff01687](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff01687)

## 24.0.4

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 24.0.3

- [patch] fixed issue where clicking on smart-card try-again and cancel links would trigger onClick [1e575b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e575b3)

## 24.0.2

- [patch] added missing smart-card action states [3f7536e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f7536e)

## 23.2.2

- [patch] Migrate Navigation from Ak repo to ak mk 2 repo, Fixed flow typing inconsistencies in ak mk 2 [bdeef5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdeef5b)

## 23.2.1

- [patch] added an offset to load lazily loaded cards earlier [d1d891c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1d891c)

## 23.2.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 23.1.1

- [patch] Update dependencies [623f8ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623f8ca)

## 23.1.0

- [minor] Added new AppCardView v1.5 designs behind a feature flag. [92bc6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92bc6c8)

## 23.0.2

- [patch] Make Card to work with pixel units [dedba4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dedba4f)

## 23.0.1

- [patch] Make Card to work properly with pixel units [69c6443](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c6443)
- [patch] Dont use default dimensions for link cards [ae94181](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae94181)

## 23.0.0

- [major] Bump media-core peer dependency to next major versoin (12) [0a84f90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a84f90)

## 22.4.2

- [patch] fix z-index issue for app cards [d2e05ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2e05ae)

## 22.4.1

- [patch] Use default dimensions in CardView when dimensions are not provided [d07f3f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d07f3f8)

## 22.4.0

- [minor] make Card and CardView to work properly when percetanges are passed as dimensions [3178808](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3178808)

## 22.3.0

- [minor] Update signature onClick event on filmstrip (renderer) [30bdfcc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30bdfcc)
- [minor] Update signature onClick event on filmstrip (renderer) [dbced25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dbced25)
- [minor] Update signature onClick event on filmstrip (renderer) [7ee4743](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ee4743)

## 22.2.7

- [patch] fix lazy-loading of cards when scrolling up [868505d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/868505d)

## 22.2.6

- [patch] Show static images for gifs in small cards [e2508f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e2508f9)
- [patch] Show static images for gifs in small cards [e2508f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e2508f9)

## 22.2.5

- [patch] Fixed hover state for link media-cards in renderer [05ae05d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05ae05d)

## 22.2.3

- [patch] Bumping dependency on docs (from a failed build) [6949056](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6949056)

## 22.2.1

- [patch] Migrated to the new repo and updated dependencies [f76434e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f76434e)

## 2.1.1 (2017-09-18)

- bug fix; update media-core and media-test-helpers version ([00108cf](https://bitbucket.org/atlassian/atlaskit/commits/00108cf))

## 2.1.0 (2017-08-11)

- feature; bump :allthethings: ([f4b1375](https://bitbucket.org/atlassian/atlaskit/commits/f4b1375))

## 2.0.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 1.0.0 (2017-06-07)

- feature; fix imgSrc property ([d2274ce](https://bitbucket.org/atlassian/atlaskit/commits/d2274ce))
- feature; mediaImage component skeleton ([5dd2f84](https://bitbucket.org/atlassian/atlaskit/commits/5dd2f84))
