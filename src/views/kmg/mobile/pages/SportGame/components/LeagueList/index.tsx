/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 18:10:34
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/LeagueList/index.tsx
 * @Description:
 */
import React, {useState} from 'react';
import {TMatch} from '@core/services/Table';
import {useSelector} from 'react-redux';
import useFavorites from '@core/hooks/sports/useFavorites';
import {useLeagueListData, useMatchListData} from '@core/hooks/sports/useRenderData';
import useSettings from '@core/hooks/sports/useSettings';
import {MatchListSkeleton} from '@this/shadow/Skeleton';
import MatchMethodNames from '@this/pages/SportGame/components/MatchMethods/Names';
import MatchMethods from '@this/pages/SportGame/components/MatchMethods';
import Empty from '@this/shadow/Empty';
import {ALL_MATCH_TYPES, EMatchTypes, EGameBettingType} from '@constants/enum/sport';
import TStore, {TLeagueStatistic} from '@core/reducers/_reduxStore.d';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import styles from './style.scss';
import DpIcon from '@this/components/Icon';
import MatchOfNoob from '../MatchOfNoob';
import classnames from 'classnames';
import {useUnmount} from 'react-use';
import {TMitt} from '@constants/enum/mitt';
import {useInView} from 'react-intersection-observer';
import useEventEmitter from '@core/hooks/useEventEmitter';
import useIntersectionObserver from './useIntersectionObserver';
import storage from '@core/helpers/storage';
import {ESportsCategory} from '@core/constants/enum/sport/sportsCategory';
import series from '../BetCart/SingleCart/i/series.svg';
import MatchChampion from '../MatchChampion';
import useSwitchMatchType from '@core/hooks/sports/useSwitchMatchType';
import dayjs from 'dayjs';

