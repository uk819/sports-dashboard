import {TMatchData} from '@core/apis/models/sport/get-match-list';
import {TMitt} from '@core/constants/enum/mitt';
import useFavorites from '@core/hooks/sports/useFavorites';
import useEventEmitter from '@core/hooks/useEventEmitter';
import usePublicState from '@core/hooks/usePublicState';
import TStore, {TLeague} from '@core/reducers/_reduxStore';
import {TMatch} from '@core/services/Table';
import {mapMatchList} from '@core/services/dataPurification';
import {useSelector} from 'react-redux';
import {usePrevious, useUnmount} from 'react-use';
import storage from '@helpers/storage';
import {mergeMatchInfos} from '@core/hooks/sports/useLeagueAndMatchData';
import db from '@core/services/db';
import {EMatchTypes} from '@core/constants/enum/sport';
import classnames from 'classnames';
import style from './styles.scss';
import leagueListStyle from '../LeagueList/style.scss';
import {MatchListSkeleton} from '@this/shadow/Skeleton';
import Empty from '@core/templates/mobile/components/Empty';
import ESportsCategory from '@constants/enum/sport/sportsCategory';
import {LeagueItem} from '../LeagueList';
import React, {useMemo} from 'react';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import series from '../BetCart/SingleCart/i/series.svg';

