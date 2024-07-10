/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/SportTypeSelector/index.tsx
 * @Description:
 */
import {useEffect, useMemo, useCallback} from 'react';
import useSettings from '@core/hooks/sports/useSettings';
import classnames from 'classnames';
import {useSelector} from 'react-redux';
import TStore, {TMatchStatistic} from '@core/reducers/_reduxStore';
import styles from './style.scss';
import useFavorites from '@core/hooks/sports/useFavorites';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import usePublicState from '@core/hooks/usePublicState';
import {EMatchTypes} from '@core/constants/enum/sport';

export default function() {
  const {matchType} = useSelector((state: TStore) => state.sport.userSettings);
  const sportList = useSelector((state: TStore) => state.sport.display.matchStatistics);
  const {dispatch, ACTIONS, base} = usePublicState();
  const {switchSportByType, sportId} = useSettings();
  const {favoriteIds} = useFavorites();
  const isEsports = useMemo(() => {
    return sportId > 33;
  }, [sportId]);
  const {emit} = useEventEmitter<TMitt['toggleFavorite']>({mittName: 'toggleFavorite'});
  const list = useMemo(() => {
    if (isEsports) {
      const ids = [278, 276, 279, 277];
      const obj = sportList.reduce((a: any, b) => {
        a[b.sportId] = b;
        return a;
      }, {});
      return ids.map((item) => obj[item]);
    }
    const favorite: TMatchStatistic = {
      sportId: -1,
      count: favoriteIds.length,
      sportName: '收藏',
      available: 1,
      rollingBallSwitch: true,
      morningSwitch: true,
      sportShowSwitch: true,
    };
    return base.toggleSeries ? sportList.filter((item) => item.sportId !== 4) : [favorite].concat(sportList.filter((item) => item.sportId !== 4));
  }, [sportList, isEsports, favoriteIds, base.toggleSeries]);

  const handleSwitchSport = useCallback((count: number, newSportId: number) => {
    if (sportId === newSportId) {
      return;
    }
    emit({display: newSportId === -1});
    // if (count === 0) {
    //   dispatch(ACTIONS.BASE.openToast({text: '暂无赛事', types: 'info'}));
    //   return;
    // }
    switchSportByType(newSportId);
  }, [sportId]);

  useEffect(()=> {
    // 切换比赛类型， 足球不可用
    const currentMatch=_.find(list, {'sportId': sportId});
    if (matchType === EMatchTypes.EARLY&&!currentMatch?.sportShowSwitch&&!currentMatch?.morningSwitch) {
      dispatch(ACTIONS.SPORT.updateDisplayType('empty'));
    };
    if (matchType === EMatchTypes.IN_PLAY&&!currentMatch?.sportShowSwitch&&!currentMatch?.rollingBallSwitch) {
      dispatch(ACTIONS.SPORT.updateDisplayType('empty'));
    };

    if (!currentMatch?.sportShowSwitch) {
      dispatch(ACTIONS.SPORT.updateDisplayType('empty'));
    };
  }, [matchType]);

  useEffect(()=> {
    const _list = [...list].splice(1);
    if (!_.find(list, {sportId})?.sportShowSwitch&&!isEsports) {
      const newSportId = _.find(_list, {sportShowSwitch: true});

      handleSwitchSport(newSportId.count, newSportId.sportId);
    }
  }, [sportList]);

  // 赛中是否可用添加 早盘 滚球判断
  const isShow = (item: TMatchStatistic)=>{
    return item?.sportShowSwitch;
  };

  const onClick = (item: any) => {
    if (!isShow(item)) {
      dispatch(ACTIONS.BASE.openToast({text: '暂未开启', types: 'error'}));
      return;
    }
    handleSwitchSport(item.count, item.sportId);
  };
  return (
    <div className={styles.wrapper}>
      {list.map((item) => (
        item &&
        <div
          className={classnames('sport-type-item', {disabled: !isEsports && !isShow(item), active: sportId === item?.sportId})}
          onClick={() => onClick(item)}
          key={item.sportId}>
          <div className={classnames('sport-logo', `sid-${item?.sportId}`, {active: sportId === item?.sportId, disabled: !isEsports && !isShow(item)})}>
            <span className='total'>{item.count}</span>
          </div>
          <p className={`${sportId === item.sportId ? 'active' : ''}`}>{item.sportId === 5 ? '斯诺克' : item.sportName}</p>
        </div>
      ))}
    </div>
  );
}
