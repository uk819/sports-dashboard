import {useInView} from 'react-intersection-observer';
import {ESportsCategory} from '@core/constants/enum/sport/sportsCategory';
import LeagueItemSwiper from './LeagueItemSwiper';
import {Swiper, SwiperSlide, SwiperProps} from 'swiper/react';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@constants/enum/mitt';
import useTheme from '@core/hooks/useTheme';
import classnames from 'classnames';
import {useMemo, useRef} from 'react';
import DpIcon from '@this/components/Icon';
import {LeagueItemPrps} from './../../type';

export default React.memo((props: LeagueItemPrps) => {
  const {itemData, sportId, initActiveIndex, setInitActiveIndex} = props;
  const actIndex = useRef(0);
  const swiperRef = React.useRef(null);
  const {emit} = useEventEmitter<TMitt['syncMethodsTab']>({mittName: 'syncMethodsTab', on: ({index}) => {
    swiperRef.current?.swiper?.slideTo(index);
  }});

  const handleSlideChange: SwiperProps['onSlideChange'] = (swiper: any) => {
    emit({index: swiper.realIndex, sportId});
  };
  const {ref, inView} = useInView();
  const {mobileTheme} = useTheme();
  const isNetGames = useMemo(()=>{
    return [ESportsCategory.LOL, ESportsCategory.DOTA, ESportsCategory.CSGO, ESportsCategory.KING].includes(sportId);
  }, [sportId]);

  const itemSessionRender = ()=> {
    actIndex.current=1;
    if (isNetGames) {
      // 展示几个swipeslide
      actIndex.current=0;
      return <SwiperSlide>
        <div className='item-session'>
          <div className="item-session_name"></div>
          <div className="item-session_name">全场</div>
          <div className="item-session_name"></div>
        </div>
      </SwiperSlide>;
    }
    if (sportId===ESportsCategory.TENNIS) {
      actIndex.current=1;
      return <>
        <SwiperSlide>
          <div className='item-session'>
            <div className="item-session_name">赛盘</div>
            <div className="item-session_name">总局数</div>
            <div className="item-session_name">第一盘</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='item-session'>
            <div className="item-session_name">第二盘</div>
            <div className="item-session_name">第三盘</div>
            <div className="item-session_name">第四盘</div>
          </div>
        </SwiperSlide>
      </>;
    }
    if (sportId===ESportsCategory.BASKETBALL) {
      actIndex.current=1;
      return <>
        <SwiperSlide>
          <div className='item-session'>
            <div className="item-session_name">全场</div>
            <div className="item-session_name">第一节</div>
            <div className="item-session_name">第二节</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='item-session'>
            <div className="item-session_name">第三节</div>
            <div className="item-session_name">第四节</div>
            <div className="item-session_name">加时</div>
          </div>
        </SwiperSlide>
      </>;
    }
    return <>
      <SwiperSlide>
        <div className='item-session'>
          <div className="item-session_name">全场</div>
          <div className="item-session_name">上半场</div>
          <div className="item-session_name">下半场</div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className='item-session'>
          <div className="item-session_name">角球</div>
          <div className="item-session_name">加时</div>
        </div>
      </SwiperSlide>
    </>;
  };


  const _itemContent = (item:any[])=> {
    return (
      <div className={classnames({'in-view': inView})}>
        <div className={classnames('league-wrapper')} onClick={()=> {
          props.toggleCollapseLeague(item[0].leagueId);
        }}>
          <div className="league-info">
            <span className="league-name ml-5">
              {item[0].ln}
            </span>
            <div className={classnames('actions')}>
              <DpIcon className={classnames('icon', {'icon-right': props.isCollapse.includes(String(item[0].leagueId))})} width={12} height={12} type="arrow" fill={mobileTheme.dpAncillary} />
            </div>
          </div>
        </div>
        <div className={classnames('item-content border-bottom')}>
          <div className= {classnames('swiperParent border-bottom match-box')}>
            <Swiper
              onSlideChange={handleSlideChange}
              ref={swiperRef}
              slidesPerView={1}
              pagination={{clickable: true}}
              followFinger={false}
              initialSlide={0}
              className='item-session-swiper'
            >
              {itemSessionRender()}
            </Swiper>
          </div>
          {
            item.map((data:any)=>{
              return <div className='item-bet border-bottom' key={data.mid}>
                <div className='item-time'>{data.bt}</div>
                <div className='item-detail'>
                  <div className='item-left'>
                    <div className='item-team'>{data.mn[0].title}</div>
                    <div className='item-team'>{data.mn[1].title}</div>
                  </div>
                  <div className="item-right">
                    <LeagueItemSwiper isNetGames={isNetGames} sportId={sportId} data={data} actIndex={actIndex.current} initActiveIndex={initActiveIndex} setInitActiveIndex={setInitActiveIndex}/>
                  </div>
                </div>
              </div>;
            })
          }
        </div>
      </div>
    );
  };

  // const _itemContentWangQiu = (item:any)=> {
  //   return (
  //     inView&&<div className='item-content border-bottom item-content-wangqiu'>
  //       <div className='item-session'>
  //         <div className="item-session_name">总局数</div>
  //         <div className="item-session_name">总盘数</div>
  //       </div>
  //       {
  //         item.map((data:any)=> {
  //           return <div className='item-bet border-bottom' key={data.mid}>
  //             <div className='item-time'>{data.bt}</div>
  //             <div className='item-detail'>
  //               <div className='item-left'>
  //                 <div className='item-team'>{data.mn[0].title}</div>
  //                 <div className='item-team'>{data.mn[1].title}</div>
  //               </div>
  //               {/* className='txt-red' */}
  //               <div className="item-right">
  //                 <div>{data?.details?.['total-games']?.[0] || 0}</div>
  //                 <div>{data?.details?.['set']?.[0] || 0}</div>
  //                 <div>{data?.details?.['total-games']?.[1] || 0}</div>
  //                 <div>{data?.details?.['set']?.[1] || 0}</div>
  //               </div>
  //             </div>
  //           </div>;
  //         })
  //       }
  //     </div>
  //   );
  // };

  return <div ref={ref}>
    {/* {sportId===ESportsCategory.TENNIS?_itemContentWangQiu(itemData):_itemContent(itemData)} */}
    {_itemContent(itemData)}
  </div>;
});
