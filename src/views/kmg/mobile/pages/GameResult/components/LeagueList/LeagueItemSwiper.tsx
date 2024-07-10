import {Swiper, SwiperSlide, SwiperProps} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@constants/enum/mitt';
import {ESportsCategory} from '@core/constants/enum/sport/sportsCategory';
import classnames from 'classnames';
import css from './style.scss';
import {useState} from 'react';
import {LeagueItemPrps} from './../../type';


export default React.memo(({sportId, isNetGames, data, actIndex, setInitActiveIndex, initActiveIndex}: LeagueItemPrps) => {
  const swiperRef = React.useRef(null);
  const [activeIndex, setActiveIndex] = useState();
  const {emit} = useEventEmitter<TMitt['syncMethodsTab']>({mittName: 'syncMethodsTab', on: ({index}) => {
    swiperRef.current?.swiper?.slideTo(index);
    setActiveIndex(swiperRef?.current?.swiper?.activeIndex);
    setInitActiveIndex(swiperRef?.current?.swiper?.activeIndex);
  }});

  const handleSlideChange: SwiperProps['onSlideChange'] = (swiper: any) => {
    emit({index: swiper.realIndex, sportId});
  };

  const itemRightCon = ()=> {
    if (isNetGames) {
      return <SwiperSlide className={css.oddsWrapper}>
        <div className='item-right_main dianjing'>
          <div className='item-right_con'>{data?.details?.['final-goal']?.[0] || 0}</div>
          <div className='item-right_con'>{data?.details?.['final-goal']?.[1] || 0}</div>
        </div>
      </SwiperSlide>;
    }
    if (sportId===ESportsCategory.TENNIS) {
      return <>
        <SwiperSlide className={css.oddsWrapper}>
          <div className='item-right_main'>
            <div className='item-right_con'>{data?.details?.['set']?.[0] || 0}</div>
            <div className='item-right_con'>{data?.details?.['set']?.[1] || 0}</div>
            <div className='item-right_con'>{data?.details?.['total-games']?.[0] || 0}</div>
            <div className='item-right_con'>{data?.details?.['total-games']?.[1] || 0}</div>
            <div className='item-right_con'>{data?.details?.['first-round-goal']?.[0] || 0}</div>
            <div className='item-right_con'>{data?.details?.['first-round-goal']?.[1] || 0}</div>
          </div>
        </SwiperSlide>
        <SwiperSlide className={css.oddsWrapper}>
          <div className='item-right_main'>
            <div className='item-right_con'>{data?.details?.['second-round-goal']?.[0] || 0}</div>
            <div className='item-right_con'>{data?.details?.['second-round-goal']?.[1] || 0}</div>
            <div className='item-right_con'>{data?.details?.['third-round-goal']?.[0] || 0}</div>
            <div className='item-right_con'>{data?.details?.['third-round-goal']?.[1] || 0}</div>
            <div className='item-right_con'>{data?.details?.['fourth-round-goal']?.[0] || '-'}</div>
            <div className='item-right_con'>{data?.details?.['fourth-round-goal']?.[1] || '-'}</div>
          </div>
        </SwiperSlide>
      </>;
    }
    if (sportId===ESportsCategory.BASKETBALL) {
      return <>
        <SwiperSlide className={css.oddsWrapper}>
          <div className='item-right_main'>
            <div className='item-right_con'>{data?.details?.['full-time-goal']?.[0] || 0}</div>
            <div className='item-right_con'>{data?.details?.['full-time-goal']?.[1] || 0}</div>
            <div className='item-right_con'>{data?.details?.['first-round-goal']?.[0] || 0}</div>
            <div className='item-right_con'>{data?.details?.['first-round-goal']?.[1] || 0}</div>
            <div className='item-right_con'>{data?.details?.['second-round-goal']?.[0] || 0}</div>
            <div className='item-right_con'>{data?.details?.['second-round-goal']?.[1] || 0}</div>
          </div>
        </SwiperSlide>
        <SwiperSlide className={css.oddsWrapper}>
          <div className='item-right_main'>
            <div className='item-right_con'>{data?.details?.['third-round-goal']?.[0] || 0}</div>
            <div className='item-right_con'>{data?.details?.['third-round-goal']?.[1] || 0}</div>
            <div className='item-right_con'>{data?.details?.['fourth-round-goal']?.[0] || 0}</div>
            <div className='item-right_con'>{data?.details?.['fourth-round-goal']?.[1] || 0}</div>
            <div className='item-right_con'>{data?.details?.['over-time-goal']?.[0] || '-'}</div>
            <div className='item-right_con'>{data?.details?.['over-time-goal']?.[1] || '-'}</div>
          </div>
        </SwiperSlide>
      </>;
    }
    return <>
      <SwiperSlide className={css.oddsWrapper}>
        <div className='item-right_main'>
          <div className='item-right_con'>{data?.details?.['full-time-goal']?.[0] || 0}</div>
          <div className='item-right_con'>{data?.details?.['full-time-goal']?.[1] || 0}</div>
          <div className='item-right_con'>{data?.details?.['first-round-goal']?.[0] || 0}</div>
          <div className='item-right_con'>{data?.details?.['first-round-goal']?.[1] || 0}</div>
          <div className='item-right_con'>{data?.details?.['second-round-goal']?.[0] || 0}</div>
          <div className='item-right_con'>{data?.details?.['second-round-goal']?.[1] || 0}</div>
        </div>
      </SwiperSlide>
      <SwiperSlide className={css.oddsWrapper}>
        <div className='item-right_main'>
          <div className='item-right_con'>{data?.details?.['full-time-corner-kick']?.[0] || 0}</div>
          <div className='item-right_con'>{data?.details?.['full-time-corner-kick']?.[1] || 0}</div>
          <div className='item-right_con'>{data?.details?.['over-time-goal']?.[0] || 0}</div>
          <div className='item-right_con'>{data?.details?.['over-time-goal']?.[1] || 0}</div>
        </div>
      </SwiperSlide>
    </>;
  };

  return <>
    <Swiper
      onSlideChange={handleSlideChange}
      ref={swiperRef}
      modules={[Pagination]}
      slidesPerView={1}
      pagination={{clickable: true}}
      followFinger={false}
      initialSlide={initActiveIndex}
    >
      {itemRightCon()}
    </Swiper>
    {!!actIndex&&<span className={classnames(css.fy, {right: activeIndex===actIndex})}></span>}
  </>;
});
