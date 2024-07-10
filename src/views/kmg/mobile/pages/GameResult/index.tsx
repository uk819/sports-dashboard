/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:38:07
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/index.tsx
 * @Description:
 */
import pageWrapper from '@this/components/PageWrapper';
import MatchTypeSelector, {DatePicker} from './components/MatchTypeSelector';
import SportTypeSelector from './components/SportTypeSelector';
import LeagueList from './components/LeagueList';
import TStore from '@core/reducers/_reduxStore.d';
import {useSelector} from 'react-redux';
import 'swiper/css';
import css from './style.scss';
import React, {useState, useRef} from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import {MatchListSkeleton} from '@this/shadow/Skeleton';
import usePublicState from '@core/hooks/usePublicState';
import {useUpdateEffect} from 'react-use';
import useSettings from '@core/hooks/sports/useSettings';
import {isESports} from '@core/utils';
import {EESportType} from '@core/constants/enum/sport';

export const SportGame = React.memo(() => {
  const {switchGameResultPageInfo} = useSettings();
  const displayType = useSelector((state: TStore) => state.sport.display.displayType);
  const [time, setTime]=useState(dayjs().format('YYYY/MM/DD'));
  const [sportId, setSportId]=useState(1);
  const refSportId = useRef(1);
  const {dispatch, ACTIONS} = usePublicState();

  const getGameResultDataCallback = (res:any)=>{
    if (!res.data.list.length) {
      dispatch(ACTIONS.SPORT.updateDisplayType('empty'));
    } else {
      dispatch(ACTIONS.SPORT.updateDisplayType('list'));
    }
  };
  const getGameResultData = ()=> {
    const gameResultPageInfo = {
      sportId: refSportId.current,
      beginTime: time,
      endTime: time,
      pageNum: 1,
      pageSize: 1000,
    };
    switchGameResultPageInfo(gameResultPageInfo, getGameResultDataCallback);
  };

  useUpdateEffect(() => {
    refSportId.current = sportId;
    getGameResultData();
  }, [time, sportId]);
  React.useEffect(() => {
    if (isESports()) {
      setSportId(EESportType.LOL);
    }
  }, []);

  return (
    <div className={css.wrapper}>
      <div className={classNames('header')}>
        <MatchTypeSelector sportId={sportId}/>
        <DatePicker handelGetTime={setTime} sportId={sportId}/>
        <SportTypeSelector handelGetTime={setTime} handleSportId={setSportId} />
      </div>
      {
        displayType === 'list'&&<div className='BScroll-wrapper'>
          <LeagueList sportId={sportId}/>
        </div>
      }
      {
        displayType === 'skeleton'&&<div className='pt-20'>
          <MatchListSkeleton />
        </div>
      }
    </div>
  );
});

export default pageWrapper(SportGame, {title: 'DP体育'});
