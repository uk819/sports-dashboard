import {ReactNode, useEffect} from 'react';
import SearchInput from './SearchInput';
import style from './style.scss';
import SearchPanel from './SearchPanel';
import useSettings from '@core/hooks/sports/useSettings';
interface Props {
    openSearch: boolean;
    onOpenSearch: (status: boolean) => void;
    children: ReactNode[];
}
export default (props: Props) => {
  const {children, openSearch, onOpenSearch} = props;
  const [searchText, setSearchText] = React.useState<string>();
  const [isSearch, setIsSearch] = React.useState<boolean>(false);
  const {sportId} = useSettings();

  useEffect(() => {
    setSearchText('');
  }, [sportId]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    text && setIsSearch(true);
  };
  return (
    <div className={style.wrapper}>
      {openSearch && <SearchInput onSearch={handleSearch} onOpenSearch={onOpenSearch} searchText={searchText} isSearch={isSearch} onIsSearch={setIsSearch} />}
      {openSearch ? <SearchPanel searchText={searchText} onSearchText={setSearchText} isSearch={isSearch} onIsSearch={setIsSearch} /> : children }
    </div>
  );
};
