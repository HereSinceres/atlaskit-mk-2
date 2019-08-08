import * as React from 'react';
import { Messages } from 'react-intl';
import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next';
import isEqual from 'lodash.isequal';

import {
  SwitcherWrapper,
  SwitcherItem,
  SwitcherItemWithDropdown,
  Section,
  ManageButton,
  Skeleton,
} from '../primitives';
import { SwitcherItemType, RecentItemType } from '../utils/links';

import {
  analyticsAttributes,
  NavigationAnalyticsContext,
  SWITCHER_SUBJECT,
  RenderTracker,
  ViewedTracker,
} from '../utils/analytics';
import now from '../utils/performance-now';
import FormattedMessage from '../primitives/formatted-message';
import TryLozenge from '../primitives/try-lozenge';
import { TriggerXFlowCallback, DiscoverMoreCallback } from '../types';
import { urlToHostname } from '../utils/url-to-hostname';

const noop = () => void 0;

type SwitcherProps = {
  messages: Messages;
  triggerXFlow: TriggerXFlowCallback;
  /**
   * Whether all the contents have been loaded
   */
  hasLoaded: boolean;
  /**
   * Whether contents considered critical path have been loaded
   */
  hasLoadedCritical: boolean;
  onDiscoverMoreClicked: DiscoverMoreCallback;
  licensedProductLinks: SwitcherItemType[];
  suggestedProductLinks: SwitcherItemType[];
  fixedLinks: SwitcherItemType[];
  adminLinks: SwitcherItemType[];
  recentLinks: RecentItemType[];
  customLinks: SwitcherItemType[];
  experimental_productTopItemMostFrequent: boolean | null;
  manageLink?: string;
};

const getAnalyticsContext = (itemsCount: number) => ({
  ...analyticsAttributes({
    itemsCount,
  }),
});

const getItemAnalyticsContext = (
  index: number,
  id: string | null,
  type: string,
  href: string,
  productType?: string,
) => ({
  ...analyticsAttributes({
    groupItemIndex: index,
    itemId: id,
    itemType: type,
    domain: urlToHostname(href),
    productType,
  }),
});

export default class Switcher extends React.Component<SwitcherProps> {
  mountedAt?: number;

  componentDidMount() {
    this.mountedAt = now();
  }

  shouldComponentUpdate(nextProps: SwitcherProps) {
    return !(isEqual(this.props, nextProps) as boolean);
  }

  timeSinceMounted(): number {
    return this.mountedAt ? Math.round(now() - this.mountedAt) : 0;
  }

  triggerXFlow = (key: string) => (
    event: any,
    analyticsEvent: UIAnalyticsEventInterface,
  ) => {
    const { triggerXFlow } = this.props;
    triggerXFlow(key, 'atlassian-switcher', event, analyticsEvent);
  };

  /** https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/6522/issue-prst-13-adding-discover-more-button/
   * Currently Atlaskit's Item prioritises the usage of href over onClick in the case the href is a valid value.
   * Two cases now happen in this render:
   *
   *  * The People link is rendered with href="/people” and onClick=noop. Even though the latter won't be called
   *  when a user clicks on the item when this component is rendered via enzyme for jest tests it will actually
   *  call the callback... In order for that test to stop breaking we add noop callback in the case where we're
   *  rendering a fixed product link that's not the discover-more item.
   *
   *  * The Discover more link is rendered with href=”” and onClick={actualImplementation}. Because the value of
   *  href is not valid for this case the item will instead call the onClick callback provided.
   *  */

  onDiscoverMoreClicked = (
    event: any,
    analyticsEvent: UIAnalyticsEventInterface,
  ) => {
    const { onDiscoverMoreClicked } = this.props;
    onDiscoverMoreClicked(event, analyticsEvent);
  };

