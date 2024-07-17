import Overlay from '@template/components/Overlay';
import styles from './style.scss';
import {useGameResultListData} from '@core/hooks/sports/useRenderData';
import {useMemo} from 'react';
import DpImage from '@views/kmg/mobile/components/Image';

interface props {
  isOpen: boolean;
  close: (val: boolean) => void;
  sportId: number;
}
const leagueList = React.memo(({isOpen, close, sportId}: props) => {
  const {gamesResult, curMatch, gotoDetail} = useGameResultListData();
  const matchList = useMemo(() => {
    const tmp: any[] = [];
    gamesResult.map((game) => {
      if (game.leagueId === curMatch.leagueId) {
        if (tmp.findIndex((league) => league.mid === game.mid) == -1) {
          tmp.push(game);
        };
      }
    });
    return tmp;
  }, [gamesResult, curMatch]);
  const getTotalScore = (league: any) => {
    if (sportId>34) {
      return <p className='time'>{`${league.details?.['final-goal']?.[0]}-${league.details?.['final-goal']?.[1]}`}</p>;
    }
    switch (sportId) {
      case 3:
        return (
          <p className='time'>{`${league.details?.['total-games']?.[0]}-${league.details?.['total-games']?.[1]}`}</p>
        );
      case 23: case 6:
        return (
          <p className='time'>{`${league.details?.['game-score']?.[0]}-${league.details?.['game-score']?.[1]}`}</p>
        );
      case 12:
        return (
          <p className='time'>{`${league.details?.['final-goal']?.[0]}-${league.details?.['final-goal']?.[1]}`}</p>
        );
      default:
        return (
          <p className='time'>{`${league.details?.['full-time-goal']?.[0]}-${league.details?.['full-time-goal']?.[1]}`}</p>
        );
    }
  };
  return (
    <Overlay display={isOpen} closeOnClickBlank zIndex={1002} close={close} containerClassname='heightAuto'>
      <div className={styles.wrapper1}>
        <div className='head'>
          <div className='goToBack' onClick={() => close(false)}></div>
          <div className='league'>
            <p>{curMatch.ln}</p>
            <div onClick={() => close(false)} className='down'></div>
          </div>
          <div className='refresh'></div>
        </div>
        <ul className='league-open'>
          {matchList?.map((league) => (
            <li
              key={league.mid}
              onClick={() => {
                gotoDetail(league.mid);
                close(false);
              }}
              className={league.mid === curMatch?.mid ? 'active' : ''}
            >
              <div className='team'>
                <div>
                  <DpImage size={38} type='team' src={league.mn[0].logo} alt="team-logo1" />
                </div>
                <p>{league.mn[0].title}</p>
              </div>
              <div className='score'>
                <div className='not-started'>
                  <p className='time'>{league?.bt}</p>
                  {getTotalScore(league)}
                </div>
              </div>
              <div className='team'>
                <div>
                  <DpImage size={38} type='team' src={league.mn[1].logo} alt="team-logo1" />
                </div>
                <p>{league.mn[1].title}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Overlay>
  );
});

export default leagueList;
