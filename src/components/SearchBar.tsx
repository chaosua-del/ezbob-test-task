import { useEffect, useRef, useState } from 'react';
import { useAutocompleteSearchResults } from '../hooks/use-search-results';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import { useOutsideClick } from '../hooks/use-outside-click';

export const SearchBar = ({ initialValue = '' }: { initialValue?: string }) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const [debouncedSearchValue] = useDebounce(searchValue, 350);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data, isPending } = useAutocompleteSearchResults(
    debouncedSearchValue.trim()
  );

  useOutsideClick(containerRef, () => setShowAutocomplete(false));

  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const searchHistoryFromStorage = localStorage.getItem('searchHistory');
    setHistory(
      searchHistoryFromStorage
        ? Array.from(JSON.parse(searchHistoryFromStorage))
        : []
    );
  }, [inputRef]);

  const handleFocus = () => {
    setShowAutocomplete(true);
  };

  const handleClick = (query: string, id: string) => {
    navigate(`/results?search=${query}`);
    setShowAutocomplete(false);
    setSearchValue(query);
    if (!history.includes(query)) {
      setHistory((prev) => [...prev, id]);
      localStorage.setItem('searchHistory', JSON.stringify([...history, id]));
    }
  };

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/results?search=${searchValue.trim()}`);
      setShowAutocomplete(false);
    }
  };

  const removeItemFromHistory = (id: string) => {
    const newHistory = history.filter((el) => el !== id);

    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  return (
    <div className="search" ref={containerRef}>
      <img className="search-icon" src="/search-icon.svg" alt="search icon" />
      <input
        ref={inputRef}
        className="search-input"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={handleFocus}
        onClick={() => setShowAutocomplete(true)}
        onKeyDown={handleEnterPress}
      />
      {searchValue && (
        <button className="search-clear" onClick={() => setSearchValue('')}>
          x
        </button>
      )}
      {searchValue && showAutocomplete && (
        <div className="search-autocomplete">
          {data?.records.map((result) => {
            const isInSearchHistory = history.includes(result.id);

            return (
              <button
                type="button"
                key={result.id}
                className={`search-item ${
                  isInSearchHistory ? 'search-item--blue' : ''
                }`}
                onClick={() => {
                  handleClick(result.fields.title, result.id);
                }}
              >
                {
                  <img
                    className="search-item-icon"
                    src={isInSearchHistory ? '/recent-icon.svg' : '/search-icon.svg'}
                    alt="search icon"
                  />
                }
                <span>{result.fields.title}</span>
                {isInSearchHistory && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItemFromHistory(result.id);
                    }}
                    className="search-item-remove"
                  >
                    remove
                  </button>
                )}
              </button>
            );
          })}
          {isPending && <div className="search-item">Loading Results...</div>}
          {!isPending && !data?.records.length && (
            <div className="search-item">No Results Found</div>
          )}
        </div>
      )}
    </div>
  );
};
