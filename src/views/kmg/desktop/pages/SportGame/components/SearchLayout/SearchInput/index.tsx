import {Input} from 'antd';
import style from './style.scss';
import {SearchOutlined} from '@ant-design/icons';
import {ChangeEvent} from 'react';
import {DpButton, DpIcon} from '@views/kmg/desktop/components';

interface Props {
  onSearch: (val?: string) => void;
  onOpenSearch: (status: boolean) => void;
  searchText?: string;
  isSearch: boolean;
  onIsSearch: (st: boolean) => void;
}

export default function(props: Props) {
  const {onSearch, searchText, onOpenSearch, isSearch, onIsSearch} = props;

  const [search, setSearch] = React.useState(searchText);

  React.useEffect(() => {
    setSearch(searchText);
  }, [searchText]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleSearch = () => {
      onIsSearch(false);
      onSearch(search);
    };

    const delayedSearch = () => {
      if (searchText !== search) {
        clearTimeout(timer);
        timer = setTimeout(handleSearch, 1500);
      }
    };
    delayedSearch();

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value || '');
  };

  const handleClose = () => {
    onSearch('');
    onOpenSearch(false);
  };

  return (
    <div className={style.wrapper}>
      <Input
        placeholder="请输入球队名称"
        prefix={isSearch ? <DpIcon
          width={20}
          height={20}
          className={`refresh rotate-infinite`}
          type='reload'
        />: <SearchOutlined />}
        suffix={
          <DpButton
            className={`mr-10`}
            text='关闭'
            onClick={handleClose}
          />
        }
        onChange={handleChange}
        value={search}
      />
    </div>
  );
}
