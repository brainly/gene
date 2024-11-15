import css from './search.module.css';
import cx from 'classnames';
import Link from 'next/link';
import React from 'react';
import { useSearchResults } from './useSearchResults';

function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>();

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface ItemProps {
  title: string;
  route: string;
  content: string;
  type: 'title' | 'content';
  searchValue: string | undefined;
  handleClick: () => void;
}

const Item = ({
  title,
  route,
  content,
  searchValue,
  type,
  handleClick,
}: ItemProps) => {
  const index =
    type === 'title'
      ? title.toLowerCase().indexOf(searchValue.toLowerCase())
      : content.toLowerCase().indexOf(searchValue.toLowerCase());

  return (
    <li
      className="nx-mx-2.5 nx-break-words nx-rounded-md contrast-more:nx-border nx-text-gray-800 contrast-more:nx-border-transparent dark:nx-text-gray-300"
      onClick={handleClick}
    >
      {type === 'title' && (
        <Link href={route} passHref>
          <a className="nx-block nx-scroll-m-12 nx-px-2.5 nx-py-2">
            <span>
              {title.substring(0, index)}
              <span>{title.substring(index, index + searchValue.length)}</span>
              {title.substring(index + searchValue.length)}
            </span>
          </a>
        </Link>
      )}

      {type === 'content' && (
        <Link href={route} passHref>
          <a className="nx-block nx-scroll-m-12 nx-px-2.5 nx-py-2">
            <span>
              <p>{title}</p>
              <small>
                {content.substring(0, index)}
                <span>
                  {content.substring(index, index + searchValue.length)}
                </span>
                {content.substring(index + searchValue.length)}
              </small>
            </span>
          </a>
        </Link>
      )}
    </li>
  );
};

const Search = () => {
  const [search, setSearch] = React.useState('');

  const debouncedSearch = useDebounceValue(search, 300);

  const { searchDocs } = useSearchResults();

  const results = React.useMemo(
    () => searchDocs(debouncedSearch),
    [searchDocs, debouncedSearch]
  );

  const input = React.useRef<HTMLInputElement | null>(null);

  const [show, setShow] = React.useState(false);

  const renderList = show && results.length > 0 && debouncedSearch;

  function handleItemClick() {
    setSearch('');
    setShow(false);
  }

  return (
    <div className='className="relative nextra-search md:w-64"'>
      {renderList && (
        <div
          className="nx-fixed nx-inset-0 nx-z-10"
          onClick={() => setShow(false)}
        />
      )}
      <div className="nx-relative nx-flex nx-items-center">
        <input
          onChange={(e) => {
            setSearch(e.target.value);
            setShow(true);
          }}
          value={search}
          placeholder="Search"
          onFocus={() => setShow(true)}
          ref={input}
          spellCheck={false}
          className="nx-block nx-w-full nx-appearance-none nx-rounded-lg nx-px-3 nx-py-2 nx-transition-colors nx-text-base nx-leading-tight md:nx-text-sm nx-bg-black/[.05] dark:nx-bg-gray-50/10 focus:nx-bg-white dark:focus:nx-bg-dark placeholder:nx-text-gray-500 dark:placeholder:nx-text-gray-400 contrast-more:nx-border contrast-more:nx-border-current"
        />
        {renderList && (
          <ul
            className={cx(
              css.results,
              'nextra-scrollbar nx-border nx-border-gray-200 nx-bg-white nx-text-gray-100 dark:nx-border-neutral-800 dark:nx-bg-neutral-900 nx-absolute nx-top-full nx-z-20 nx-mt-2 nx-overflow-auto nx-overscroll-contain nx-rounded-xl nx-py-2.5 nx-shadow-xl nx-max-h-[min(calc(50vh-11rem-env(safe-area-inset-bottom)),400px)] md:nx-max-h-[min(calc(100vh-5rem-env(safe-area-inset-bottom)),400px)] nx-inset-x-0 ltr:md:nx-left-auto rtl:md:nx-right-auto contrast-more:nx-border contrast-more:nx-border-gray-900 contrast-more:dark:nx-border-gray-50 nx-w-screen nx-min-h-[100px] nx-max-w-[min(calc(100vw-2rem),calc(100%+20rem))]'
            )}
          >
            {results.map((res, i) => {
              return (
                <Item
                  key={`search-item-${i}`}
                  {...res}
                  searchValue={debouncedSearch}
                  handleClick={handleItemClick}
                />
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
