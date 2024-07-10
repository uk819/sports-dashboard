/*
 * @Author: Weima.KMG
 * @Date: 2024-1-28
 * @LastEditors: Weima.KMG
 * @FilePath: /KMG/src/core/hooks/sports/useGamesResultInit.ts
 * @Description
 */
import {useMount, useUnmount} from 'react-use';
import usePublicState from '../usePublicState';
import {useSelector} from 'react-redux';
import TStore, {TGameResultPageInfo} from '@core/reducers/_reduxStore';
import dayjs from 'dayjs';
import {dateFormat} from '@views/kmg/desktop/components/DateRangePicker';
import {useEffect, useState} from 'react';
// import {sportsCategory} from '@core/constants/enum/sport/sportsCategory';
import {ESportsCategory} from '@core/constants/enum/sport/sportsCategory';
import {ALL_SPORTS_MAP, ESportType, ALL_ESPORTS, ELoadingKeys, EESportType} from '@core/constants/enum/sport';
import {isESports} from '@core/utils';
// import {ESportType, ALL_ESPORTS} from '@core/constants/enum/sport';

export const initGameResultPageInfo: TGameResultPageInfo = {
  sportId: isESports() ? EESportType.LOL : ESportType.FOOTBALL,
  pageNum: 1,
  pageSize: 10,
  beginTime: dayjs().subtract(7, 'day').format(dateFormat),
  endTime: dayjs().format(dateFormat),
};

export default (_initGameResultPageInfo=initGameResultPageInfo, from='') => {
  const {dispatch, ACTIONS} = usePublicState();
  const {matchStatistics} = useSelector((state: TStore) => state.sport.display);
  const {gameResultPageInfo} = useSelector((state: TStore) => state.sport.userSettings);
  const {loading: serverLoading} = useSelector((state: TStore) => state.base);

  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState<TGameResultPageInfo>(_initGameResultPageInfo);
  const [gameResultOpts, setGameResultOpts] = useState<Array<{label: string, value: number}>>(_.map(matchStatistics.filter((item) => item.sportId === ESportType.FOOTBALL), (match) => ({label: match.sportName, value: match.sportId})));
  // const [gameResultOpts, setGameResultOpts] = useState<Array<{label: string, value: number}>>(_.map(matchStatistics.filter((item) => !!item.count), (match) => ({label: match.sportName, value: match.sportId})));

  // 管理页面页号
  useEffect(() => {
    dispatch(ACTIONS.SPORT.updateDisplayType('skeleton'));
    const sportId = isESports() ? EESportType.LOL : ESportType.FOOTBALL;
    dispatch(ACTIONS.SPORT.getGameResultList({params: from === 'saiguo'?{..._initGameResultPageInfo, sportId}:{...gameResultPageInfo, sportId}, cb: (res: any)=> {
      if (!res.data?.list.length) {
        dispatch(ACTIONS.SPORT.updateDisplayType('empty'));
      } else {
        dispatch(ACTIONS.SPORT.updateDisplayType('list'));
      }
    }}));
  }, []);

  useEffect(() => {
    setPageInfo(gameResultPageInfo);
  }, [gameResultPageInfo]);

  // Loading效果
  useEffect(() => {
    const {display, text} = serverLoading;
    if (display && (text === ELoadingKeys.GAMES_RESULT || text === ELoadingKeys.GAME_RESULT_DETAIL)) {
      setLoading(true);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, [serverLoading]);

  // 管理页面体育列表
  useEffect(() => {
    // 目前支持的体育: 足球，篮球，电竞，网球，斯诺克，羽毛球，乒乓球，排期，冰球，手球
    setGameResultOpts(isESports() ? [..._.map(ALL_ESPORTS, (esport) => ({label: esport.name, value: esport.code}))] : [
      {label: ALL_SPORTS_MAP[ESportsCategory.FOOTBALL], value: ESportsCategory.FOOTBALL},
      {label: ALL_SPORTS_MAP[ESportsCategory.BASKETBALL], value: ESportsCategory.BASKETBALL},
      {label: ALL_SPORTS_MAP[ESportsCategory.TENNIS], value: ESportsCategory.TENNIS},
      {label: ALL_SPORTS_MAP[ESportsCategory.BASEBALL], value: ESportsCategory.BASEBALL},
      {label: ALL_SPORTS_MAP[ESportsCategory.BOXING_MMA], value: ESportsCategory.BOXING_MMA},
      // {label: ALL_SPORTS_MAP[ESportsCategory.SNOOKER], value: ESportsCategory.SNOOKER},
      // {label: ALL_SPORTS_MAP[ESportsCategory.BADMINTON], value: ESportsCategory.BADMINTON},
      // {label: ALL_SPORTS_MAP[ESportsCategory.TABLE_TENNIS], value: ESportsCategory.TABLE_TENNIS},
      // {label: ALL_SPORTS_MAP[ESportsCategory.VOLLEYBALL], value: ESportsCategory.VOLLEYBALL},
      // {label: ALL_SPORTS_MAP[ESportsCategory.ICE_HOCKEY], value: ESportsCategory.ICE_HOCKEY},
      // {label: ALL_SPORTS_MAP[ESportsCategory.HANDBALL], value: ESportsCategory.HANDBALL},
      ..._.map(ALL_ESPORTS, (esport) => ({label: esport.name, value: esport.code})),
    ]);
  }, []);

  useMount(() => {
    dispatch(ACTIONS.SPORT.getMatchStatistics({params: {querys: undefined}}));
  });

  useUnmount(() => {
    dispatch(ACTIONS.SPORT.resetGameResultPageInfo());
  });

  return {
    loading,
    pageInfo,
    setPageInfo,
    gameResultOpts,
  };
};
