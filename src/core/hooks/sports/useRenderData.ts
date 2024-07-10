/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:41:38
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/sports/useRenderData.ts
 * @Description: 页面所需要的动态数据
 */
import {useSelector} from 'react-redux';
import IStore, {TGameResultStatistic, TLeagueStatistic} from '@core/reducers/_reduxStore.d';
import {TMatch} from '@core/services/Table';
import db from '@core/services/db';
import storage from '@core/helpers/storage';
import {useEffect, useMemo, useState} from 'react';
import {EESportType, EMatchTypes} from '@core/constants/enum/sport';
import usePublicState from '@core/hooks/usePublicState';

// 使用 matchId 获取比赛数据
export const useMatchDataByMatchId = (matchId: number) => {
  const {matchListUpdateTime} = useSelector((state: IStore) => state.sport.display);
  const [match, setMatch] = useState<TMatch>(null);

  useEffect(() => {
    if (!matchId) {
      return;
    }
    db.matches.where('matchId').equals(matchId).toArray()
        .then((matches) => {
          setMatch(_.first(matches));
        })
        .catch((error) => {
          console.warn('Failed to find matches:', error);
        });
  }, [matchListUpdateTime, matchId]);

  return {
    match,
  };
};

// 使用 leagueId 获取所属所有比赛列表数据
export const useMatchListDataByLeagueId = (leagueId: number): {
  matchList: Array<TMatch>
} => {
  const {matchListUpdateTime} = useSelector((state: IStore) => state.sport.display);
  const [matchList, setMatchList] = useState<Array<TMatch>>([]);

  useEffect(() => {
    if (!leagueId) {
      return;
    }
    db.matches.where('leagueId').equals(leagueId).toArray()
        .then((matches) => {
          setMatchList(matches.filter((item) => item.leagueId === leagueId));
        })
        .catch((error) => {
          console.warn('Failed to find matches:', error);
        });
  }, [matchListUpdateTime, leagueId]);

  return {
    matchList,
  };
};

// 获取所有视频
export const useMatchListData = (): {
  matchList: Array<TMatch>
} => {
  const {matchListUpdateTime} = useSelector((state: IStore) => state.sport.display);
  const [matchList, setMatchList] = useState<Array<TMatch>>([]);

  useEffect(() => {
    db.matches.toArray()
        .then((matches) => {
          const matchList = _.orderBy(matches, 'sortNo');
          setMatchList(matchList);
          if (matchList.length) {
            const sportId = matchList[0].sportId;
            const leagues = storage.getAny(`${sportId}_league_list`) || [];
            const cacheIds = leagues.reduce((a: number[], b: TLeagueStatistic) => {
              a = a.concat(b.matchIds[b.state as EMatchTypes]);
              return a;
            }, []);
            storage.setAny(`${sportId}_match_list`, matchList.filter((match) => cacheIds.includes(match.matchId)));
          }
        })
        .catch((error) => {
          console.warn('Failed to find matches:', error);
        });
  }, [matchListUpdateTime]);

  return {
    matchList,
  };
};

// 获取所有当前联赛列表
export const useLeagueListData = (): {
  leagues: Array<TLeagueStatistic>
} => {
  const {sportId, matchType} = useSelector((state: IStore) => state.sport.userSettings);
  const [leagues, setLeagues] = useState<Array<TLeagueStatistic>>();
  const leagueStatistics = useSelector((state: IStore) => state.sport.display.leagueStatistics);
  const leagueIcon = useMemo(() => {
    const sid = sportId;
    if (sid === EESportType.LOL) {
      return require('@my/assets/images/common/icon_lol1.png');
    } else if (sid === EESportType.DOTA2) {
      return require('@my/assets/images/common/icon_dota1.png');
    } else if (sid === EESportType.KINGOFGLORY) {
      return require('@my/assets/images/common/icon_king1.png');
    } else if (sid === EESportType.CS2) {
      return require('@my/assets/images/common/icon_csgo1.png');
    } else {
      return '';
    }
  }, [sportId]);

  useEffect(() => {
    const arr = leagueStatistics.map((item) => {
      return {
        ...item,
        leagueIcon: leagueIcon || item.leagueIcon,
      };
    });
    const obj = _.groupBy(_.orderBy(arr, ['state'], [matchType === EMatchTypes.IN_PLAY ? 'asc': 'desc']), 'state');
    const cacheData: {leagues: TLeagueStatistic[], ids: number[]} = {
      leagues: [],
      ids: [],
    };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key].forEach((i) => {
          // 缓存6场赛事
          if (cacheData.ids.length < 6) {
            const ids = i.matchIds[key as EMatchTypes].slice(0, 6 - cacheData.ids.length);
            cacheData.ids = cacheData.ids.concat(ids);
            cacheData.leagues.push({...i, matchIds: {...i.matchIds, [key]: ids}});
          }
        });
      }
    }
    storage.setAny(`${sportId}_league_list`, cacheData.leagues);
    // storage.setAny(`${sportId}_match_list`, []);
    setLeagues(arr);
  }, [leagueStatistics, matchType, sportId]);

  return {
    leagues,
  };
};

// 获取赛果列表
export interface passData {
  gamesResult: Array<TGameResultStatistic>,
  loading: {display: boolean, text?: string},
  noData: boolean,
  viewDetail: React.Key | null,
  handleDetailView: (key: React.Key) => void,
}
export const useGameResultListData = (): passData => {
  const {dispatch, ACTIONS} = usePublicState();

  const [noData, setNoData] = useState(false);
  const [viewDetail, setViewDetail] = useState<React.Key | null>(null);

  const {gameResultStatistics} = useSelector((state: IStore) => state.sport.display);
  const {loading} = useSelector((state: IStore) => state.base);

  useEffect(() => {
    setViewDetail(null);
    setNoData(!gameResultStatistics.length);
  }, [gameResultStatistics]);

  const handleDetailView = (key: React.Key) => {
    if (viewDetail === key) {
      setViewDetail(null);
    } else {
      dispatch(ACTIONS.SPORT.getGameResultDetail({
        params: {matchId: key},
      }));
      setViewDetail(key);
    }
  };

  return {gamesResult: gameResultStatistics, loading, noData, viewDetail, handleDetailView};
};