export default React.memo(() => {
  const {switchMatchTypeDisplay} =useSwitchMatchType();
  const {leagues} = useLeagueListData();
  const {matchList} = useMatchListData();
  const currentLeagueId = useSelector((state: TStore) => state.sport.display.currentLeagueId);
  const displayType = useSelector((state: TStore) => state.sport.display.displayType);
  const matchType = useSelector((state: TStore) => state.sport.userSettings.matchType);
  const sportId = useSelector((state: TStore) => state.sport.userSettings.sportId);
  const {orderTags, isSeries} = useOrderCart();
  const visibleBetOrderMitt = useEventEmitter<TMitt['visibleBetOrder']>({mittName: 'visibleBetOrder'});
  const {toggleCollapseLeagueByMatchType, isCollapseInplay, isCollapseUpcoming, toggleCollapseAllLeague, isCollapseAll} = useSettings();
  const cacheLeagueList: TLeagueStatistic[] = React.useMemo(() => matchType === EMatchTypes.CHAMPION ? [] : storage.getAny(`${sportId}_league_list`), [sportId, matchType]);
  const cacheMatchList: TMatch[] = React.useMemo(() => matchType === EMatchTypes.CHAMPION ? [] : storage.getAny(`${sportId}_match_list`), [sportId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEventEmitter<TMitt['syncMethodsTab']>({mittName: 'syncMethodsTab', on: ({index, sportId}) => {
    if (sportId === ESportsCategory.FOOTBALL) {
      setCurrentIndex(index);
    };
  }});
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
  const onToggle = (type: EMatchTypes) => {
    toggleCollapseLeagueByMatchType(type);
    const el = document.querySelector(`.${type}-first`) as HTMLDivElement;
    const mEl = document.querySelector('.main-content') as HTMLDivElement;
    if (el) {
      if (type !== matchType && document.querySelector(`.${type === EMatchTypes.IN_PLAY ? EMatchTypes.UPCOMING : EMatchTypes.IN_PLAY}-end`)?.getBoundingClientRect().top > 154) return;
      if (mEl) mEl.scrollTop = el.offsetTop - (window.innerWidth / 375 * 28);
    }
  };
  const onToggleAll = () => {
    toggleCollapseAllLeague();
    const el = document.querySelector('.main-content') as HTMLDivElement;
    if (el) el.scrollTop = 0;
  };
  if (displayType === 'skeleton' && (matchType === EMatchTypes.EARLY || (!cacheLeagueList?.length || !cacheMatchList?.length))) {
    return (
      <div className='pt-20'>
        <MatchListSkeleton />
      </div>
    );
  }
  if (displayType === 'empty' || !switchMatchTypeDisplay) {
    return (
      <div className="empty-wrapper center">
        <Empty />
      </div>
    );
  }

  const displyLeagues = _.filter(leagues, (item): boolean => {
    if (_.isEmpty(currentLeagueId)) {
      return true;
    }
    if (_.find(currentLeagueId, {id: item.leagueId, key: item.state})) {
      return true;
    }
    return false;
  });

  /* const handleClickGroupBet = () => {
    if (orderTags.length < 2) {
      dispatch(ACTIONS.BASE.openToast({text: '请至少选择两场比赛', types: 'error'}));
    } else {
      dispatch(ACTIONS.BASE.toggleSerierModal({data: true}));
    }
  }; */

  return (
    <div className={styles.wrapper}>
      {
        _.map(_.groupBy(_.orderBy((displayType === 'skeleton' ? cacheLeagueList : displyLeagues), ['state'], [matchType === EMatchTypes.IN_PLAY ? 'asc': 'desc']), 'state'), (leaguesGroup: Array<TLeagueStatistic>, key: EMatchTypes) =>
          <React.Fragment key={key} >
            <div className={classnames('play-type-wrapper', key, {'is-closed': key === EMatchTypes.IN_PLAY ? !isCollapseInplay : !isCollapseUpcoming})} onClick={() => onToggle(key)}>
              <div className='name'>
                <img src={require(`@this/assets/images/common/${key}.png`)} />
                <span>{ matchType === EMatchTypes.EARLY ? '早盘' : _.find(ALL_MATCH_TYPES, {code: key})?.name }</span>&nbsp;
                <span className='count'>({_.sumBy(leaguesGroup, (league) => league.countGroup[key])})</span>
              </div>
              <div className="collect-wrapper">
                <DpIcon type='arrow2' />
              </div>
            </div>
            {
              leaguesGroup.map((league, index) =>
                <LeagueItem
                  key={`${key}-${league.leagueId}`}
                  matches={_.groupBy(matchList, 'leagueId')[league.leagueId]}
                  cacheMatches={_.groupBy(cacheMatchList, 'leagueId')[league.leagueId]}
                  leagueId={league.leagueId}
                  leagueIcon={league.leagueIcon}
                  leagueName={league.leagueName}
                  state={key}
                  countGroup={league.countGroup}
                  matchIds={league.matchIds}
                  isCache={displayType === 'skeleton'}
                  actIndex={currentIndex}
                  watchInView
                  className={index === 0 ? `${key}-first` : index === leaguesGroup.length - 1 ? `${key}-end` : undefined}
                  sportId={sportId}
                  startTime={league.startTime}
                />,
              )
            }
          </React.Fragment>,
        )
      }
      {matchType !== EMatchTypes.CHAMPION && orderTags.length>0 && isSeries && <div className="series-icon"
        onClick={()=>{
          visibleBetOrderMitt.emit({display: true, showSeries: true});
        }}>
        <img src={series}/>
        <em>{orderTags.length}</em>
      </div>}
      {
        displayType === 'list' &&
        <div className="no-more">没有更多数据了</div>
      }
      {
        false &&
        <div className={classnames('collapse-icon', {'closed': !isCollapseAll})} onClick={onToggleAll}></div>
      }
    </div>
  );
});


interface ILeagueItem {
  matches: Array<TMatch>;
  leagueId: number;
  leagueName: string;
  leagueIcon: string;
  state?: EMatchTypes;
  countGroup?: {[key in EMatchTypes]?: number};
  watchInView?: boolean;
  isCache?: boolean;
  cacheMatches?: Array<TMatch>;
  matchIds?: {
    [key in EMatchTypes]?: number[];
  };
  actIndex?: number;
  sportId: number;
  className?: string;
  startTime?: number;
}
export const LeagueItem = React.memo((leagueItem: ILeagueItem) => {
  const {ref, inView} = useInView({threshold: 0});
  const {emit} = useEventEmitter<TMitt['syncMatchPollingLeagueIds']>({mittName: 'syncMatchPollingLeagueIds'});
  const sportId = useSelector((state: TStore) => state.sport.userSettings.sportId);
  const {leagueId, leagueName, matches, state, countGroup, watchInView, isCache, cacheMatches, matchIds} = leagueItem;
  const {toggleCollapseLeague, collapseLeagueIds, gameBettingType, matchType} = useSettings();
  const [cartHeight, setCartHeight] = React.useState(0);
  const [isUnfoldBownBtn, setIsUnfoldBownBtn] = React.useState({
    'jiaoqiu': {ctid: 1, toggle: false},
    'bodan': {ctid: 0, toggle: false},
    'fapai': {ctid: 2, toggle: false},
  });
  const {isFavorite, onToggleFavorite} = useFavorites();
  const {targetRef, visible} = useIntersectionObserver((_:boolean, boundingClientRect:any) => {
    setCartHeight(boundingClientRect.height);
  }, leagueName, leagueId);
  const list = matches?.length ? matches : cacheMatches;
  let matchWithState = list;
  if (state) {
    matchWithState = list?.filter((item) => item.isLive === (state === EMatchTypes.IN_PLAY));
  }
  useUnmount(() => {
    emit({leagueIds: [leagueId], display: false, state});
  });

  React.useEffect(() => {
    if (watchInView && !isCache) {
      emit({leagueIds: [leagueId], display: inView, state});
    }
  }, [inView, isCache]);
  // 状态前缀
  const statePrefix = state || 'fav';
  const matchIdsInLeague = matchIds ? matchIds[state] : _.map(list, (i) => i.matchId);
  return (
    <div className={classnames(styles.leagueItem, leagueItem.className, {'in-view': inView})} ref={targetRef}>
      {
        visible ? <React.Fragment>
          <div className={classnames('league-wrapper', {'is-closed': !_.includes(collapseLeagueIds, `${statePrefix}#${leagueId}`)})} onClick={() => !isCache && toggleCollapseLeague({leagueId: `${statePrefix}#${leagueId}`, isRequestData: !matches})}>
            <div className="league-info">
              <DpIcon type="collect" active={isFavorite(matchIdsInLeague)} onClick={(e) => !isCache && onToggleFavorite(e, matchIdsInLeague)} />
              <span className="league-name ml-5">
                {leagueName}
                {
                  matchType === EMatchTypes.CHAMPION && leagueItem.startTime &&
                  <span className="ml-10">{dayjs(leagueItem.startTime).format('YYYY年MM月DD日 HH:mm')}</span>
                }
                {countGroup && matchType !== EMatchTypes.CHAMPION && !isCache && !_.includes(collapseLeagueIds, `${state}#${leagueId}`) && <span className="ml-10">{countGroup[state]}</span>}
              </span>
            </div>
          </div>

          {
            (_.includes(collapseLeagueIds, `${statePrefix}#${leagueId}`) || isCache) &&
            <div className="match-items-wrapper" ref={ref}>
              {
                matchType !== EMatchTypes.CHAMPION && location.pathname === '/' && gameBettingType === EGameBettingType.ADVANCED &&
                <div className='match-box border-bottom'>
                  <div className="name-list">
                    {
                      <div className="match-title">
                        <MatchMethodNames sportId={leagueItem.sportId ?? sportId} actIndex={leagueItem.actIndex} />
                      </div>
                    }
                  </div>
                </div>
              }
              {
                !list &&
                <div style={{padding: '14px', paddingBottom: '1px'}}>
                  <MatchListSkeleton size={1} />
                </div>
              }
              {
                matchWithState?.length > 0 &&
                matchWithState.map((item: TMatch) => item.isChampion ? <MatchChampion match={item} key={item.matchId} /> : (item.sportId > 33 || gameBettingType === EGameBettingType.BEGINNER) ? <MatchOfNoob match={item} key={item.matchId} /> : <MatchMethods isUnfoldBownBtn={isUnfoldBownBtn} setIsUnfoldBownBtn={setIsUnfoldBownBtn} actIndex={leagueItem.actIndex} match={item} key={item.matchId} inMainList={true} />)
              }
            </div>
          }
        </React.Fragment> :
        <div style={{height: cartHeight+'px'}}>
          <div className="league-wrapper">
            <div className="league-info league-info-novisible">
              {/* <DpImage type='league' src={leagueItem} */}
              {/* <span className="league-name">{leagueName}</span> */}
            </div>
          </div>
          {
            (_.includes(collapseLeagueIds, `${statePrefix}#${leagueId}`) || isCache) &&
            <div className="match-items-wrapper">
              {
                matchWithState?.length > 0 &&
                matchWithState.map((item: TMatch) => (item.sportId > 33 || gameBettingType === EGameBettingType.BEGINNER) ?
                <div key={item.matchId} className='match-beginner-placeholder'></div> :
                <div key={item.matchId} className='match-placeholder'></div>)
              }
            </div>
          }
        </div>
      }
    </div>
  );
});

