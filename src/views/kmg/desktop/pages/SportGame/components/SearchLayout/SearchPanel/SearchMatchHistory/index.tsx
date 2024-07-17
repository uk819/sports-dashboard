import useSettings from '@core/hooks/sports/useSettings';
import useSearchHistoryHooks from '@core/hooks/useSearchHistoryHooks';
import {DpIcon} from '@views/kmg/desktop/components';

interface IProps {
  onSearchText: (value: string) => void;
}

export default ({onSearchText}: IProps) => {
  const {sportId} = useSettings();
  const {searchHistory, setHistory, clearSearchHistory} = useSearchHistoryHooks();
  const onClear = (e: React.MouseEvent<Element, MouseEvent>, word: string) => {
    e.stopPropagation();
    setHistory(sportId, word, false);
  };
  return searchHistory[sportId] && (
    <>
      <div className='search-match-type flex items-center justify-between'>
        <span>搜索历史</span>
        <span className='clear' onClick={clearSearchHistory}>清除搜索历史</span>
      </div>
      {
        searchHistory[sportId]?.map((item) => (
          <div className='search-item flex items-center justify-between' onClick={() => onSearchText(item)} key={item}>
            {item}
            <DpIcon type='del' onClick={(e) => onClear(e, item)} />
          </div>
        ))
      }
    </>
  );
};
