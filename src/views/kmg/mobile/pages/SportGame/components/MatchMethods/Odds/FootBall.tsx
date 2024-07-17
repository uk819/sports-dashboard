/*
 * @Author: Galen.GE
 * @Date: 2024-01-18 18:35:26
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/MatchMethods/Odds/FootBall.tsx
 * @Description:
 */
import {useSelector} from 'react-redux';
import {transferBoDan} from '@core/utils';
import {Swiper, SwiperSlide, SwiperProps} from 'swiper/react';
import {getPlayTypesBySportId} from '@core/constants/enum/sport/betTypes';
import {PlayType} from '@core/services/Table';
import {ESportsCategory} from '@constants/enum/sport/sportsCategory';
import {LockItem, OddItem, EmptyOddItem} from './OddsItem';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@constants/enum/mitt';
import TStore from '@core/reducers/_reduxStore.d';
import css from './style.scss';
import {Pagination} from 'swiper/modules';
import classnames from 'classnames';

interface IProps {
  data: PlayType[];
  actIndex: number;
  isbodan?: boolean;
}
export default ({data, actIndex, isbodan=false}: IProps) => {
  const currentOddType = useSelector((state: TStore) => state.user.currentOddType);
  const playTypes = getPlayTypesBySportId(ESportsCategory.FOOTBALL);
  const swiperRef = React.useRef(null);

  const {emit} = useEventEmitter<TMitt['syncMethodsTab']>({mittName: 'syncMethodsTab', on: ({index, sportId}) => {
    if (sportId === ESportsCategory.FOOTBALL) {
      swiperRef.current.swiper?.slideTo(index);
    };
  }});

  const handleSlideChange: SwiperProps['onSlideChange'] = (swiper: any) => {
    emit({index: swiper.realIndex, sportId: ESportsCategory.FOOTBALL});
  };


  return (
    <>
      <Swiper
        onSlideChange={handleSlideChange}
        ref={swiperRef}
        modules={[Pagination]}
        pagination={{clickable: true}}
        followFinger={false}
        initialSlide={actIndex || 0}
      >
        {
          !isbodan? _.chunk(playTypes, 3).map((playTypeGroup, index) =>
            <SwiperSlide key={index} className={css.oddsWrapper}>
              {
                playTypeGroup.map((item, idx) =>
                  <div key={item}>
                    { !_.find(data, {code: item}) && <LockItem col={idx === 0 ? 3 : 2} /> }
                    {
                      _.find(data, {code: item}) &&
                      _.find(data, {code: item}).mks[0]?.ops?.map((op) =>
                        <OddItem isInList={true} key={op.id} op={op} oddType={currentOddType} methodCode={item} />,
                      )
                    }
                  </div>,
                )
              }
            </SwiperSlide>,
          ):
          data.map((play, indx)=>
            <SwiperSlide key={indx} className={classnames(css.oddsWrapper, 'bodan-swiper')}>
              <div className="bd-list bodan-list">
                <div className="game-name">{play?.mks[0]?.ops[0]?.teams.home.name}</div>
                <div className="game-name">{play?.code==='FT_CS'?'全场平局':'半场平局'}</div>
                <div className="game-name">{play?.mks[0]?.ops[0]?.teams.away.name}</div>
              </div>
              <div className="bd-list">
                {transferBoDan(play?.mks[0].ops||[]).map((bil:any, idx) => bil&&!bil.temporaryValue? <OddItem key={bil.id} op={bil} oddType={currentOddType} methodCode={play.code} /> : <EmptyOddItem key={idx} />)}
              </div>
            </SwiperSlide>,
          )
        }
      </Swiper>
      <span className={classnames(css.fy, {right: actIndex === 1})}></span>
    </>
  );
};
