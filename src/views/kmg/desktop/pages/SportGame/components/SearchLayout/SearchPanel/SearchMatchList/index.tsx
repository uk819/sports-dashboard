import React, {useEffect, useState} from 'react';
import style from './style.scss';
import Empty from '@views/kmg/desktop/components/Empty';
import usePublicState from '@core/hooks/usePublicState';
import useSettings from '@core/hooks/sports/useSettings';
import dayjs from 'dayjs';
import useSearchHistoryHooks from '@core/hooks/useSearchHistoryHooks';
import {getMatchStatusByPeriod} from '@core/utils';
import useZoomMatch from '@core/hooks/sports/useZoomMatch';

export interface SearchData {
  mid: number;
  ht: {
    tid: number;
    tn: string;
    lg: string;
    lv: number;
  },
  at: {
    tid: number;
    tn: string;
    lg: string;
    lv: number;
  },
  ip: number;
  bt: number;
  pd: string;
}

interface IProps {
  searchText: string;
  isSearch: boolean;
  onIsSearch: (st: boolean) => void;
}

export default (props: IProps) => {
  const {searchText, isSearch, onIsSearch} = props;
  const [list, setList] = useState<SearchData[]>([]);
  const {dispatch, ACTIONS} = usePublicState();
  const {sportId} = useSettings();
  const {setHistory} = useSearchHistoryHooks();
  const {openZoom} = useZoomMatch();
  useEffect(() => {
    if (searchText) {
      dispatch(ACTIONS.SPORT.searchMatchByName({
        params: {sportId, keyword: searchText},
        cb: (res: any) => {
          setList(res.data);
          setHistory(sportId, searchText);
          onIsSearch(false);
        }}));
    }
  }, [searchText, sportId]);

  return (
    <div className={style.wrapper}>
      {
        list && [1, 0].map((key) => (
          _.groupBy(list, 'ip')[key] &&
          <React.Fragment key={key}>
            <div className="search-match-type">
              {Number(key) === 0 ? '未开赛' : '滚球中'}
            </div>
            <div className="match-list">
              {
                _.groupBy(list, 'ip')[key].map((match) => (
                  <div className="search-item" key={match.mid} onClick={() => openZoom(match.mid)}>
                    <p>{`${match.ht.tn} v ${match.at.tn}`}</p>
                    <p>
                      {match.ip === 1 && !!match.pd ? getMatchStatusByPeriod(match.pd) : dayjs(match.bt).format('MM月DD日 HH:mm')}
                    </p>
                  </div>
                ))
              }
            </div>
          </React.Fragment>
        ))
      }
      {
        !isSearch && list.length === 0 &&
          <div className='empty-wrapper center'>
            <Empty description="暂无数据" />
          </div>
      }
    </div>
  );
};
