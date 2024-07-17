import Overlay from '@template/components/Overlay';
import DetailHead from './components/detailHead';
import style from './style.module.scss';
import {useEffect, useMemo, useRef} from 'react';
import {useState} from 'react';
import ResultItem from './components/resultItem';
import {useGameResultListData} from '@core/hooks/sports/useRenderData';
import TStore from '@core/reducers/_reduxStore';
import {useSelector} from 'react-redux';
import {filterGameResult} from '@core/utils/gamesResult';
import Empty from '@core/templates/mobile/components/Empty';

interface Props {
  sportId?: number;
}

const GroupDetail = ({sportId}: Props) => {
  const [index, setIndex] = useState(0);
  const detailData = useSelector((state: TStore) => state.sport.display.gameResultDetail);
  const {isDetail, closeDetail, curMatch} = useGameResultListData();
  const [matchedDetailsMap, setMatchedDetailsMap] = useState<any>({});
  const [showAll, setShowAll] = useState(true);
  const itemRef = useRef(null);
  useEffect(() => {
    console.log(detailData.details, curMatch?.mn[0].title, curMatch?.mn[1].title);
    const {resultsMap} = filterGameResult(detailData.details, [curMatch?.mn[0].title, curMatch?.mn[1].title], sportId);
    setMatchedDetailsMap(resultsMap);
  }, [detailData, curMatch, sportId]);
  const tabs = useMemo(() => {
    return [
      {idx: 0, title: '全部赛果'},
      // {idx: 1, title: '热门推荐'},
    ];
  }, []);
  return (
    <Overlay display={isDetail} zIndex={1000} close={closeDetail}>
      <div className={style.wrapper}>
        <DetailHead
          close={() => closeDetail()}
          sportId={sportId}
        />
        <div className={style.tab}>
          {tabs.map((tab) => (
            <div
              className={tab.idx === index ? style.active : style.nonActive}
              key={tab.idx}
              onClick={() => setIndex(tab.idx)}
            >
              {tab.title}
            </div>
          ))}
          <div className={style.control}>
            {!showAll ? (
              <img onClick={() => setShowAll(true)} src={require('./i/down1.png')} alt="" />
            ) : (
              <img onClick={() => setShowAll(false)} src={require('./i/top.png')} alt="" />
              )}
          </div>
        </div>
        {index === 0 ? (
          <div className={style.result}>
            {Object.keys(matchedDetailsMap).length > 0 ? Object.keys(matchedDetailsMap).map((key, idx) => (
              <ResultItem itemRef={idx === 0 ? itemRef : null} showAll={showAll} key={idx} data={matchedDetailsMap[key]} title={key} />
            )) : (
              <Empty />
            )}
          </div>
        ) : (
          <Empty />
          // <div className={style.favorite}>
          //   <div className={style.item}>
          //     <div className={style.date}>2024-05-30 06:30</div>
          //     <div className={style.content}>
          //       <div className={style.teams}>
          //         <div className={style.team}>
          //           <div className={style.logo}>
          //             <img src={require('./i/logo1.png')} alt="" />
          //           </div>
          //           <div className={style.name}>主场球队名称主场球队名称主场主场球队名称主场球队名称主场</div>
          //         </div>
          //         <div className={style.team}>
          //           <div className={style.logo}>
          //             <img src={require('./i/logo1.png')} alt="" />
          //           </div>
          //           <div className={style.name}>主场球队名称主场球队名称主场主场球队名称主场球队名称主场</div>
          //         </div>
          //       </div>
          //       <div className={style.status}>
          //         <div className={style.block}>
          //           <p className={style.prop}>主-1.5</p>
          //           <p className={style.val}>1.01</p>
          //         </div>
          //         <div className={style.block}>
          //           <p className={style.prop}>主+1.5</p>
          //           <p className={style.val}>0.98</p>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // </div>
        )}
        <div className={style.gotoTop} onClick={() => itemRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})}>
          <img src={require('./i/gotoTop.png')} alt="" />
        </div>
      </div>
    </Overlay>
  );
};

export default GroupDetail;
