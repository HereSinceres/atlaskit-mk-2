import CachingConfluenceClient from './CachingConfluenceClient';
import { CachingPeopleSearchClient } from './CachingPeopleSearchClient';
import { ConfluenceClient } from './ConfluenceClient';
import CachingCrossProductSearchClientImpl, {
  CrossProductSearchClient,
} from './CrossProductSearchClient';
import JiraClientImpl, { JiraClient } from './JiraClient';
import { PeopleSearchClient } from './PeopleSearchClient';
import {
  ConfluencePrefetchedResults,
  GlobalSearchPrefetchedResults,
} from './prefetchResults';
import {
  AutocompleteClientImpl,
  AutocompleteClient,
} from './AutocompleteClient';
import {
  NavAutocompleteClientImpl,
  NavAutocompleteClient,
} from './NavAutocompleteClient';
import memoizeOne from 'memoize-one';
import deepEqual from 'deep-equal';

export interface SearchClients {
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  confluenceClient: ConfluenceClient;
  jiraClient: JiraClient;
  autocompleteClient: AutocompleteClient;
  navAutocompleteClient: NavAutocompleteClient;
}

export interface Config {
  activityServiceUrl: string;
  searchAggregatorServiceUrl: string;
  directoryServiceUrl: string;
  confluenceUrl: string;
  jiraUrl: string;
  autocompleteUrl: string;
}

const defaultConfig: Config = {
  activityServiceUrl: '/gateway/api/activity',
  searchAggregatorServiceUrl: '/gateway/api/xpsearch-aggregator',
  directoryServiceUrl: '/gateway/api/directory',
  confluenceUrl: '/wiki',
  jiraUrl: '',
  autocompleteUrl: '/gateway/api/ccsearch-autocomplete',
};

function configureSearchClients(
  cloudId: string,
  partialConfig: Partial<Config>,
  prefetchedResults?: GlobalSearchPrefetchedResults,
): SearchClients {
  const config = {
    ...defaultConfig,
    ...partialConfig,
  };

  const confluencePrefetchedResults =
    prefetchedResults &&
    (<ConfluencePrefetchedResults>prefetchedResults)
      .confluenceRecentItemsPromise
      ? (<ConfluencePrefetchedResults>prefetchedResults)
          .confluenceRecentItemsPromise
      : undefined;

  return {
    crossProductSearchClient: new CachingCrossProductSearchClientImpl(
      config.searchAggregatorServiceUrl,
      cloudId,
      prefetchedResults,
    ),
    peopleSearchClient: new CachingPeopleSearchClient(
      config.directoryServiceUrl,
      cloudId,
    ),
    confluenceClient: new CachingConfluenceClient(
      config.confluenceUrl,
      confluencePrefetchedResults,
    ),
    autocompleteClient: new AutocompleteClientImpl(
      config.autocompleteUrl,
      cloudId,
    ),
    navAutocompleteClient: new NavAutocompleteClientImpl(
      config.searchAggregatorServiceUrl,
      cloudId,
    ),
    jiraClient: new JiraClientImpl(config.jiraUrl, cloudId),
  };
}

export default memoizeOne(configureSearchClients, deepEqual);
