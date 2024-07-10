import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import classnames from 'classnames';
import DpIcon from '@views/kmg/desktop/components/Icon';
import DpEmpty from '@views/kmg/desktop/components/Empty';
import DpCollapse from '@views/kmg/desktop/components/Collapse';

import {useOddTransfer} from '@core/hooks/sports/useOddTransfer';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import Empty from '@views/kmg/desktop/components/Empty';
import {LockOutlined} from '@ant-design/icons';
import Medias from './Medias';
import {
  getAHScore,
  getNameByhoa, getPlayNameByKc, transferBoDan,
} from '@core/utils';
import styles from './style.scss';
import usePublicState from '@core/hooks/usePublicState';
import {PlayType, TOrder} from '@core/services/Table';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import {ESportType, EStaticsType} from '@core/constants/enum/sport';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';
import {Tooltip} from 'antd';

export default React.memo(() => {
  const container = useRef<HTMLDivElement>(null);
  // const {matchDetail} = useMatchDetail();
  const [gameTypeIndex, setGameTypeIndex] = useState(0);
  const [allOpen, setAllOpen] = useState(true);
  const {addAndRemoveOrder, orderTags} = useOrderCart();
  const {getViewOdd} = useOddTransfer();
  const {matchDetail, status} = useMatchDetail();
  const getBoDanList = useCallback(transferBoDan, [matchDetail?.playTypes]);
  const swiperRef = useRef<SwiperRef>(null);
  const [notInit, setNotInit] = useState(false);
  const {dispatch, ACTIONS} = usePublicState();
  const {getScoreByTypeId} = useMatchStatistics();
  const corner = getScoreByTypeId(EStaticsType.cornerKicks, matchDetail);

  useEffect(() => {
    if (!matchDetail) {
      if (notInit) {
        dispatch(ACTIONS.SPORT.updateDisplayZoomStatus(false));
      }
      return;
    }
    setNotInit(true);
    setGameTypeIndex(0);
    if (swiperRef.current) swiperRef.current.swiper?.slideTo(0);
  }, [matchDetail?.matchId, notInit]);

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

  const getRender = (item: PlayType) => {
    const kc = item.code;
    if (kc.endsWith('_OU')) {
      return (
        <div className="play-content">
          <div className="play-ou">
            <div className="item-head fw-500">
              <div />
              <div>大</div>
              <div>小</div>
            </div>
            {
              item.mks.map((market) => market.ops.length && (

                <div className={classnames('market-item')} key={market.mkId}>
                  <div className="label text-theme text-num">
                    {market.ops[0]?.betHandicap}
                  </div>
                  {
                    market.ops.map((bil) => (
                      <div className={classnames('odd-item', _.includes(orderTags, bil.tag) ? 'active' : '', bil.change, {disabled: !bil.available})} key={bil.id} onClick={() => addAndRemoveOrder(bil)}>
                        {
                      bil.locked ?
                        <LockOutlined /> :
                        bil.available ?
                          (
                            <span className="odd">
                              {getViewOdd(bil.od, bil.oddBetType)}
                            </span>
                          ) :
                          <span>-</span>
                        }

                      </div>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </div>
      );
    } else if (['HT_CS', 'FT_CS'].includes(kc)) {
      return (
        <div className="play-content">
          <div className="play-bd play-default">
            <div className="item-head fw-500">
              <div>{matchDetail.teams.home.name}</div>
              <div>平局</div>
              <div>{matchDetail.teams.away.name}</div>
            </div>
            <div className="bd-list">
              {
                getBoDanList(item.mks[0].ops.filter((bil) => bil.name !== 'AOS')).map((bil, bidx) => (bil ? <OddItem bil={bil} kc={item.code} key={bil?.id || bidx} /> : <div className="odd-item empty" key={bidx} />))
              }
            </div>
            <div className="other">
              {
                item.mks[0].ops.filter((bil) => bil.name === 'AOS').map((bil, bidx) =>
                bil ? (
                  <OddItem bil={{...bil, name: '其他', sportId: matchDetail.sportId}} kc={item.code} key={bil?.id || bidx} />
                ) : (
                  <div className='odd-item empty' key={bidx} />
                ),
                )}
            </div>
          </div>
        </div>
      );
    } else if (kc === 'FT_TTS') {
      return (
        <>
          <div className='play-title'>
            <div className='item-head fw-500'>
              <div className='text-center'>首个进球</div>
              <div className='text-center'>最后进球</div>
            </div>
          </div>
          <div className='play-default'>
            {item.mks.map((market) => (
              <div className="market-item r-2c" key={`${market.mkId}`}>
                {
                  market.ops.sort((a, b) => a.sortIndex - b.sortIndex).map((bil, idx) => (
                    <OddItem bil={bil} kc={item.code} key={bil?.id || idx} />
                  ))
                }
              </div>
            ))}
          </div>
        </>
      );
    } else {
      return (
        <div className="paly-content">
          <div className="play-default">
            {
              item.mks.map((market) => (
                <div className={classnames('market-item', {'r-2c': kc.startsWith('hdp_') || market.ops.length > 3, 'r-3c': kc === 'FT_HF'})} key={market.mkId}>
                  {
                    market.ops.sort((a, b) => a.sortIndex - b.sortIndex).map((bil, idx) => <OddItem bil={bil} kc={item.code} key={bil?.id || idx} showTeam />)
                  }
                </div>
              ))
            }
          </div>
        </div>
      );
    }
  };

  return (
    matchDetail ?
      (
        <div className={styles.wrapper} ref={container}>
          <Medias match={matchDetail} />
          <div className="play-type-list">
            <div className="list-wrapper">
              <Swiper
                slidesPerView="auto"
                preventClicks={false}
                ref={swiperRef}
              >
                {
                  playGroup.map((item, idx) => (
                    <SwiperSlide key={idx}>
                      <div className={classnames('type-tab', {active: gameTypeIndex === idx})} onClick={() => onChangeSwiper(idx)}>
                        {item.name}
                      </div>
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </div>
            <div className="icon-wrap" onClick={() => setAllOpen((val) => !val)}>
              <DpIcon type="expand" className={classnames(`pointer ${allOpen ? 'close-all-matchs' : 'open-all-matchs'}`)} />
            </div>
          </div>
          <div className="play-list">
            {
              playList.map((item: PlayType) => (
                <DpCollapse
                  allOpen={allOpen}
                  className={classnames('play-item', {'is-half': item.code.startsWith('HT_') || item.code.endsWith('SecondHalf')})}
                  header={(
                    <div className="play-name">
                      {
                        item.code.endsWith('SecondHalf') &&
                        <span className="second-half">下半场</span>
                      }
                      {
                        item.code.startsWith('HT_') &&
                        <span className="ht-half">上半场</span>
                      }
                      {getPlayNameByKc({code: item.code, name: item.name, ctid: item.ctid, sportId: matchDetail.sportId})}
                      {
                        matchDetail.isLive && item.code.endsWith('_AH') && matchDetail.sportId === ESportType.FOOTBALL &&
                        <>
                          {
                            item.ctid === 0 &&
                            <span className='ml-3'>
                              ({getAHScore(matchDetail.sportId, item.code, matchDetail)})
                            </span>
                          }
                          {
                            item.ctid === 1 &&
                            <span className='ml-3'>
                              ({corner[0]}-{corner[1]})
                            </span>
                          }
                        </>
                      }
                    </div>
                  )}
                  key={`${item.name}_${item.code}`}
                >
                  {
                    getRender(item)
                  }
                </DpCollapse>

              ))
            }
            {
              playList.length === 0 &&
            (
              <div className="pt-40">
                <Empty />
              </div>
            )
            }
          </div>
        </div>
      ) :
      <div className={styles.wrapper} ref={container}>
        {status === 'done' && <DpEmpty className="mt-40" />}
      </div>
  );
});

export function OddItem({bil, kc, showTeam}: { bil: TOrder, kc: string, showTeam?: boolean }) {
  const {addAndRemoveOrder, orderTags} = useOrderCart();
  const {getViewOdd} = useOddTransfer();
  const render = () => {
    if (bil.ended) {
      return (
        <>
          <div>
            {
              showTeam === true && bil.betTeam && bil.betTeam !== bil.name &&
              (
                <span>
                  {getNameByhoa(bil.betTeam)}
                </span>
              )
            }
            {
              bil.name &&
              (
                <span>
                  {getNameByhoa(bil.name, kc, bil)}
                </span>
              )
            }
          </div>
          <DpIcon type='win' active={bil.win === 1} />
        </>
      );
    } else if (bil.locked) {
      return <LockOutlined />;
    } else if (bil.available) {
      return <>
        <div className='flex align-center'>
          {
            showTeam === true && bil.betTeam && bil.betTeam !== bil.name && bil.betTeam != 'Over' && bil.betTeam != 'Under' &&
            (
              <span>
                {bil.tag.split(/-/)[1].endsWith('_AH') ? (bil.betTeam?.toUpperCase() === 'HOME' ? bil.teams.home.name : bil.teams.away.name) : getNameByhoa(bil.betTeam)}
              </span>
            )
          }
          {
            bil.name &&
            (
              <Tooltip title={getNameByhoa(bil.name, kc, bil)}>
                <span className={classnames('ml-3 odd-name', {'text-theme text-num': /^[+-]?[\d]+(?:\.\d+)?(?:[+\-*/]\d+(?:\.\d+)?)?$/.test(getNameByhoa(bil.name))})}>
                  {getNameByhoa(bil.name, kc, bil)}
                </span>
              </Tooltip>
            )
          }
        </div>
        <span className={classnames('odd', {locked: bil.available})}>
          {getViewOdd(bil.od, bil.oddBetType)}
        </span>
      </>;
    } else {
      return <span>-</span>;
    }
  };
  return (
    <div className={classnames('odd-item', {'active': _.includes(orderTags, bil.tag), 'disabled': !bil.available, 'justify-between': bil.ended}, bil.change)} key={bil.id} onClick={() => addAndRemoveOrder(bil)}>
      {
        render()
      }
    </div>
  );
}
