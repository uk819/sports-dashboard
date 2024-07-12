import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import useSettings from '@core/hooks/sports/useSettings';
import {Pagination, PaginationProps} from 'antd';
import {useEffect, useState} from 'react';
import styles from './style.scss';

export default React.memo(() => {
  const {switchGameResultPageInfo, getChampionResult} = useSettings();
  const {gameResultPageInfo: pageInfo, gameResultPageTotal} = useSelector((state: TStore) => state.sport.userSettings);
  const {sportId} = useSelector((state: TStore) =>state.sport.userSettings.gameResultPageInfo);
  const [total, setTotal] = useState<number>(1);

  useEffect(() => {
    setTotal(gameResultPageTotal);
  }, [gameResultPageTotal]);

  const zhOpt = {
    jump_to: '跳转至',
    page: '页',
    items_per_page: '条/页',
  };
  const onChange: PaginationProps['onChange'] = (pageNum, pageSize) => {
    if (sportId !== 999) {
      switchGameResultPageInfo({...pageInfo, pageNum, pageSize});
    } else {
      const {sportId: _, ...pageInfoWithoutSportId} = pageInfo;
      getChampionResult({...pageInfoWithoutSportId, pageNum, pageSize});
    }
  };

  return (
    <Pagination
      defaultPageSize={10}
      className={styles.wrapper}
      locale={zhOpt}
      showQuickJumper
      defaultCurrent={1}
      pageSize={pageInfo.pageSize}
      current={pageInfo.pageNum}
      total={total}
      onChange={onChange}
    />
  );
});
