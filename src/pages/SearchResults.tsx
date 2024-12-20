import { useSearchParams } from 'react-router-dom';
import { useSearchResults } from '../hooks/use-search-results';

export const SearchResults = () => {
  const search = useSearchParams();

  const searchQueryFromUrl = search[0].get('search') || '';

  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useSearchResults(searchQueryFromUrl);

  const performance = data?.pages[0].performance || 0;

  return (
    <div className="results">
      {performance ? (
        <div className="results-stats">
          Showing {data?.pages[0].records.length} records. ({performance.toFixed(1)}{' '}
          ms)
        </div>
      ) : null}
      <div className="results-items">
        {data?.pages.map((page) =>
          page.records.map((el) => (
            <div className="results-item" key={el.id}>
              <a className="results-item-link" href={el.fields.link}>
                {el.fields.link}
              </a>
              <a href={el.fields.link} className="results-item-title">
                {el.fields.title}
              </a>
              <p className="results-item-text">{el.fields.description}</p>
            </div>
          ))
        )}
      </div>
      {isPending ||
        (isFetchingNextPage && (
          <div className="search-item">Loading Results...</div>
        ))}
      {!isPending && !data?.pages[0].records.length && <h2>No Results Found</h2>}
      {hasNextPage && !isFetchingNextPage && !isPending && (
        <button className="results-load" onClick={() => fetchNextPage()}>
          Load more data
        </button>
      )}
    </div>
  );
};