export default React.memo(() => {
  const {dispatch, ACTIONS} = usePublicState();
  const collapseLeagueIds = useSelector((state: TStore) => state.sport.userSettings.collapseLeagueIds);
  const {favoriteIds} = useFavorites();
  const {orderTags, isSeries} = useOrderCart();
  const [currentLeagueId, setCurrentLeagueId] = React.useState<number>(0);
  const {emit} = useEventEmitter<TMitt['syncFavoriteLeagueInfo']>({mittName: 'syncFavoriteLeagueInfo'});
  useEventEmitter<TMitt['syncFavoriteLeagueId']>({mittName: 'syncFavoriteLeagueId', on: ({leagueId}) => {
    setCurrentLeagueId(leagueId);
  }});
  const visibleBetOrderMitt = useEventEmitter<TMitt['visibleBetOrder']>({mittName: 'visibleBetOrder'});
  const leagueStatistics = useSelector((state: TStore) => state.sport.display.leagueStatistics);
  const favoriteMitt = useEventEmitter<TMitt['toggleFavorite']>({mittName: 'toggleFavorite'});
  useEventEmitter<TMitt['isReload']>({mittName: 'isReload', on: () => {
    fn();
  }});
  const [data, setData] = React.useState<{matches: Array<TMatch>, leagues: Array<TLeague>}>();
  const timer = React.useRef(null);
  const sportId = useSelector((state: TStore) => state.sport.userSettings.sportId);
  const prevSportId = usePrevious(sportId);
  const initalTarget = React.useRef(false);

  React.useEffect(() => {
    if (prevSportId !== sportId && !_.isUndefined(prevSportId)) {
      handleGoBack();
    }
  }, [prevSportId, sportId]);

  useUnmount(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  });

  const fn = () => {
    // if (!favoriteIds || favoriteIds?.length === 0) {
    //   handleGoBack();
    //   return;
    // }
    dispatch(ACTIONS.SPORT.getMatchListByMatchIds({data: null, cb: (res: {data: TMatchData}) => {
      // 如果收藏赛事与当前赛事不一致，重新获取收藏赛事
      if (favoriteIds?.length !== res.data?.length) {
        dispatch(ACTIONS.SPORT.getFavorites());
      }
      if (!res.data || res.data.length === 0) {
        setData({matches: [], leagues: []});
        emit({matches: [], leagues: []});
        return;
      }
      const matchList = mapMatchList(res.data, 'favorite-list');
      let mergedMatches = matchList.matches;
      const matchExt = storage.get('MATCH_EXT_INFO');
      if (matchExt) {
        mergedMatches = mergeMatchInfos(matchList.matches, matchExt);
      }
      setData({matches: mergedMatches, leagues: matchList.leagues});
      emit({leagues: matchList.leagues, matches: mergedMatches});
      // 第一次进入切换第一场比赛为详情赛事
      if (!initalTarget.current) {
        const leaugeIds = matchList.leagues.map((league) => `fav#${league.leagueId}`);
        setTimeout(() => {
          dispatch(ACTIONS.SPORT.updateUserSettings('collapseLeagueIds', _.concat(collapseLeagueIds, leaugeIds)));
        }, 200);
        initalTarget.current = true;
        const firstLeague = _.chain(matchList.leagues)
            .groupBy('sportId')
            .map((item, key) => item)
            .flatten()
            .first()
            .value();
        const firstMatchId = matchList.matches.find((item) => item.leagueId === firstLeague.leagueId).matchId;
        dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: firstMatchId}));
      }
      db.transaction('rw', db.matches, async () => {
        await db.matches.bulkPut(mergedMatches);
      });
    }}));
  };

  React.useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    fn();
    timer.current = setInterval(fn, 5000);
  }, [JSON.stringify(favoriteIds)]);

  const handleGoBack = React.useCallback(() => {
    const league = _.first(leagueStatistics);
    if (!league) {
      favoriteMitt.emit({display: false});
      return;
    }
    const leagueId = league.leagueId;
    // 从db中获取所有leagueId 的比赛
    db.matches.where('leagueId').equals(leagueId).toArray().then((matches) => {
      const match = _.find(matches, (item) => item.isLive === (league.state === EMatchTypes.IN_PLAY));
      dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: match.matchId}));
    });
    favoriteMitt.emit({display: false});
  }, [leagueStatistics]);

  const isOpenBySportId = (sportId: number) => {
    const obj = _.filter(collapseLeagueIds, (i) => _.includes(i, 'fav')).reduce((a: any, b) => {
      a[b] = true;
      return a;
    }, {});
    return !data.leagues.filter((item) => item.sportId === sportId).some((item) => !obj[`fav#${item.leagueId}`]);
  };

  const toggleData = useMemo(() => {
    const temp: {[key: number]: {lids: string[], open: boolean}} = {};
    if (data) {
      const obj = _.groupBy(data.leagues, 'sportId');
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          temp[Number(key)] = {
            lids: obj[key].map((item) => `fav#${item.leagueId}`),
            open: isOpenBySportId(Number(key)),
          };
        }
      }
    }
    return temp;
  }, [collapseLeagueIds, data]);

  const toggleBySportId = (sportId: number) => {
    if (toggleData[sportId].open) {
      const arr = collapseLeagueIds.filter((item) => !toggleData[sportId].lids.includes(item));
      dispatch(ACTIONS.SPORT.updateUserSettings('collapseLeagueIds', arr));
    } else {
      dispatch(ACTIONS.SPORT.updateUserSettings('collapseLeagueIds', _.uniq(collapseLeagueIds.concat(toggleData[sportId].lids))));
    }
  };

  let throttleTimer: any = null;
  const throttleDelay = 26;
  const onScroll = () => {
    if (!throttleTimer) {
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        const arr = document.querySelectorAll('.main-content .in-view');
        arr.forEach((item) => item.classList.remove('is-pinned'));
        for (let i = 0; i < arr.length; i++) {
          const el = arr[i] as HTMLDivElement;
          if (el.getBoundingClientRect().top > -el.offsetHeight) {
            if (!el.classList.contains('is-pinned')) {
              el.classList.add('is-pinned');
              break;
            }
          } else {
            el.classList.remove('is-pinned');
          }
        }
      }, throttleDelay);
    };
  };
  React.useEffect(() => {
    const el = document.querySelector('.main-content');
    el.addEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={classnames(style['favorite-detail'], 'main-content')}>
      <div className={leagueListStyle.wrapper}>
        {
          !data && <div className="pt-20">
            <MatchListSkeleton />
          </div>
        }
        {
          data && data.leagues.length === 0 &&
          <div className="mt-80 dp-empty-wrap center">
            <Empty description={<span>请先添加收藏赛事</span>} />
          </div>
        }
        {
          orderTags.length>0 && isSeries && <div className="series-icon"
            onClick={()=>{
              visibleBetOrderMitt.emit({display: true, showSeries: true});
            }}>
            <img src={series}/>
            <em>{orderTags.length}</em>
          </div>}
        {
          data?.leagues?.length > 0 &&
          _.map(_.groupBy(data.leagues.filter((i) => currentLeagueId === 0 ? i : i.leagueId === currentLeagueId), 'sportId'), (leagueGroup, key) =>
            <React.Fragment key={key}>
              <div className={classnames('play-type-wrapper', {'is-closed': !toggleData[Number(key)].open})} onClick={() => toggleBySportId(Number(key))}>
                <div className="name">
                  <span>{_.find(ESportsCategory, {sportId: Number(key)}).name}</span>&nbsp;
                  <span className='count'>({_.filter(data.matches.filter((i) => i.sportId === Number(key)))?.length})</span>
                </div>
                <img className='arrow' src={require(`../LeagueList/i/icon-arrow-down.png`)} />
              </div>
              {
                leagueGroup.map((league) =>
                  <LeagueItem
                    leagueIcon={league.leagueIcon}
                    leagueId={league.leagueId}
                    leagueName={league.leagueName}
                    key={`${league.leagueId}`}
                    matches={_.filter(data.matches, (match) => match.leagueId === league.leagueId)}
                    sportId={Number(key)}
                  />,
                )
              }
            </React.Fragment>,
          )
        }
      </div>
    </div>
  );
});
