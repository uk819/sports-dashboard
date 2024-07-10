import classNames from 'classnames';
import styles from './style.scss';
import {EStaticsType} from '@core/constants/enum/sport';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';
import useTheme from '@core/hooks/useTheme';
import {iconType} from './iconMap';
import {Tooltip} from 'antd';
interface IProps {
  eventTime: number;
  cnText: string;
  enText: string;
  eventId: EStaticsType;
  period?: number;
  score: string;
  typeName: string;
  team: '0' | '1' | '2';
}
const MatchEventItem = ({eventTime, cnText, enText, eventId, score, period, team, typeName}: IProps) => {
  console.log(eventTime);
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
    <div className={classNames('event-item', `type-${eventId}`)}>
      <div className='time-bolck'>
        <span>
          {eventTime?.toString() === '90' ? '90+' : <>{eventTime}</> }
        </span>
      </div>
      {realTeam === '1' ?
        <div className='left-side'>
          {
            score !== null &&
            <div className='score'>{score}</div>
          }
          <div className='content'>
            <div className='text'>{transMatchTeamName(cnText)}</div>
            <div className='event-img'>
              <Tooltip title={typeName}>
                {iconType(theme, eventId) && <img src={iconType(theme, eventId)}/> }
              </Tooltip>
            </div>
          </div>
        </div> : <div></div>
      }
      {realTeam === '2' ?
        <div className='right-side'>
          <div className='content'>
            <div className='event-img'>
              <Tooltip title={typeName}>
                {iconType(theme, eventId) && <img src={iconType(theme, eventId)}/> }
              </Tooltip>
            </div>
            <div className='text'>{transMatchTeamName(cnText)}</div>
          </div>
          {
            score !== null &&
            <div className='score'>{score}</div>
          }
        </div> : <div></div>
      }
      {realTeam === '0'&&
        <div className='right-side'>
          <div className='content'>
            <div className='event-img'>
              {iconType(theme, eventId) && <img src={iconType(theme, eventId)}/> }
            </div>
            <div className='text'>{transMatchTeamName(cnText)}</div>
          </div>
          <div className='score'></div>
        </div>
      }
    </div>
  );
};

function DpMatchEvent({eventList}: { eventList: IProps[] }) {
  return (
    <div className={classNames(styles.dpMatchEvent)}>
      <div className='body'>
        <div className='time-bar'></div>
        {eventList?.map((item, idx) => {
          return <MatchEventItem key={idx} {...item} />;
        })}
      </div>
    </div>
  );
}

export default DpMatchEvent;
