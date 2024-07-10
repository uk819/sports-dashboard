import SearchMatchHistory from './SearchMatchHistory';
import SearchMatchList from './SearchMatchList';
import style from './style.scss';

interface IProps {
  searchText?: string;
  onSearchText: (val: string) => void;
  isSearch: boolean;
  onIsSearch: (st: boolean) => void;
}

export default function(props: IProps) {
  const {searchText, onSearchText, isSearch, onIsSearch} = props;

  const handleSearchText = (text: string) => {
    onSearchText(text);
    onIsSearch(true);
  };
  return (
    <div className={style.wrapper}>
      {
        !searchText?.trim() ?
        <SearchMatchHistory onSearchText={handleSearchText}/> :
        <SearchMatchList searchText={searchText} isSearch={isSearch} onIsSearch={onIsSearch}/>
      }
    </div>
  );
}
