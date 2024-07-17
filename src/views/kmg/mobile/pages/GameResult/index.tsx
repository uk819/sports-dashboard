import {useSelector} from 'react-redux';
import React, {useRef} from 'react';
import dayjs from 'dayjs';

import pageWrapper from '@this/components/PageWrapper';
import FilterPanel from './components/FilterPanel';
import useGamesResultInit from '@core/hooks/sports/useGamesResultInit';
import MatchTypeSelector, {DatePicker} from './components/MatchTypeSelector';
import SportTypeSelector from './components/SportTypeSelector';
import LeagueList from './components/LeagueList';
import ChampionList from './components/ChampionList';
import TStore from '@core/reducers/_reduxStore.d';
import {MatchListSkeleton} from '@this/shadow/Skeleton';
import usePublicState from '@core/hooks/usePublicState';
import useSettings from '@core/hooks/sports/useSettings';
import Empty from '@this/shadow/Empty';
import MatchDetail from './components/MatchDetail';
import 'swiper/css';
import style from './style.module.scss';
import {useGameResultListData} from '@core/hooks/sports/useRenderData';
import DpIcon from '../../components/Icon';

const GameResult = React.memo(() => {
  const {switchGameResultPageInfo, getChampionResult} = useSettings();
  const displayType = useSelector((state: TStore) => state.sport.display.displayType);
  const [time, setTime] = React.useState(dayjs().format('YYYY/MM/DD'));
  const [matchType, setMatchType] = React.useState<number>(0);
  const [sportId, setSportId] = React.useState(1);
  const {dispatch, ACTIONS} = usePublicState();
  const {showFilter, setShowFilter, gamesResult, gameResultCounts} = useGameResultListData();
  const wrapperRef = useRef(null);

  React.useEffect(() => {
    setSportId(matchType !== 1 ? 1 : 278);
  }, [matchType]);

  const getGameResultDataCallback = (res: any) => {
    if (!res.data?.list?.length) {
      dispatch(ACTIONS.SPORT.updateDisplayType('empty'));
    } else {
      dispatch(ACTIONS.SPORT.updateDisplayType('list'));
    }
  };
  const gameResultPageInfo = {
    beginTime: time,
    endTime: time,
    pageNum: 1,
    pageSize: 1000,
  };
  const getGameResultData = () => {
    switchGameResultPageInfo(gameResultPageInfo, getGameResultDataCallback);
  };

  const {gameResultOpts} = useGamesResultInit(gameResultPageInfo, 'saiguo');
  const [opts, setOpts] = React.useState(gameResultOpts);
  React.useEffect(() => {
    setTime(dayjs().format('YYYY/MM/DD'));
    if (!matchType) {
      setOpts(gameResultOpts.filter((opt) => opt.value < 100));
    } else {
      setOpts(gameResultOpts.filter((opt) => opt.value > 100 && opt.value !== 999));
    }
  }, [matchType, gameResultOpts]);

  React.useEffect(() => {
    if (matchType !== 2) {
      getGameResultData();
    } else {
      getChampionResult(gameResultPageInfo);
    }
  }, [time, matchType, sportId]);

  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <MatchTypeSelector matchType={matchType} setMatchType={setMatchType} />
        <DatePicker handelGetTime={setTime} sportId={sportId} currentTime={time} />
        {matchType !== 2 && (
          <SportTypeSelector opts={opts} sportId={sportId} counts={gameResultCounts} handleSportId={setSportId} />
        )}
      </div>
      {displayType === 'list' && (
        <div id='BScroll_wrapper' className={style.BScroll_wrapper} ref={wrapperRef}>
          {matchType !== 2 ? (
            <LeagueList
              sportId={sportId}
              setShowFilter={setShowFilter}
              gamesResult={_.filter(gamesResult, (game) => game.sid === sportId)}
            />
          ) : (
            <ChampionList />
          )}
        </div>
      )}
      {displayType === 'skeleton' && (
        <div className={style.skeleton_wrapper}>
          <MatchListSkeleton />
        </div>
      )}
      {displayType === 'empty' && (
        <div className={style.empty_wrapper}>
          <Empty />
        </div>
      )}
      <FilterPanel display={showFilter} close={() => setShowFilter(false)} />
      <MatchDetail sportId={sportId} />
      {displayType === 'list' && (
        <DpIcon
          type='mobileToTop'
          className={style.to_top}
          onClick={() => wrapperRef.current.scrollTo({behavior: 'smooth', top: 0})}
        />
      )}
    </div>
  );
});

export default pageWrapper(GameResult, {title: 'DP体育'});
