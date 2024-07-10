/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 12:40:58
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/TypeSelector/index.tsx
 * @Description:
 */

import DpIcon from '@views/kmg/mobile/components/Icon';
import css from './style.scss';
import usePublicState from '@core/hooks/usePublicState';
import useSettings from '@core/hooks/sports/useSettings';
import {EMatchTypes, ESportType} from '@core/constants/enum/sport';
import classnames from 'classnames';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import dayjs from 'dayjs';
import {formatCurrency} from '@core/helpers/unit';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import useProfile from '@core/hooks/users/useProfile';
import {isESports} from '@core/utils';

export default React.memo(() => {
  const {user, base, dispatch, ACTIONS} = usePublicState();
  const {switchMatchType, switchSportByType} = useSettings();
  const [selectIndex, setSelectIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const {emit} = useEventEmitter<TMitt['toggleFavorite']>({mittName: 'toggleFavorite', on: ({display}) => setIsFavorite(display)});
  const {emit: showDateEmit} = useEventEmitter<TMitt['showDatePick']>({mittName: 'showDatePick'});
  const {loadingProfile, getProfile} = useProfile();
  const sportId = useSelector((state: TStore) => state.sport.userSettings.sportId);
  const onChangeType = (index: number, type?: EMatchTypes) => {
    if (type !== undefined) {
      switchMatchType(type);
      setSelectIndex(index);
    }
    if (isFavorite) {
      switchSportByType(ESportType.FOOTBALL);
    }
    dispatch(ACTIONS.BASE.toggleSerierWay({data: type === EMatchTypes.PARLAY}));
  };
  useEffect(() => {
    if (base.toggleSeries) {
      if (selectIndex !== 4) onChangeType(4, EMatchTypes.PARLAY);
    } else {
      if (selectIndex === 4) onChangeType(0, EMatchTypes.IN_PLAY);
    }
  }, [base.toggleSeries]);

  useEffect(() => {
    showDateEmit({display: selectIndex === 2});
  }, [selectIndex]);

  const onBack = () => {
    if (sportId > 33 && !isESports()) {
      emit({display: false});
      switchSportByType(ESportType.FOOTBALL);
    } else {
      window.history.go(-1);
    }
  };

  return (
    <>
      <div className={css.wrapper}>
        <div className='div'>
          <div className="go-back" onClick={onBack}>
            <DpIcon type="arrow" fill={sportId > 33 ? '#fff' : undefined} />
          </div>
          <div className='navbar'>
            <div className={classnames('text-wrapper', {active: !isFavorite && selectIndex === 0})} onClick={() => onChangeType(0, EMatchTypes.IN_PLAY)}>今日</div>
            <div className={classnames('text-wrapper', {active: !isFavorite && selectIndex === 1})} onClick={() => onChangeType(1, EMatchTypes.IN_PLAY)}>滚球</div>
            <div className={classnames('text-wrapper', {active: !isFavorite && selectIndex === 2})} onClick={() => onChangeType(2, EMatchTypes.EARLY)}>早盘</div>
            <div className={classnames('text-wrapper', {active: !isFavorite && selectIndex === 4})} onClick={() => onChangeType(4, EMatchTypes.PARLAY)}>串关</div>
            <div className={classnames('text-wrapper', {active: !isFavorite && selectIndex === 3})} onClick={() => onChangeType(3, EMatchTypes.CHAMPION)}>冠军</div>
            {/* <div className={classnames('text-wrapper', {active: isFavorite})} onClick={() => onChangeType(3)}>收藏</div> */}
          </div>
        </div>
        <div className={classnames('div-2', {'rotate-infinite': loadingProfile})} onClick={() => getProfile()}>
          <div className='group'>
            <img className='union' alt='Union' src={require('./i/union.svg')} />
          </div>
          <div className='text-wrapper-3'>{formatCurrency(user.info.totalBalance)}</div>
        </div>
      </div>
    </>
  );
});

export const DatePicker = React.memo(() => {
  const earlyGroup = useSelector((state: TStore) => state.sport.display.earlyGroup);
  const {switchQueryDate, matchType} = useSettings();
  const sportId = useSelector((state: TStore) => state.sport.userSettings.sportId);
  const [index, setIndex] = useState(0);
  if (!earlyGroup) {
    return <></>;
  }
  const week = _.times(7).map((i) => ({
    name: dayjs()
        .add(i + 1, 'day')
        .format('MM/DD'),
    count: earlyGroup[i + 1],
    query: i + 1,
  }));
  const dates = React.useMemo(() => {
    const arr = [{name: '全部', count: earlyGroup[0], query: 0}, ...week, {name: '其他', count: earlyGroup[8], query: 8}];
    if (matchType === EMatchTypes.PARLAY) arr.splice(0, 1, {name: '今日', count: earlyGroup[9], query: 9});
    return arr;
  }, [matchType]);
  const handleClick = (idx: number, query: number) => {
    switchQueryDate(query);
    setIndex(idx);
  };
  useEffect(() => {
    handleClick(0, dates[0].query);
  }, [sportId, dates]);
  return (
    <div className="date-list">
      {
        dates.map((item, idx) => (
          <div className={classnames('option-item', {active: idx === index})} onClick={() => handleClick(idx, item.query)} key={item.name}>{item.name}</div>
        ))
      }
    </div>
  );
});
