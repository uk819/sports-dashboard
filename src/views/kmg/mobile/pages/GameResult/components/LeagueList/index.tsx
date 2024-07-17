import React, {useMemo, useRef, useState} from 'react';
import TStore from '@core/reducers/_reduxStore.d';
import classnames from 'classnames';
import {useSelector} from 'react-redux';
import Empty from '@this/shadow/Empty';
// import {useGameResultListData} from '@core/hooks/sports/useRenderData';
import style from './style.module.scss';
import LeagueItem from './LeagueItem';
import {DatePickerProps} from './../../type';
import FilterBar from '../fliterBar';

export default React.memo(({sportId, setShowFilter, gamesResult}: DatePickerProps) => {
  const {displayType} = useSelector((state: TStore) => state.sport.display);
  // 要处理 DPTY-3590, 3601: Weima-0713
  const leagueIdAll = useRef([]);
  const enhanceGameResult = useMemo(() => {
    const _leagueIdObj = gamesResult.reduce((pre: any, cur: any) => {
      const _leagueId = cur.leagueId;
      if (pre[_leagueId]) {
        pre[_leagueId].push(cur);
      } else {
        pre[_leagueId] = [cur];
      }
      return pre;
    }, {});
    leagueIdAll.current = Object.keys(_leagueIdObj);
    return Object.values(_leagueIdObj);
  }, [gamesResult]);

  const isCollapseAll = useRef(false);
  const [isCollapse, setIsCollapse] = useState([]);
  const onToggle = () => {
    if (isCollapseAll.current) {
      setIsCollapse([]);
      isCollapseAll.current = !isCollapseAll.current;
    } else {
      isCollapseAll.current = !isCollapseAll.current;
      setIsCollapse(leagueIdAll.current);
    }
  };
  const toggleCollapseLeague = (leagueId: number) => {
    const _leagueId = String(leagueId);
    setIsCollapse((pre) => {
      const _pre = [...pre];
      _pre.includes(_leagueId) ?
        _.remove(_pre, (item) => {
          return item === _leagueId;
        }) :
        _pre.push(_leagueId);
      return [..._pre];
    });
  };

  let throttleTimer: any = null;
  const throttleDelay = 26;
  const onScroll = () => {
    if (!throttleTimer) {
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        const arr = document.querySelectorAll('#BScroll_wrapper .in-view');
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
    }
  };
  React.useEffect(() => {
    const el = document.querySelector('#BScroll_wrapper');
    el.addEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={style.wrapper}>
      <FilterBar
        setFilter={() => setShowFilter(true)}
        toggle={onToggle}
        showPanel={isCollapseAll.current}
        gameResult={gamesResult}
      />
      {!!gamesResult.length &&
        enhanceGameResult.map((item: any, idx) => {
          return (
            <div
              className={classnames(style.leagueItem, {
                [style.is_closed]: isCollapse.includes(String(item[0].leagueId)),
              })}
              key={idx}>
              <LeagueItem
                isCollapse={isCollapse}
                toggleCollapseLeague={toggleCollapseLeague}
                sportId={sportId}
                itemData={item}
              />
            </div>
          );
        })}
      {gamesResult.length > 5 && <div className={style.no_more}>没有更多数据了</div>}
      {displayType === 'empty' && (
        <div className={style.empty_wrapper}>
          <Empty />
        </div>
      )}
    </div>
  );
});
