import instance from '../lib/instance';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export interface SearchResponse {
  records: SearchResult[];
  offset: string;
}

export interface SearchResult {
  id: string;
  fields: {
    title: string;
    description: string;
    link: string;
  };
  createdTime: string;
}

const getSearchResults = async (searchQuery: string, offset?: string | null) => {
  const start = performance.now();
  const res = await instance.get<SearchResponse>('main', {
    params: {
      view: 'Grid view',
      offset,
      filterByFormula: `Search("${searchQuery.toLowerCase()}", Lower({title}))`,
    },
  });

  return { ...res.data, performance: performance.now() - start };
};

const getAutocompleteSearchResults = async (searchQuery: string) => {
  const res = await instance.get<SearchResponse>('main', {
    params: {
      view: 'Grid view',
      filterByFormula: `Search("${searchQuery.toLowerCase()}", Lower({title}))`,
      maxRecords: 10,
    },
  });

  return res.data;
};

export const useSearchResults = (searchQuery: string) => {
  return useInfiniteQuery({
    queryKey: ['searchResults', searchQuery],
    queryFn: (params) => getSearchResults(searchQuery, params.pageParam),
    staleTime: 1 * 60 * 1000,
    getPreviousPageParam: (firstPage) => firstPage.offset,
    getNextPageParam: (lastPage) => lastPage.offset,
    initialPageParam: '',
  });
};

export const useAutocompleteSearchResults = (searchQuery: string) => {
  return useQuery({
    queryKey: ['autocompleteSearchResults', searchQuery],
    queryFn: () => getAutocompleteSearchResults(searchQuery),
    staleTime: 1 * 60 * 1000,
  });
};
