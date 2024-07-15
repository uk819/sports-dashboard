import {useMemo, useState} from 'react';
import style from '../style.module.scss';
import classnames from 'classnames';
import {useGameResultListData} from '@core/hooks/sports/useRenderData';
import LeagueList from './leagueList';
import usePublicState from '@core/hooks/usePublicState';
import {TMatchDetail} from '@core/apis/models/sport/get-match-list';
import {getMatchStatusByPeriod} from '@core/utils';
interface Props {
  close: () => void;
  sportId: number;
}
const DetailHead = React.memo(({close, sportId}: Props) => {
  const {curMatch, updateDetail} = useGameResultListData();
  const [showLeague, setShowLeague] = useState(false);
  const [match, setMatch] = useState(null);
  const {dispatch, ACTIONS} = usePublicState();
  const getMatchDetailData = ()=>{
    dispatch(ACTIONS.SPORT.getMatchDetail({
      params: {matchId: curMatch.mid},
      cb: (res: { data: TMatchDetail }) => {
        const item = res.data;
        setMatch(item);
      },
    }));
  };
  React.useEffect(()=>{
    if (_.isEmpty(curMatch)) return;
    getMatchDetailData();
    console.log(curMatch, 11111);
  }, [curMatch]);
  const bgName = useMemo(() => {
    switch (sportId) {
      case 1:
        return style.football;
      case 2:
        return style.basket;
      case 3:
        return style.volleyball;
      case 18:
        return style.baseball;
      case 19:
        return style.badminton;
      case 23:
        return style.pingpong;
      case 9:
        return style.rugby;
      case 11:
        return style.handball;
      case 12:
        return style.iceHockey;
      case 16:
        return style.american;
      default:
        return style.football;
    }
  }, [sportId, curMatch]);

  const totalScore = useMemo(() => {
    if (sportId> 34) {
      return (
        <p className={style.score}>{`${curMatch.details?.['final-goal']?.[0] !== '-' ? curMatch.details?.['final-goal']?.[0] : 0}-${curMatch.details?.['final-goal']?.[1] !== '-' ? curMatch.details?.['final-goal']?.[1] : 0}`}</p>
      );
    }
    switch (sportId) {
      case 3:
        return (
          <p className={style.score}>{`${curMatch.details?.['total-games']?.[0]}-${curMatch.details?.['total-games']?.[1]}`}</p>
        );
      case 18:
        return (
          <p className={style.score}>{`${curMatch.details?.['final-goal']?.[0] !== '-' ? curMatch.details?.['final-goal']?.[0] : 0}-${curMatch.details?.['final-goal']?.[1] !== '-' ? curMatch.details?.['final-goal']?.[1] : 0}`}</p>
        );
      case 23: case 6:
        return (
          <p className={style.score}>{`${curMatch.details?.['game-score']?.[0] !== '-' ? curMatch.details?.['game-score']?.[0] : 0}-${curMatch.details?.['game-score']?.[1] !== '-' ? curMatch.details?.['game-score']?.[1] : 0}`}</p>
        );
      case 12:
        return (
          <p className={style.score}>{`${curMatch.details?.['final-goal']?.[0] !== '-' ? curMatch.details?.['final-goal']?.[0] : 0}-${curMatch.details?.['final-goal']?.[1] !== '-' ? curMatch.details?.['final-goal']?.[1] : 0}`}</p>
        );
      default:
        return (
          <p className={style.score}>{`${curMatch.details?.['full-time-goal']?.[0]}-${curMatch.details?.['full-time-goal']?.[1]}`}</p>
        );
    }
  }, [sportId, curMatch]);

  const statusBar = useMemo(() => {
    switch (sportId) {
      case 1:
        return (
          <div className={style.scorePan}>
            <p>{`半${curMatch.details?.['first-round-goal']?.[0]}-${curMatch.details?.['first-round-goal']?.[1]}`}</p>
            <p>{`全${curMatch.details?.['full-time-goal']?.[0]}-${curMatch.details?.['full-time-goal']?.[1]}`}</p>
            <p>{`加时${curMatch.details?.['over-time-goal']?.[0]==='-' ? 0 : curMatch.details?.['over-time-goal']?.[0]}-${curMatch.details?.['over-time-goal']?.[1] === '-' ? 0 : curMatch.details?.['over-time-goal']?.[1]}`}</p>
            <p>{`点球${curMatch.details?.['penalty-kick']?.[0]==='-' ? 0 : curMatch.details?.['penalty-kick']?.[0]}-${curMatch.details?.['penalty-kick']?.[1] === '-' ? 0 : curMatch.details?.['penalty-kick']?.[1]}`}</p>
            <p><div><img src={require('../i/corner.png')} alt="" /></div>{`角球${curMatch.details?.['full-time-corner-kick']?.[0]==='-' ? 0 : curMatch.details?.['full-time-corner-kick']?.[0]}-${curMatch.details?.['full-time-corner-kick']?.[1] === '-' ? 0 : curMatch.details?.['full-time-corner-kick']?.[1]}`}</p>
            <p><div><img src={require('../i/yel.png')} alt="" /></div>{`黄牌${curMatch.details?.['full-time-red-card']?.[0]==='-' ? 0 : curMatch.details?.['full-time-red-card']?.[0]}-${curMatch.details?.['full-time-red-card']?.[1] === '-' ? 0 : curMatch.details?.['full-time-red-card']?.[1]}`}</p>
            <p><div><img src={require('../i/red.png')} alt="" /></div>{`红牌${curMatch.details?.['full-time-yellow-card']?.[0]==='-' ? 0 : curMatch.details?.['full-time-yellow-card']?.[0]}-${curMatch.details?.['full-time-yellow-card']?.[1] === '-' ? 0 : curMatch.details?.['full-time-yellow-card']?.[1]}`}</p>
          </div>
        );
      case 2:
        return (
          <div className={style.scorePan}>
            {curMatch.details?.['first-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['first-round-goal']?.[0]}-${curMatch.details?.['first-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['second-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['second-round-goal']?.[0]}-${curMatch.details?.['second-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['third-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['third-round-goal']?.[0]}-${curMatch.details?.['third-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['fourth-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['fourth-round-goal']?.[0]}-${curMatch.details?.['fourth-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['fifth-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['fifth-round-goal']?.[0]}-${curMatch.details?.['fifth-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['over-time-goal']?.length > 0 && curMatch.details?.['over-time-goal'][0] !== '-' && (
              <p>{`${curMatch.details?.['over-time-goal']?.[0]}-${curMatch.details?.['over-time-goal']?.[1]}`}</p>
            )}
          </div>
        );
      case 3:
        return (
          <div className={style.scorePan}>
            {curMatch.details?.['first-round-goal']?.length > 0 && curMatch.details?.['first-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['first-round-goal']?.[0]}-${curMatch.details?.['first-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['second-round-goal']?.length > 0 && curMatch.details?.['second-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['second-round-goal']?.[0]}-${curMatch.details?.['second-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['third-round-goal']?.length > 0 && curMatch.details?.['third-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['third-round-goal']?.[0]}-${curMatch.details?.['third-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['fourth-round-goal']?.length > 0 && curMatch.details?.['fourth-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['fourth-round-goal']?.[0]}-${curMatch.details?.['fourth-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['fifth-round-goal']?.length > 0 && curMatch.details?.['fifth-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['fifth-round-goal']?.[0]}-${curMatch.details?.['fifth-round-goal']?.[1]}`}</p>
            )}
          </div>
        );
      case 18:
        return (
          <div className={style.scorePan}>
            {curMatch.details?.['first-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['first-round-goal']?.[0] !== '-' ? curMatch.details?.['first-round-goal']?.[0] : 0}-${curMatch.details?.['first-round-goal']?.[1] !== '-' ? curMatch.details?.['first-round-goal']?.[1] : 0}`}</p>
            )}
            {curMatch.details?.['second-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['second-round-goal']?.[0] !== '-' ? curMatch.details?.['second-round-goal']?.[0] : 0}-${curMatch.details?.['second-round-goal']?.[1] !== '-' ? curMatch.details?.['second-round-goal']?.[1] : 0}`}</p>
            )}
            {curMatch.details?.['third-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['third-round-goal']?.[0] !== '-' ? curMatch.details?.['third-round-goal']?.[0] : 0}-${curMatch.details?.['third-round-goal']?.[1] !== '-' ? curMatch.details?.['third-round-goal']?.[1] : 0}`}</p>
            )}
            {curMatch.details?.['fourth-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['fourth-round-goal']?.[0] !== '-' ? curMatch.details?.['fourth-round-goal']?.[0] : 0}-${curMatch.details?.['fourth-round-goal']?.[1] !== '-' ? curMatch.details?.['fourth-round-goal']?.[1] : 0}`}</p>
            )}
            {curMatch.details?.['fifth-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['fifth-round-goal']?.[0] !== '-' ? curMatch.details?.['fifth-round-goal']?.[0] : 0}-${curMatch.details?.['fifth-round-goal']?.[1] !== '-' ? curMatch.details?.['fifth-round-goal']?.[1] : 0}`}</p>
            )}
            {curMatch.details?.['sixth-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['sixth-round-goal']?.[0] !== '-' ? curMatch.details?.['sixth-round-goal']?.[0] : 0}-${curMatch.details?.['sixth-round-goal']?.[1] !== '-' ? curMatch.details?.['sixth-round-goal']?.[1] : 0}`}</p>
            )}
            {curMatch.details?.['seventh-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['seventh-round-goal']?.[0] !== '-' ? curMatch.details?.['seventh-round-goal']?.[0] : 0}-${curMatch.details?.['seventh-round-goal']?.[1] !== '-' ? curMatch.details?.['seventh-round-goal']?.[1] : 0}`}</p>
            )}
            {curMatch.details?.['eight-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['eight-round-goal']?.[0] !== '-' ? curMatch.details?.['eight-round-goal']?.[0] : 0}-${curMatch.details?.['eight-round-goal']?.[1] !== '-' ? curMatch.details?.['eight-round-goal']?.[1] : 0}`}</p>
            )}
            {curMatch.details?.['nine-round-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['nine-round-goal']?.[0] !== '-' ? curMatch.details?.['nine-round-goal']?.[0] : 0}-${curMatch.details?.['nine-round-goal']?.[1] !== '-' ? curMatch.details?.['nine-round-goal']?.[1] : 0}`}</p>
            )}
            {curMatch.details?.['over-time-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['over-time-goal']?.[0] !== '-' ? curMatch.details?.['over-time-goal']?.[0] : 0}-${curMatch.details?.['over-time-goal']?.[1] !== '-' ? curMatch.details?.['over-time-goal']?.[1] : 0}`}</p>
            )}
            {curMatch.details?.['penalty-shootout']?.length > 0 && (
              <p>{`${curMatch.details?.['penalty-shootout']?.[0] !== '-' ? curMatch.details?.['penalty-shootout']?.[0] : 0}-${curMatch.details?.['penalty-shootout']?.[1] !== '-' ? curMatch.details?.['penalty-shootout']?.[1] : 0}`}</p>
            )}
            {curMatch.details?.['final-goal']?.length > 0 && (
              <p>{`${curMatch.details?.['final-goal']?.[0] !== '-' ? curMatch.details?.['final-goal']?.[0] : 0}-${curMatch.details?.['final-goal']?.[1] !== '-' ? curMatch.details?.['final-goal']?.[1] : 0}`}</p>
            )}
          </div>
        );
      case 23:
        return (
          <div className={style.scorePan}>
            {curMatch.details?.['first-round-goal']?.length > 0 && curMatch.details?.['first-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['first-round-goal']?.[0]}-${curMatch.details?.['first-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['second-round-goal']?.length > 0 && curMatch.details?.['second-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['second-round-goal']?.[0]}-${curMatch.details?.['second-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['third-round-goal']?.length > 0 && curMatch.details?.['third-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['third-round-goal']?.[0]}-${curMatch.details?.['third-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['fourth-round-goal']?.length > 0 && curMatch.details?.['fourth-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['fourth-round-goal']?.[0]}-${curMatch.details?.['fourth-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['fifth-round-goal']?.length > 0 && curMatch.details?.['fifth-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['fifth-round-goal']?.[0]}-${curMatch.details?.['fifth-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['sixth-round-goal']?.length > 0 && curMatch.details?.['sixth-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['sixth-round-goal']?.[0]}-${curMatch.details?.['sixth-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['seventh-round-goal']?.length > 0 && curMatch.details?.['seventh-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['seventh-round-goal']?.[0]}-${curMatch.details?.['seventh-round-goal']?.[1]}`}</p>
            )}
          </div>
        );
      case 6:
        return (
          <div className={style.scorePan}>
            {curMatch.details?.['first-round-goal']?.length > 0 && curMatch.details?.['first-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['first-round-goal']?.[0]}-${curMatch.details?.['first-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['second-round-goal']?.length > 0 && curMatch.details?.['second-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['second-round-goal']?.[0]}-${curMatch.details?.['second-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['third-round-goal']?.length > 0 && curMatch.details?.['third-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['third-round-goal']?.[0]}-${curMatch.details?.['third-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['fourth-round-goal']?.length > 0 && curMatch.details?.['fourth-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['fourth-round-goal']?.[0]}-${curMatch.details?.['fourth-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['fifth-round-goal']?.length > 0 && curMatch.details?.['fifth-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['fifth-round-goal']?.[0]}-${curMatch.details?.['fifth-round-goal']?.[1]}`}</p>
            )}
          </div>
        );
      case 11:
        return (
          <div className={style.scorePan}>
            {curMatch.details?.['first-half-goal']?.length > 0 && curMatch.details?.['first-half-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['first-half-goal']?.[0]}-${curMatch.details?.['first-half-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['second-half-goal']?.length > 0 && curMatch.details?.['second-half-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['second-half-goal']?.[0]}-${curMatch.details?.['second-half-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['over-time-goal']?.length > 0 && curMatch.details?.['over-time-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['over-time-goal']?.[0]}-${curMatch.details?.['over-time-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['penalty-shootout']?.length > 0 && curMatch.details?.['penalty-shootout']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['penalty-shootout']?.[0]}-${curMatch.details?.['penalty-shootout']?.[1]}`}</p>
            )}
          </div>
        );
      case 12:
        return (
          <div className={style.scorePan}>
            {curMatch.details?.['first-round-goal']?.length > 0 && curMatch.details?.['first-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['first-round-goal']?.[0]}-${curMatch.details?.['first-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['second-round-goal']?.length > 0 && curMatch.details?.['second-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['second-round-goal']?.[0]}-${curMatch.details?.['second-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['third-round-goal']?.length > 0 && curMatch.details?.['third-round-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['third-round-goal']?.[0]}-${curMatch.details?.['third-round-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['over-time-goal']?.length > 0 && curMatch.details?.['over-time-goal']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['over-time-goal']?.[0]}-${curMatch.details?.['over-time-goal']?.[1]}`}</p>
            )}
            {curMatch.details?.['penalty-shootout']?.length > 0 && curMatch.details?.['penalty-shootout']?.[0] !== '-' && (
              <p>{`${curMatch.details?.['penalty-shootout']?.[0]}-${curMatch.details?.['penalty-shootout']?.[1]}`}</p>
            )}
          </div>
        );
    }
    return null;
  }, [curMatch, sportId]);
  const refresh = () => {
    updateDetail(curMatch.mid);
  };
  return (
    <>
      <div className={classnames(style.detailHead, bgName)}>
        <div className={style.mainContent}>
          <div className={style.team}>
            <div className={style.logo}>
              <img src={curMatch.mn[0].logo} alt="" />
            </div>
            <div className={style.name}>{curMatch.mn[0].title}</div>
          </div>
          <div className={style.statusPan}>
            <p className={style.date}>{curMatch.bt}</p>
            {totalScore}
            <p className={style.status}>
              {match ?getMatchStatusByPeriod((match.md.ip === 1 && !match.md.me?.pd) ? 'LIVE' : match.md.sid === 3 ? match.md.me?.pd?.toUpperCase() : match.md.me?.pd).split('-')[0]: '已结束'}
            </p>
          </div>
          <div className={style.team}>
            <div className={style.logo}>
              <img src={curMatch.mn[1].logo} alt="" />
            </div>
            <div className={style.name}>{curMatch.mn[1].title}</div>
          </div>
        </div>
        <div className={style.head}>
          <div className={style.goToBack} onClick={() => close()}></div>
          <div className={style.league}>
            <p>{curMatch.ln}</p>
            <div onClick={() => setShowLeague(true)} className={style.down}></div>
          </div>
          <div className={style.refresh} onClick={refresh}></div>
        </div>
        {statusBar}
      </div>
      <LeagueList
        isOpen={showLeague}
        close={() => setShowLeague(false)}
        sportId={sportId}
      />
    </>
  );
});

export default DetailHead;
