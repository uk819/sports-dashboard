import storage from '@core/helpers/storage';
import {useState} from 'react';

export default () => {
  const [searchHistory, setSearchHistory] = useState<Record<number, string[]>>(storage.get('SEARCH_HISTORY') || {});
  const setHistory = (sportId: number, word: string, clear?: boolean) => {
    const obj = {...searchHistory};
    if (clear === false) {
      obj[sportId] = (obj[sportId] || []).filter((item) => item.trim() !== word.trim()).slice(0, 10);
    } else {
      obj[sportId] = [word, ...(obj[sportId] || []).filter((item) => item.trim() !== word.trim())].slice(0, 10);
    }
    setSearchHistory(obj);
    storage.set('SEARCH_HISTORY', obj);
  };
  const clearSearchHistory = () => {
    setSearchHistory({});
    storage.set('SEARCH_HISTORY', {});
  };
  return {
    searchHistory,
    setHistory,
    clearSearchHistory,
  };
};
