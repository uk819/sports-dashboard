/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/SportTypeSelector/index.tsx
 * @Description:
 */

// import sportsCategory from '@constants/enum/sport/sportsCategory';
import {useEffect, useMemo, useRef} from 'react';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import TStore, {TMatchStatistic} from '@core/reducers/_reduxStore';
import 'swiper/scss';
import useSettings from '@core/hooks/sports/useSettings';
// import usePublicState from '@core/hooks/usePublicState';
import classnames from 'classnames';
import {useSelector} from 'react-redux';
import styles from './style.scss';
import DpIcon from '@views/kmg/desktop/components/Icon';
import {EESportType, EGameType} from '@core/constants/enum/sport';
import {Tooltip} from 'antd';

export default function() {
  // const {matchType} = useSelector((state: TStore) => state.sport.userSettings);
  const {matchStatistics: sportList} = useSelector((state: TStore) => state.sport.display);
  // const {dispatch, ACTIONS} = usePublicState();
  const {switchSportByType, switchGameType, sportId} = useSettings();

  // const list = useMemo(() => sportList.filter((item) => item[matchType] > 0), [matchType, sportList]);
  const list = useMemo(() => sportList.filter((item) => item.sportId !== 4), [sportList]);
  const swiperRef = useRef<SwiperRef>(null);
  // const history = useHistory();
  const handleScroll = (flag: number) => {
    const index = swiperRef.current.swiper.activeIndex;
    flag > 0 ? swiperRef.current.swiper.slideTo(index + 5) : swiperRef.current.swiper.slideTo(index - 5);
  };
  const isEsports = useMemo(() => {
    return sportId > 33;
  }, [sportId]);


  useEffect(()=> {
    if (!_.find(list, {sportId})?.sportShowSwitch&&!isEsports) {
      const newSportId = _.find(list, {sportShowSwitch: true});
      handleSwitchSport(newSportId.count, newSportId.sportId);
    }
  }, [sportList]);

  const handleSwitchSport = React.useCallback((count: number, newSportId: number) => {
    if (sportId === newSportId || (sportId > 33 && newSportId === EESportType.ALL)) {
      return;
    }
    // if (newSportId === 696969) {
    //   history.push('/esports');
    //   return;
    // }
    // if (isEsports && newSportId !== 696969) {
    //   history.push('/');
    //   sessionStorage.setItem('new_sport_id', newSportId.toString());
    //   return;
    // }
    // if (count === 0) {
    //   dispatch(ACTIONS.BASE.openToast({text: '暂无赛事', types: 'info'}));
    //   return;
    // }
    if (sportId <= 33 && newSportId === EESportType.ALL) {
      switchGameType(EGameType.ESPORTS, EESportType.LOL);
    } else if (sportId > 33 && newSportId !== EESportType.ALL) {
      switchGameType(EGameType.SPORTS, newSportId);
    } else {
      switchSportByType(newSportId);
    }
  }, [sportId]);

  // 赛中是否可用添加 早盘 滚球判断
  const isShow = (item: TMatchStatistic)=>{
    return item?.sportShowSwitch;
  };

  return (
    <div className={styles.wrapper}>
      {list.length > 16 && (
        <>
          <div className='prev' onClick={() => handleScroll(0)}>
            <DpIcon type='arrow' />
          </div>
          <div className='next' onClick={() => handleScroll(1)}>
            <DpIcon type='arrow' />
          </div>
        </>
      )}
      <Swiper slidesPerView='auto' preventClicks={false} ref={swiperRef}>
        {list.map((item) => (
          <SwiperSlide key={item.sportId}>
            {
              isShow(item) ?
              <div
                className={classnames('sport-type-item', {active: sportId === item.sportId || (item.sportId === 696969 && isEsports)})}
                onClick={() => handleSwitchSport(item.count, item.sportId)}
                key={item.sportId}>
                <div className={classnames('sport-logo', `sid-${item.sportId}`, {active: sportId === item.sportId || (item.sportId === 696969 && isEsports)})} />
                <span className='total'>{item.count}</span>
                <p>{item.sportId === 5 ? '斯诺克' : item.sportName}</p>
              </div> :
              <Tooltip title='即将开启，敬请期待'>
                <div
                  className={classnames('sport-type-item', {disabled: !isShow(item)})}
                  key={item.sportId}>
                  <div className={classnames('sport-logo', `sid-${item.sportId}`, {disabled: !isShow(item)})} />
                  <span className='total'>{item.count}</span>
                  <p>{item.sportId === 5 ? '斯诺克' : item.sportName}</p>
                </div>
              </Tooltip>
            }
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
