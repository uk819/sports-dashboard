import {useEffect, useRef, useState} from 'react';
import {IconVideoNext, IconVideoPlay, IconVideoPrev} from '@views/kmg/desktop/components/Icon';
import viewOptions, {ValuedItemsProp} from '@core/constants/enum/sport/view-options';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import 'swiper/scss';
import styles from './style.scss';
import {Modal} from 'antd';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import {TGameResultFilteredDetailItem, TGameResultVideoItem} from '@core/apis/models/sport/get-game-result';
import Empty from '@views/kmg/desktop/components/Empty';
import {filterGameResult} from '@core/utils/gamesResult';
import usePublicState from '@core/hooks/usePublicState';
import classnames from 'classnames';
import {BET_RESULT_TYPE_MAP, ELoadingKeys} from '@core/constants/enum/sport';
import DpSkeleton from '@views/kmg/desktop/components/Skeleton';


const VideoPlayer = ({video, viewOptions, handlePlay}: {video: TGameResultVideoItem, viewOptions: ValuedItemsProp[], handlePlay: (url: string) => void}) => {
  return (
    <div className='video'>
      <div className="player">
        <span className="game-score">{video.score[0]} : {video.score[1]}</span>
        <img src={video.img} alt="等一下" />
        <div className='play-btn' onClick={() => handlePlay(video.url)}><IconVideoPlay /></div>
      </div>
      <div>{video.teamId}</div>
      <span>{video.time + ' ' + viewOptions[video.typeId]['label'] + ': ' + video.playerNo}</span>
    </div>
  );
};
export default React.memo(({mTeam, scores, sevenData}: { mTeam: Array<string>, scores: string| any, sevenData: any}) => {
  const {dispatch, ACTIONS} = usePublicState();
  const detailData = useSelector((state: TStore) => state.sport.display.gameResultDetail);
  const {sportId} = useSelector((state: TStore) => state.sport.userSettings.gameResultPageInfo);
  const {loading, toast} = useSelector((state: TStore) => state.base);
  const [activeOption, setActiveOption] = useState<number>(-1);
  const [matchedDetails, setMatchedDetails] = useState<TGameResultFilteredDetailItem[]>([]);
  const [matchedDetailsMap, setMatchedDetailsMap] = useState<any>({});
  const options = viewOptions(sportId);
  const swiperRef = useRef<SwiperRef>(null);
  const videoRef = useRef(null);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  const handlePlay = (url: string) => {
    setVideoURL(url);
    setPlayVideo(true);
  };
  const closeVideo = (e: React.MouseEvent) => {
    if (e.target !== videoRef.current) {
      setVideoURL(null);
      setPlayVideo(false);
    }
  };

  useEffect(() => {
    return (() => {
      dispatch(ACTIONS.SPORT.resetGameResultDetail());
    });
  }, []);

  useEffect(() => {
    const {results, resultsMap} = filterGameResult(_.filter(detailData.details, ((detail) => detail.ctid === activeOption || activeOption === -1)), mTeam, sportId);
    setMatchedDetails(results);
    setMatchedDetailsMap(resultsMap);
  }, [activeOption, detailData]);

  const handleSwip = (flag: number) => {
    const index = swiperRef.current.swiper.activeIndex;
    flag > 0 ? swiperRef.current.swiper.slideTo(index + 1) : swiperRef.current.swiper.slideTo(index - 1);
  };
  console.log(_.isEmpty(scores), 11111, scores);
  return (
    <div className={styles.wrapper}>
      <Modal
        open={playVideo}
        onCancel={closeVideo}
        footer={null}
        closeIcon={null}
        styles={{content: {padding: 0}}}
        centered
        destroyOnClose
      >
        <video style={{width: '-webkit-fill-available'}} src={videoURL} autoPlay ref={videoRef} />
      </Modal>
      {!!options.length && sportId === 1 && <div className="view-options">
        {options.map((option) => (
          <span
            key={option.value}
            className={activeOption === option.value ? 'active' : ''}
            onClick={() => setActiveOption(option.value)}>
            {option.label}
          </span>
        ))}
      </div>}
      {sportId === 5 && <>
        {_.isEmpty(scores) ? <div className='snooker-options'>
          <p className='title'>单局比分</p>
          <div className='content'>
            <div className="content-header">
              {
                [1, 2, 3, 4, 5, 6, 7].map((item: any, idx: number) => {
                  return <div className='header-item' key={idx}>
                    <p>{idx + 1}</p>
                  </div>;
                })
              }
            </div>
            <div className="content-detail">
              <div className='detail-item'>
                <p>{sevenData['first-round-goal'][0]}</p>
                <p>{sevenData['first-round-goal'][1]}</p>
              </div>
              <div className='detail-item'>
                <p>{sevenData['second-round-goal'][0]}</p>
                <p>{sevenData['second-round-goal'][1]}</p>
              </div>
              <div className='detail-item'>
                <p>{sevenData['third-round-goal'][0]}</p>
                <p>{sevenData['third-round-goal'][1]}</p>
              </div>
              <div className='detail-item'>
                <p>{sevenData['fourth-round-goal'][0]}</p>
                <p>{sevenData['fourth-round-goal'][1]}</p>
              </div>
              <div className='detail-item'>
                <p>{sevenData['fifth-round-goal'][0]}</p>
                <p>{sevenData['fifth-round-goal'][1]}</p>
              </div>
              <div className='detail-item'>
                <p>{sevenData['sixth-round-goal'][0]}</p>
                <p>{sevenData['sixth-round-goal'][1]}</p>
              </div>
              <div className='detail-item'>
                <p>{sevenData['seventh-round-goal'][0]}</p>
                <p>{sevenData['seventh-round-goal'][1]}</p>
              </div>
            </div>
          </div>
        </div> :
        <div className='snooker-options'>
          <p className='title'>单局比分</p>
          <div className='content'>
            <div className="content-header">
              {
                Object.keys(scores).map((item: any, idx: number) => {
                  return <div className='header-item' key={idx}>
                    <p>{idx + 1}</p>
                  </div>;
                })
              }
            </div>
            <div className="content-detail">
              {
                Object.keys(scores).sort((a, b) => Number(a) - Number(b)).map((item: any) => {
                  return (
                    <div className='detail-item' key={item}>
                      <p>{scores[item].split('-')[0]}</p>
                      <p>{scores[item].split('-')[1]}</p>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>}
      </>}
      {/* 视频显示 */}
      {detailData.videos && (
        <div className='view-videos'>
          {detailData.videos?.length > 8 && (
            <span className="backward-btn" onClick={() => handleSwip(0)}><IconVideoPrev /></span>
          )}
          <Swiper className='videos' slidesPerView={8} preventClicks={false} ref={swiperRef} >
            {detailData.videos.map((video, idx) => (
              <SwiperSlide key={idx}>
                <VideoPlayer video={video} viewOptions={options} handlePlay={handlePlay} />
              </SwiperSlide>
            ))}
          </Swiper>
          {detailData.videos?.length > 8 && (
            <span className='forward-btn' onClick={() => handleSwip(1)}><IconVideoNext /></span>
          )}
        </div>
      )}

      {(loading.display && loading.text === ELoadingKeys.GAME_RESULT_DETAIL) || (!loading.display && toast.types === 'info' && detailData.details.length && !matchedDetails.length && activeOption === -1) ? (
        <DpSkeleton type={ELoadingKeys.GAME_RESULT_DETAIL} length={3} />
      ) : !matchedDetails.length ? (
        // 暂无数据
        <div className='no-record'>
          <Empty description='暂无数据' type="record" />
        </div>
      ) : (
        // 具体信息显示
        <div className="view-details">
          {Object.keys(matchedDetailsMap).map((key, idx) => {
            return (
              <div key={idx} className="event">
                <div className='type-name'>{key}</div>
                <div className='type-value'>
                  {
                    matchedDetailsMap[key].map((item: any, index: number) => {
                      return <p key={item.h + index} className={(matchedDetailsMap[key].length === (index + 1) && (index + 1) % 2 === 1) ? '' : ''}>
                        <span>
                          {item.hoa}
                          <span className='has-value'>{item.h}</span>
                        </span>
                        <span className={classnames({win: item.r === BET_RESULT_TYPE_MAP[4] || item.r === BET_RESULT_TYPE_MAP[5]})}>{item.r}</span>
                      </p>;
                    })
                  }
                  {matchedDetailsMap[key].length % 2 ===1 &&<p></p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