  render() {
    const {
      messages,
      licensedProductLinks,
      suggestedProductLinks,
      fixedLinks,
      adminLinks,
      recentLinks,
      customLinks,
      manageLink,
      hasLoaded,
      hasLoadedCritical,
      experimental_productTopItemMostFrequent,
    } = this.props;

    /**
     * It is essential that switchToLinks reflects the order corresponding nav items
     * are rendered below in the 'Switch to' section.
     */
    const switchToLinks = [
      ...licensedProductLinks,
      ...suggestedProductLinks,
      ...fixedLinks,
      ...adminLinks,
    ];

    const itemsCount =
      switchToLinks.length + recentLinks.length + customLinks.length;

    const firstContentArrived = Boolean(licensedProductLinks.length);

    const allSites =
      licensedProductLinks &&
      licensedProductLinks.map(item => {
        const connectedSites = item.childItems
          ? item.childItems.map(childItem => childItem.label)
          : [];

        return [item.description, ...connectedSites];
      });
    const hasMultipleSites = allSites && [...new Set(allSites)].length > 1;

    return (
      <NavigationAnalyticsContext data={getAnalyticsContext(itemsCount)}>
        <SwitcherWrapper>
          {hasLoaded && (
            <ViewedTracker
              subject={SWITCHER_SUBJECT}
              data={{
                licensedProducts: licensedProductLinks.map(item => item.key),
                suggestedProducts: suggestedProductLinks.map(item => item.key),
                adminLinks: adminLinks.map(item => item.key),
                fixedLinks: fixedLinks.map(item => item.key),
                experimental_productTopItemMostFrequent: hasMultipleSites
                  ? Boolean(experimental_productTopItemMostFrequent)
                  : null,
              }}
            />
          )}
          {firstContentArrived && (
            <RenderTracker
              subject={SWITCHER_SUBJECT}
              data={{ duration: this.timeSinceMounted() }}
            />
          )}
          <Section
            sectionId="switchTo"
            title={<FormattedMessage {...messages.switchTo} />}
          >
            {licensedProductLinks.map(item => (
              <NavigationAnalyticsContext
                key={item.key}
                data={getItemAnalyticsContext(
                  switchToLinks.indexOf(item),
                  item.key,
                  'product',
                  item.href,
                  item.productType,
                )}
              >
                <SwitcherItemWithDropdown
                  icon={<item.Icon theme="product" />}
                  childIcon={<item.Icon theme="subtle" />}
                  description={item.description}
                  href={item.href}
                  childItems={item.childItems}
                  tooltipContent={
                    <FormattedMessage {...messages.showMoreSites} />
                  }
                >
                  {item.label}
                </SwitcherItemWithDropdown>
              </NavigationAnalyticsContext>
            ))}
            {suggestedProductLinks.map(item => (
              <NavigationAnalyticsContext
                key={item.key}
                data={getItemAnalyticsContext(
                  switchToLinks.indexOf(item),
                  item.key,
                  'try',
                  item.href,
                )}
              >
                <SwitcherItem
                  icon={<item.Icon theme="product" />}
                  onClick={this.triggerXFlow(item.key)}
                >
                  {item.label}
                  <TryLozenge>
                    <FormattedMessage {...messages.try} />
                  </TryLozenge>
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
            {fixedLinks.map(item => (
              <NavigationAnalyticsContext
                key={item.key}
                data={getItemAnalyticsContext(
                  switchToLinks.indexOf(item),
                  item.key,
                  'product',
                  item.href,
                )}
              >
                <SwitcherItem
                  icon={<item.Icon theme="product" />}
                  href={item.href}
                  onClick={
                    item.key === 'discover-more'
                      ? this.onDiscoverMoreClicked
                      : noop
                  }
                >
                  {item.label}
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
            {adminLinks.map(item => (
              <NavigationAnalyticsContext
                key={item.key}
                data={getItemAnalyticsContext(
                  switchToLinks.indexOf(item),
                  item.key,
                  'admin',
                  item.href,
                )}
              >
                <SwitcherItem
                  icon={<item.Icon theme="admin" />}
                  href={item.href}
                >
                  {item.label}
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
          </Section>
          <Section
            sectionId="recent"
            title={<FormattedMessage {...messages.recent} />}
          >
            {recentLinks.map(
              ({ key, label, href, type, description, Icon }, idx) => (
                <NavigationAnalyticsContext
                  key={key}
                  data={getItemAnalyticsContext(idx, type, 'recent', href)}
                >
                  <SwitcherItem
                    icon={<Icon theme="recent" />}
                    description={description}
                    href={href}
                  >
                    {label}
                  </SwitcherItem>
                </NavigationAnalyticsContext>
              ),
            )}
          </Section>
          <Section
            sectionId="customLinks"
            title={<FormattedMessage {...messages.more} />}
          >
            {customLinks.map(({ label, href, Icon }, idx) => (
              // todo: id in SwitcherItem should be consumed from custom link resolver
              <NavigationAnalyticsContext
                key={idx + '.' + label}
                data={getItemAnalyticsContext(idx, null, 'customLink', href)}
              >
                <SwitcherItem icon={<Icon theme="custom" />} href={href}>
                  {label}
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
          </Section>
          {!hasLoadedCritical && <Skeleton />}
          {manageLink && <ManageButton href={manageLink} />}
        </SwitcherWrapper>
      </NavigationAnalyticsContext>
    );
  }
}
