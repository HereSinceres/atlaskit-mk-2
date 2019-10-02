import React, { createContext, ComponentType, ReactNode } from 'react';

export type ThemeProp<ThemeTokens, ThemeProps> = (
  themeFn: (themeProps: ThemeProps) => ThemeTokens,
  themeProps: ThemeProps,
) => ThemeTokens;

export function createTheme<ThemeTokens, ThemeProps>(
  defaultThemeFn: (themeProps: ThemeProps) => ThemeTokens,
): {
  Consumer: ComponentType<
    ThemeProps & {
      children: (themeTokens: ThemeTokens) => ReactNode;
    }
  >;
  Provider: ComponentType<{
    children?: ReactNode;
    value?: ThemeProp<ThemeTokens, ThemeProps>;
  }>;
} {
  const emptyThemeFn = (
    theme: (themeProps: ThemeProps) => ThemeTokens,
    props: ThemeProps,
  ) => theme(props);
  const ThemeContext = createContext(defaultThemeFn);

  function Consumer(
    props: ThemeProps & { children: (tokens: ThemeTokens) => ReactNode },
  ) {
    const { children, ...themeProps } = props;
    return (
      <ThemeContext.Consumer>
        {theme => {
          const themeFn = theme || emptyThemeFn;
          // @ts-ignore
          // See issue for more info: https://github.com/Microsoft/TypeScript/issues/10727
          // Argument of type 'Pick<ThemeProps & { children: (tokens: ThemeTokens) => ReactNode; }, Exclude<keyof ThemeProps, "children">>' is not assignable to parameter of type 'ThemeProps'.ts(2345)
          return props.children(themeFn(themeProps)); // Updating TS will cause error to appear here
        }}
      </ThemeContext.Consumer>
    );
  }

  function Provider(props: {
    children?: ReactNode;
    value?: ThemeProp<ThemeTokens, ThemeProps>;
  }) {
    return (
      <ThemeContext.Consumer>
        {themeFn => {
          const valueFn = props.value || emptyThemeFn;
          const mixedFn = (themeProps: ThemeProps) =>
            valueFn(themeFn, themeProps);
          return (
            <ThemeContext.Provider value={mixedFn}>
              {props.children}
            </ThemeContext.Provider>
          );
        }}
      </ThemeContext.Consumer>
    );
  }

  return { Consumer, Provider };
}
