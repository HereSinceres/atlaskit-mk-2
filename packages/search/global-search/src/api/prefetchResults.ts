import { ConfluenceRecentsMap, JiraResultsMap, Result } from '../model/Result';
import configureSearchClients from './configureSearchClients';
import { ConfluenceClient } from './ConfluenceClient';
import { ABTest } from './CrossProductSearchClient';
import { Scope } from './types';

interface CommonPrefetchedResults {
  abTestPromise: Promise<ABTest | undefined>;
  recentPeoplePromise: Promise<Result[]>;
}

export interface ConfluencePrefetchedResults extends CommonPrefetchedResults {
  confluenceRecentItemsPromise: Promise<ConfluenceRecentsMap>;
}

export interface JiraPrefetchedResults extends CommonPrefetchedResults {
  jiraRecentItemsPromise: Promise<JiraResultsMap>;
}

export type GlobalSearchPrefetchedResults =
  | ConfluencePrefetchedResults
  | JiraPrefetchedResults;

const prefetchConfluence = async (
  confluenceClient: ConfluenceClient,
  searchSessionId: string,
): Promise<ConfluenceRecentsMap> => {
  const [objects, spaces] = await Promise.all([
    confluenceClient.getRecentItems(searchSessionId),
    confluenceClient.getRecentSpaces(searchSessionId),
  ]);

  return {
    objects,
    spaces,
  };
};

export const getConfluencePrefetchedData = (
  cloudId: string,
  searchSessionId: string,
  confluenceUrl?: string,
): ConfluencePrefetchedResults => {
  const config = confluenceUrl
    ? {
        confluenceUrl,
      }
    : {};
  const {
    confluenceClient,
    crossProductSearchClient,
    peopleSearchClient,
  } = configureSearchClients(cloudId, config);
  return {
    confluenceRecentItemsPromise: prefetchConfluence(
      confluenceClient,
      searchSessionId,
    ),
    abTestPromise: crossProductSearchClient.getAbTestData(
      Scope.ConfluencePageBlogAttachment,
      {
        sessionId: searchSessionId,
      },
    ),
    recentPeoplePromise: peopleSearchClient.getRecentPeople(),
  };
};
