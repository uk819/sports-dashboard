/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MatchItem/index.tsx
 * @Description:
 */
import {useLatest, useUpdateEffect} from 'react-use';
import {useInView} from 'react-intersection-observer';
import classnames from 'classnames';
import {useSelector} from 'react-redux';
import {PlayType, TMatch} from '@core/services/Table';
import {Tooltip} from 'antd';
import useEventEmitter from '@core/hooks/useEventEmitter';
import MatchInfos from './MatchInfos';
import BettingOdds from './BettingOdds';
import DpIcon from '@views/kmg/desktop/components/Icon';
import {getPlayListBySid, transforMarkets, getPlayListBySidSub, transferBoDan, filterDownPlay} from '@core/utils';
import {TMitt} from '@constants/enum/mitt';
import IStore from '@core/reducers/_reduxStore';
import {EGameBettingType, ESportType} from '@constants/enum/sport';
import {OddItem} from './../MatchDetail';
import styles from './style.scss';
import useZoomMatch from '@core/hooks/sports/useZoomMatch';

interface IProps{
  match: TMatch
  matchWithState: TMatch[]
  gameBettingType: any
  gameNames: string[]
}

type toggleBtnType='jiaoqiu'|'bodan'|'fapai';
interface TPlayMethodItem{
  name: string
  type: toggleBtnType
  hasData: boolean
  ctid: number
}

const _ctids = {
  'jiaoqiu': 1,
  'bodan': 0,
  'fapai': 2,
};

