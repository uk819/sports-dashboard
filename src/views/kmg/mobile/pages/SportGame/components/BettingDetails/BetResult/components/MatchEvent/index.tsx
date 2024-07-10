import classNames from 'classnames';
import styles from './style.scss';
import {EStaticsType} from '@core/constants/enum/sport';
import useTheme from '@core/hooks/useTheme';
import {iconType} from './iconMap';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';

interface IProps {
  eventTime: number;
  cnText: string;
  enText: string;
  eventId: EStaticsType;
  period?: number;
  score: string;
  team: '0' | '1' | '2';
}
const MatchEventItem = ({eventTime, cnText, enText, eventId, score, period, team}: IProps) => {
  const {theme} = useTheme();
  const {matchDetail} = useMatchDetail();
  const realTeam = React.useMemo(() => {
    if (matchDetail?.teamReverse === 1 && team !== '0') {
      return matchDetail?.teamReverse === 1 ? team === '1' ? '2' : '1' : team;
    }
    return team;
  }, [team, matchDetail?.teamReverse]);

  const transMatchTeamName = (str: string)=>{
    if (!matchDetail) return '';
    const {teams} = matchDetail;
    if (!str) return '';
    return str.replace(`{${matchDetail?.teamReverse === 1 ? 'team2' : 'team1'}}`, teams.home.name).replace(`{${matchDetail?.teamReverse === 1 ? 'team1' : 'team2'}}`, teams.away.name);
  };
  return (
    <div className='event-item'>
      {
        team !== '0' ?
          <div className='time-bolck'>
            <span>
              {eventTime}
              {/* <em>&apos;</em> */}
            </span>
          </div> :
          <div></div>
      }
      {realTeam === '1' ?
        <div className='left-side'>
          <div className='content'>
            <div className='text'>
              {transMatchTeamName(cnText)}
              {
                score &&
                <em>({score})</em>
              }
            </div>
          </div>
          <div className='event-img'>
            {iconType(theme, eventId) && <img src={iconType(theme, eventId)}/> }
          </div>
        </div> : <div></div>
      }
      {realTeam === '2' ?
        <div className='right-side'>
          <div className='event-img'>
            {iconType(theme, eventId) && <img src={iconType(theme, eventId)}/> }
          </div>
          <div className='content'>
            <div className='text'>
              {transMatchTeamName(cnText)}
              {
                score &&
                <em>({score})</em>
              }
            </div>
          </div>
        </div> : <div></div>
      }
      {realTeam === '0'&&
        <div className='central-side'>
          <div className='content'>
            {iconType(theme, eventId) &&
              <div className='event-img'>
                <img src={iconType(theme, eventId)} />
              </div>
            }
            <div className='text'>{transMatchTeamName(cnText)}</div>
          </div>
        </div>
      }
    </div>
  );
};

function DpMatchEvent({eventList}: {eventList: IProps[]}) {
  const {theme} = useTheme();

  return (
    <div className={classNames(styles.dpMatchEvent)}>
      <div className='body'>
        <div className='time-bar'>
          <img src={iconType(theme, '0')} className='timer-img'/>
        </div>
        {eventList.map((item, idx) => (
          <MatchEventItem key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}

export default DpMatchEvent;
