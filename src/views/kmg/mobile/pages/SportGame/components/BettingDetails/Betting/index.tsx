import styles from './style.scss';
import {useMemo, useRef, useState} from 'react';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import classnames from 'classnames';
import BetGroupItem from '../BetGroupItem';
import {TMatch} from '@core/services/Table';
import DpIcon from '@views/kmg/mobile/components/Icon';

interface IProps {
  matchDetail: TMatch;
}

export function BettingContent({matchDetail}: IProps) {
  const swiperRef = useRef<SwiperRef>(null);
  const [gameTypeIndex, setGameTypeIndex] = useState(0);
  const [allOpen, setAllOpen] = useState(true);
  // 玩法统计
  const playStatistics = useMemo(() => {
    if (!matchDetail) return {};
    return matchDetail.playTypes?.reduce((a: {[key: number]: boolean}, b) => {
      b.playGroupIds?.forEach((pid: number) => {
        a[pid] = true;
      });
      return a;
    }, {});
  }, [matchDetail]);
  const playGroup = useMemo(() => {
    if (!matchDetail) return [];
    return matchDetail.playGroup.length ? [{name: '全部玩法', id: undefined}].concat(matchDetail.playGroup.filter((item) => playStatistics[item.id])) : [{name: '全部玩法', id: undefined}];
  }, [matchDetail]);
  const playList = useMemo(() => {
    if (!matchDetail) return [];
    const id = playGroup[gameTypeIndex]?.id;
    if (id === undefined) return matchDetail.playTypes;
    return matchDetail.playTypes.filter((item) => item.playGroupIds?.includes(id));
  }, [gameTypeIndex, matchDetail]);
  const onChangeSwiper = (idx: number) => {
    gameTypeIndex - idx > 0 ? swiperRef.current.swiper.slidePrev() : swiperRef.current.swiper.slideNext();
    setGameTypeIndex(idx);
  };
  return (
    <div className={styles.wrapper}>
      <div className="bet-type">
        <Swiper slidesPerView='auto' preventClicks={false} ref={swiperRef}>
          {playGroup.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div
                className={classnames('type-tab', {active: gameTypeIndex === idx})}
                onClick={() => onChangeSwiper(idx)}>
                {item.name}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='icon-wrap' onClick={() => setAllOpen((val) => !val)}>
          <DpIcon
            type='expand'
            className={classnames(`pointer ${allOpen ? 'open-all-matchs' : 'close-all-matchs'}`)}
          />
        </div>
      </div>
      <div className='bet-items'>
        {
          playList.map((item) => <BetGroupItem allOpen={allOpen} key={`${item.code}_${item.name}`} play={item} match={matchDetail} />)
        }
      </div>
    </div>
  );
}

export default BettingContent;