export default React.memo(({match, matchWithState, gameBettingType, gameNames}: IProps) => {
  const gameList = getPlayListBySid(match.sportId);
  const playMethod = filterDownPlay(match, _ctids);
  const [gameListSub, setGameListSub] = React.useState(getPlayListBySidSub(match.sportId));
  const [computedDivHeight, setComputedDivHeight] = React.useState<string|number>(match.sportId===1&&playMethod.length?158+'px':120+'px');
  const {openZoom} = useZoomMatch();
  const {ref, inView} = useInView({
    threshold: 0,
    onChange(_, entry) {
      setComputedDivHeight(entry?.boundingClientRect.height||158+'px');
    },
  });
  const currentMatchId = useSelector((state: IStore) => state.sport.display.currentMatchId);
  const markets: (undefined | PlayType)[] = transforMarkets(match, gameList);


  const [selected, setSelected] = React.useState<TMitt['syncMediaSelected']['selected'] | null>(null);
  const useLatestMatch = useLatest(match);
  const [unfold, setUnfold] = React.useState(false);
  // 角球ctid1 罚牌DoubleChance2

  const [subMarkets, setSubMarkets] = React.useState<(undefined | PlayType)[]>(transforMarkets(match, gameListSub, 1));
  const [subBtnActives, setSubBtnActives] = React.useState({
    'jiaoqiu': 0,
    'bodan': 0,
    'fapai': 0,
  });
  const [subCtid, setSubCtid] = React.useState(1);
  const typeName = React.useMemo(()=> {
    return playMethod.filter((item:TPlayMethodItem)=> subBtnActives[item?.type]===1);
  }, [playMethod, subBtnActives]);

  const {emit} = useEventEmitter<TMitt['syncMediaSelected']>({mittName: 'syncMediaSelected', on: (data) => {
    // if (data.matchId !== useLatestMatch.current.matchId) {
    //   setSelected(null);
    //   return;
    // }
    if (data.matchId !== useLatestMatch.current.matchId) return setSelected(null);
    setSelected(data.selected);
  }});

  useUpdateEffect(()=>{
    // 某个比赛类型没了， 收起下方数据展示
    if (!_.find(playMethod, {ctid: subCtid})) {
      setUnfold(false);
    }
  }, [playMethod.length]);

  const handleSelect = React.useCallback((selected: TMitt['syncMediaSelected']['selected']) => {
    emit({matchId: match.matchId, selected});
    setSelected(selected);
  }, [currentMatchId]);

  const handleToggleBtn =(type: toggleBtnType)=>{
    const toggleBtn = {
      'jiaoqiu': 0,
      'bodan': 0,
      'fapai': 0,
    };
    toggleBtn[type]=1;
    setSubBtnActives(toggleBtn);
    setSubCtid(_ctids[type]);
    setGameListSub(getPlayListBySidSub(_ctids[type]));
    setSubMarkets(transforMarkets(match, getPlayListBySidSub(_ctids[type]), _ctids[type]));
    setUnfold(true);
  };

  const handleArrow =() => {
    if (Object.values(subBtnActives).find((item) => item===1)) {
      setUnfold(!unfold);
      setComputedDivHeight(158+'px');
    } else {
      handleToggleBtn(playMethod[0]?.type as 'jiaoqiu'|'bodan'|'fapai' || 'jiaoqiu');
    };
  };

  React.useEffect(()=> {
    setSubMarkets(transforMarkets(match, gameListSub, subCtid));
  }, [match]);

  React.useEffect(()=> {
    setComputedDivHeight(158+'px');
  }, [subCtid]);

  const bodanRender = React.useCallback((subMarkets: (undefined | PlayType)[])=> {
    return subMarkets.map((market, mdx) =>{
      return market?.mks[0]?.ops?<div className='play-content' key={mdx}>
        <div className='play-bd play-default'>
          <div className={classnames('bd-list', {'bd-list_bg': !mdx})}>
            {transferBoDan(market?.mks[0]?.ops.filter((bil) => bil.name !== 'AOS')).map((item, bidx) =>
              (
                <OddItem bil={{...item, sportId: match.sportId}} kc={market.code} key={item?.id || bidx} />
              ),
            )}
          </div>
          <div className="other">
            {
              market?.mks[0]?.ops.filter((bil) => bil.name === 'AOS').map((bil, bidx) =>
              bil ? (
                <OddItem bil={{...bil, name: '其他', sportId: match.sportId}} kc={market.code} key={bil?.id || bidx} />
              ) : (
                <div className='odd-item empty' key={bidx} />
              ),
              )}
          </div>
        </div>
      </div>:<div className={classnames('oddItemEmpty', {'oddItemEmpty_bg': !mdx})}>
        {(new Array(9).fill('-')).map((item, indx)=> <span key={indx}>{item}</span>)}
      </div>;
    });
  }, [transferBoDan, subMarkets]);


  const subClassifyContentRender = React.useCallback(()=> {
    // (matchWithState.some((item) => item.sportId > 33) && gameBettingType === EGameBettingType.ADVANCED) &&
    return <div className='subClassifyContent'>
      {
        (gameBettingType === EGameBettingType.ADVANCED) &&
        <div className="match-title border-bottom border-top">
          <div className="events-tools">
            {
              subBtnActives['bodan']!==1?gameNames.map((item) => (
                <div className="game-name" key={item}>{item}</div>
              )):subMarkets.map((market, midx) => {
                return <>
                  <div className="game-name">{market?.mks[0]?.ops[0]?.teams.home.name}</div>
                  <div className="game-name">{market?.code==='FT_CS'?'全场平局':market?.mks[0]?.ops[0]?.teams.home.name&&'半场平局'}</div>
                  <div className="game-name">{market?.mks[0]?.ops[0]?.teams.away.name}</div>
                </>;
              })
            }
          </div>
        </div>
      }
      <div className='teamName'>
        <div className={classnames('team-name', {'text-red text-bold': match.teams.home.isHandicap})} onClick={() => openZoom(match.matchId)}>
          <Tooltip title={match.teams.home.name} placement='top'>
            {match.teams.home.name}
            {
              match.isLive && typeName[0]?.name === '角球' ? <span className='ml-10'>{`${match.score.homeCorner}`}</span> : `-${typeName[0]?.name}`
            }
          </Tooltip>
          {match.score.homeRedCard > 0 && <span className="red-card">{match.score.homeRedCard}</span>}
        </div>
        <div className={classnames('team-name', {'text-red text-bold': match.teams.away.isHandicap})} onClick={() => openZoom(match.matchId)}>
          <Tooltip title={match.teams.away.name} placement='top'>
            {match.teams.away.name}
            {
              match.isLive && typeName[0]?.name === '角球' ? <span className='ml-10'>{`${match.score.awayCorner}`}</span> : `-${typeName[0]?.name}`
            }
          </Tooltip>
          {match.score.awayRedCard > 0 && <span className="red-card">{match.score.awayRedCard}</span>}
        </div>
      </div>
      {!subBtnActives.bodan?<BettingOdds markets={subMarkets} sportId={match.sportId} gameList={gameListSub} />: bodanRender(subMarkets)}
    </div>;
  }, [matchWithState, match, subMarkets, gameNames]);


  return (
    <div className={classnames(styles.match_item, {'active': currentMatchId === match.matchId, 'noSubPlayMethod': !playMethod.length||match.sportId!==ESportType.FOOTBALL})} ref={ref} style={{minHeight: !playMethod.length||match.sportId!==ESportType.FOOTBALL ? undefined : computedDivHeight}}>
      {
        inView &&
        <>

          <MatchInfos match={match} playMethod={!playMethod.length}/>
          <BettingOdds markets={markets} sportId={match.sportId} gameList={gameList} />

          <div className="video-list">
            <Tooltip title="比分板" placement="top">
              <div className="pointer" onClick={() => handleSelect('score')}>
                <DpIcon type="score" active={selected === 'score'} />
              </div>
            </Tooltip>
            {
              match.isLive && match.hasVideo &&
              <Tooltip title="视频源" placement="top">
                <div className="pointer" onClick={() => handleSelect('video')}>
                  <DpIcon type="video" active={selected === 'video'} />
                </div>
              </Tooltip>
            }
            {
              match.hasAnimate &&
              <Tooltip title="动画直播" placement="top">
                <div className="pointer" onClick={() => handleSelect('animation')}>
                  <DpIcon type="animation" active={selected === 'animation'} />
                </div>
              </Tooltip>
            }
          </div>
          {match.sportId===1&&playMethod.length>0&&<div className={classnames('subClassify', {'bottomLine': unfold})}>
            <div className='arrow' onClick={handleArrow}> <div className={classnames(`open-icon ${unfold ? 'open' : ''}`)} /></div>
            {playMethod.map((item)=> <div key={item.type} className={classnames('btn', {'active': subBtnActives[item.type as toggleBtnType]})} onClick={()=>handleToggleBtn(item.type as toggleBtnType)}>{item.name}</div>)}
          </div>}
          {unfold&&subClassifyContentRender()}
        </>
      }
    </div>
  );
});

