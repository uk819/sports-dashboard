/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 18:10:34
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/LeagueList/index.tsx
 * @Description:
 */
import React, {useMemo, useRef, useState} from 'react';
import TStore from '@core/reducers/_reduxStore.d';
import classnames from 'classnames';
import {useSelector} from 'react-redux';
import DpIcon from '@this/components/Icon';
import Empty from '@this/shadow/Empty';
import {useGameResultListData} from '@core/hooks/sports/useRenderData';
import styles from './style.scss';
import LeagueItem from './LeagueItem';
import {DatePickerProps} from './../../type';

export default React.memo(({sportId}: DatePickerProps) => {
  const displayType = useSelector((state: TStore) => state.sport.display.displayType);
  const [initActiveIndex, setInitActiveIndex] = useState(0);
  const {gamesResult} = useGameResultListData();
  const leagueIdAll = useRef([]);
  const enhanceGameResult = useMemo(()=>{
    const _leagueIdObj = gamesResult.reduce((pre:any, cur:any)=> {
      const _leagueId = cur.leagueId;
      if (pre[_leagueId]) {
        pre[_leagueId].push(cur);
      } else {
        pre[_leagueId]=[cur];
      }
      return pre;
    }, {});
    leagueIdAll.current = Object.keys(_leagueIdObj);
    return Object.values(_leagueIdObj);
  }, [gamesResult]);


  const isCollapseAll = useRef(true);
  const [isCollapse, setIsCollapse]=useState([]);
  const onToggle = ()=> {
    if (isCollapseAll.current) {
      setIsCollapse([]);
      isCollapseAll.current = false;
    } else {
      isCollapseAll.current = true;
      setIsCollapse(leagueIdAll.current);
    }
  };
  const toggleCollapseLeague = (leagueId:number)=> {
    const _leagueId = String(leagueId);
    setIsCollapse((pre)=> {
      const _pre = [...pre];
      _pre.includes(_leagueId)?_.remove(_pre, (item)=> {
        return item === _leagueId;
      }):_pre.push(_leagueId);
      return [..._pre];
    });
  };


  let throttleTimer: any = null;
  const throttleDelay = 26;
  const onScroll = () => {
    if (!throttleTimer) {
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        const arr = document.querySelectorAll('.BScroll-wrapper .in-view');
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
    const el = document.querySelector('.BScroll-wrapper');
    el.addEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`${styles.wrapper}`}>
      <div className={classnames('play-type-wrapper', 'in-play', {'is-closed': isCollapseAll.current})} onClick={() => onToggle()}>
        <div className='name'>
          <img src={require(`./i/icon-zaopan.svg`)} />
          <span>全部联赛</span>&nbsp;
        </div>
        <div className="collect-wrapper">
          <DpIcon type='arrow2' />
        </div>
      </div>
      {!!gamesResult.length&&enhanceGameResult.map((item:any, idx)=> {
        return <div className={classnames('leagueItem', {'is-closed': isCollapse.includes(String(item[0].leagueId))})} key={idx}>
          <LeagueItem isCollapse={isCollapse} toggleCollapseLeague={toggleCollapseLeague} sportId={sportId} itemData={item} initActiveIndex={initActiveIndex} setInitActiveIndex={setInitActiveIndex}/>
        </div>;
      })
      }
      {gamesResult.length>5&&<div className="no-more">没有更多数据了</div>}
      {
        displayType==='empty'&&<div className="empty-wrapper center">
          <Empty />
        </div>
      }
    </div>
  );
});
