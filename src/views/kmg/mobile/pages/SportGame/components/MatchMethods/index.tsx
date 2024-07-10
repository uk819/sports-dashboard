/*
 * @Author: Galen.GE
 * @Date: 2024-01-18 15:51:00
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/MatchMethods/index.tsx
 * @Description:
 */
import {TMatch} from '@core/services/Table';
import {Tooltip} from 'antd';
import useFavorites from '@core/hooks/sports/useFavorites';
import CountdownLite from '@this/pages/SportGame/components/CountdownLite';
// import BetGroupItem from '@this/pages/SportGame/components/BettingDetails/BetGroupItem';
import Odds from './Odds';
import SubOdds from './Odds/SubOddsItem';
import style from './style.scss';
import DpIcon from '@views/kmg/mobile/components/Icon';
import {getMatchStatusByPeriod} from '@core/utils';
import usePublicState from '@core/hooks/usePublicState';
import {useSelector} from 'react-redux';
import IStore from '@core/reducers/_reduxStore.d';
import dayjs from 'dayjs';
import {filterDownPlay} from '@core/utils';
import classnames from 'classnames';
import {useOtherScoreIds} from '@core/constants/enum/sport';
import {useState} from 'react';
import useTheme from '@core/hooks/useTheme';

interface IMatchMethodsProps {
  match: TMatch;
  actIndex?: number;
  inMainList?: boolean;
  isUnfoldBownBtn?: any;
  setIsUnfoldBownBtn?: any;
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

export default ({match, actIndex, inMainList, setIsUnfoldBownBtn, isUnfoldBownBtn}: IMatchMethodsProps) => {
  const playMethod = filterDownPlay(match, _ctids);
  const {dispatch, ACTIONS} = usePublicState();
  const {mobileTheme} = useTheme();
  const {isFavorite, onToggleFavorite} = useFavorites();
  const [toggleBtn, setToggleBtn] = useState(isUnfoldBownBtn);
  const {matchListUpdateTime} = useSelector((state: IStore) => state.sport.display);
  const handleOpenDetail = () => {
    dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: match.matchId}));
    dispatch(ACTIONS.SPORT.switchVisiabelByDetail(true));
  };
  const [subCtid, setSubCtid] = useState(function() {
    for (const key in isUnfoldBownBtn) {
      if (isUnfoldBownBtn[key].toggle) {
        return isUnfoldBownBtn[key].ctid;
      }
    }
  });

  const handleToggleBtn =(type: toggleBtnType = 'jiaoqiu')=>{
    const btnInfo = {
      'jiaoqiu': {ctid: 1, toggle: false},
      'bodan': {ctid: 0, toggle: false},
      'fapai': {ctid: 2, toggle: false},
    };
    if (subCtid===btnInfo[type].ctid) {
      btnInfo[type].toggle= !toggleBtn[type].toggle;
    } else {
      btnInfo[type].toggle= true;
    }
    setToggleBtn(btnInfo);
    setIsUnfoldBownBtn(btnInfo);
    setSubCtid(btnInfo[type].ctid);
  };

  // 某个比赛类型没了， 收起下方数据展示
  const isUnfold = React.useMemo(()=> {
    return Object.values(toggleBtn).some((tggle: any)=> tggle.toggle&&_.find(playMethod, {ctid: tggle.ctid}));
  }, [toggleBtn, playMethod.length]);

  return (
    <div className={style.wrapper}>
      {
        <>
          <div className="phase" onClick={handleOpenDetail}>
            <div className="flex items-center">
              <DpIcon className='mr-4' type="collect" active={isFavorite([match.matchId])} onClick={(e) => onToggleFavorite(e, [match.matchId])} />
              {
                match.matchClock.isRunning ? <>
                  <span className="mr-4">
                    {getMatchStatusByPeriod(match.matchClock.period)}
                  </span>
                  {
                    (match.matchClock.period !== 'HT' && match.matchClock.period !== 'FT' && match.matchClock.second > 0) && match.sportId === 1 ?
                    <CountdownLite seconds={match.matchClock.second} key={`${match?.matchId}_${match.matchClock.second}_${matchListUpdateTime}`} /> :
                    <span>{match.matchClock.playTime}</span>
                  }
                </> : <span>{dayjs(match.matchClock.startTime).format('MM月DD日 HH:mm')}</span>
              }
            </div>
            <span className='fs-10 flex items-center'>
              {match.playTypeCount}+
              <DpIcon className='ml-2' type='arrow' direction='right' width={9} height={10} fill={mobileTheme.dpNormal} />
            </span>
          </div>
          <div className="match-info">
            <div
              className="infos"
              onClick={handleOpenDetail}
            >
              <div className="team-list">
                <div className='team'>
                  <div className='team-name'>
                    <span>
                      {match.teams.home.name}
                    </span>
                    {match.score.homeRedCard > 0 && <span className="red-card">{match.score.homeRedCard}</span>}
                  </div>
                  <span>{!!match.matchClock.period && ((useOtherScoreIds.includes(match.sportId) ? match.score.otherScore?.set?.h : match.score.home) ?? '')}</span>
                </div>
                <div className='team'>
                  <div className="team-name">
                    <span>
                      {match.teams.away.name}
                    </span>
                    {match.score.awayRedCard > 0 && <span className="red-card">{match.score.awayRedCard}</span>}
                  </div>
                  <span>{!!match.matchClock.period && ((useOtherScoreIds.includes(match.sportId) ? match.score.otherScore?.set?.a : match.score.away) ?? '')}</span>
                </div>
              </div>
              <div className='media'>
                <div className="media-list">
                  {
                    <DpIcon className='mr-4' type='live' active={match.hasVideo} />
                  }
                  {
                    <DpIcon className='mr-4' type='animate' active={match.hasAnimate} />
                  }
                  {
                    match.hasCorner &&
                    <img style={{width: '18px'}} src={require('@this/assets/images/common/ico_cornerkick.png')} />
                  }
                </div>
                <div className='total-count'>
                  {
                    match.competitionType &&
                    <div className="competition-type">{match.competitionType}</div>
                  }
                </div>
              </div>
            </div>
            <div className="odds">
              <Odds inMainList={inMainList} actIndex={actIndex} sportId={match.sportId} mks={match.playTypes} />
            </div>
          </div>

          {match.sportId===1&&playMethod.length>0&&<div className={classnames('match-info', 'match-info-sub')}>
            <div
              className="infos"
            >
              <div className='btn-list'>
                {playMethod.map((item:TPlayMethodItem)=> <div key={item.type} className={classnames('btn', {active: toggleBtn[item.type as toggleBtnType].toggle})} onClick={()=> handleToggleBtn(item.type as toggleBtnType)}>
                  <span>{item.name}</span>
                  <DpIcon type='arrow' fill={toggleBtn[item.type].toggle?mobileTheme.dpTheme:mobileTheme.dpAncillary} className={classnames(`arrow ${toggleBtn[item.type as toggleBtnType].toggle ? 'open-all-matchs' : 'close-all-matchs'}`)} />
                </div>)}
              </div>
              {isUnfold&&<div className='teamName'>
                <div className={classnames('team-name flex')} onClick={handleOpenDetail}>
                  <Tooltip title={match.teams.home.name} placement='top'>
                    {match.teams.home.name}
                  </Tooltip>
                  {subCtid === 1 && match.isLive && <span>{match.score.homeCorner}</span>}
                </div>
                <div className={classnames('team-name flex')} onClick={handleOpenDetail}>
                  <Tooltip title={match.teams.away.name} placement='top'>
                    {match.teams.away.name}
                  </Tooltip>
                  {subCtid === 1 && match.isLive && <span>{match.score.awayCorner}</span>}
                </div>
              </div>
              }
            </div>
            {isUnfold&&<div className="odds">
              <SubOdds inMainList={inMainList} actIndex={actIndex} sportId={match.sportId} mks={match.playTypes} ctid={subCtid} isbodan={toggleBtn.bodan.toggle} />
            </div>}
          </div>}
        </>
      }
    </div>
  );
};
