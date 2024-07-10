import {TMatch} from '@core/services/Table';
import styles from './style.scss';
import DpIcon from '@views/kmg/mobile/components/Icon';
import DpIamge from '@views/kmg/mobile/components/Image';
import {getMatchStatusByPeriod} from '@core/utils';
import CountdownLite from '@this/pages/SportGame/components/CountdownLite';
import dayjs from 'dayjs';
import Odds from './Odds';
import useFavorites from '@core/hooks/sports/useFavorites';
import classnames from 'classnames';
import usePublicState from '@core/hooks/usePublicState';
import {useSelector} from 'react-redux';
import IStore from '@core/reducers/_reduxStore.d';
import useTheme from '@core/hooks/useTheme';
interface IMatchOfNoobProps {
  match: TMatch;
}
export default ({match}: IMatchOfNoobProps) => {
  const {isFavorite, onToggleFavorite} = useFavorites();
  const {dispatch, ACTIONS} = usePublicState();
  const {matchListUpdateTime} = useSelector((state: IStore) => state.sport.display);
  const {mobileTheme} = useTheme();
  const handleOpenDetail = () => {
    dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: match.matchId}));
    dispatch(ACTIONS.SPORT.switchVisiabelByDetail(true));
  };
  return (
    <div className={styles.wrapper}>
      <div className="match-noob-header" onClick={handleOpenDetail}>
        <div className="media-box">
          <DpIcon type="animate" active={match.hasAnimate} />
          <DpIcon type="live" active={match.hasVideo} />
          {
            match.hasCorner &&
            <img className='mr-5' style={{width: '18px'}} src={require('@this/assets/images/common/ico_cornerkick.png')} />
          }
          <div className="match-status">
            {
              match.isLive ? <>
                <span>
                  {getMatchStatusByPeriod(match.matchClock.period)}
                </span>
                {
                  (match.matchClock.period !== 'HT' && match.matchClock.period !== 'FT' && match.matchClock.second > 0) && match.sportId === 1 ?
                  <CountdownLite seconds={match.matchClock.second} key={`${match?.matchId}_${match.matchClock.second}_${matchListUpdateTime}`} /> :
                  <span>{match.matchClock.playTime}</span>
                }
                {
                  match.sportId > 33 &&
                  <span className="ml-5">{match.round}</span>
                }
                {
                  match.competitionType &&
                  <span className="ml-5">{match.competitionType}</span>
                }
                <div className="match-score">{match.score.home}-{match.score.away}</div>
              </> : <>
                <span>{dayjs(match.matchClock.startTime).format('MM月DD日 HH:mm')}</span>
                {
                  match.sportId > 33 &&
                  <span className="ml-5">{match.round}</span>
                }
                {
                  match.competitionType &&
                  <span className="ml-5">{match.competitionType}</span>
                }
              </>
            }
          </div>
        </div>
        <div className="total-count">
          更多({match.playTypeCount})
          <DpIcon className='ml-4' fill={mobileTheme.dpNormal} type='arrow' direction='right' width={10} height={10} />
        </div>
      </div>
      <div className="match-info" onClick={handleOpenDetail}>
        <div className="team">
          <div className='team-name'>
            {match.score.homeRedCard > 0 && <span className="red-card">{match.score.homeRedCard}</span>}
            <span>
              {match.teams.home.name}
            </span>
          </div>
          <DpIamge type='team' width={18} src={match.teams.home.icon} />
        </div>
        <div className="score">
          <p>VS</p>
        </div>
        <div className="team">
          <DpIamge type='team' width={18} src={match.teams.away.icon} />
          <div className="team-name">
            <span>
              {match.teams.away.name}
            </span>
            {match.score.awayRedCard > 0 && <span className="red-card">{match.score.awayRedCard}</span>}
          </div>
        </div>
      </div>
      <div className="match-bottom">
        <div className={classnames('odds', {'is-esports': match.sportId > 33})}>
          <Odds match={match} />
        </div>
      </div>
      <div className="collect-box">
        <DpIcon type='collect' active={isFavorite([match.matchId])} onClick={(e) => onToggleFavorite(e, [match.matchId])} />
      </div>
    </div>
  );
};
