import useMatchDetail from '@core/hooks/sports/useMatchDetail';
import DpImage from '@views/kmg/mobile/components/Image';
import style from './style.scss';
import TrendItem from '../TrendItem';
import {trends} from '../data';
import classnames from 'classnames';

export default ({position}: {position: 'home' | 'away'}) => {
  const {matchDetail} = useMatchDetail();
  const [isClicked, setIsClicked] = React.useState<boolean>(true);

  return (
    <div className={style.wrapper}>
      <div className='header' onClick={() => setIsClicked(!isClicked)}>
        <DpImage
          className='team-icon'
          type='team'
          src={position === 'home' ? matchDetail?.teams.home.icon : matchDetail?.teams.away.icon}
          alt='team-logo'
        />
        <p className='team-name'>{position === 'home' ? matchDetail?.teams.home.name : matchDetail?.teams.away.name}</p>
        <p className='win-rate'>{position === 'home' ? trends.home.status.winRate : trends.away.status.winRate}</p>
        <p className='ball-rate'>{position === 'home' ? trends.home.status.ballRate : trends.away.status.ballRate}</p>
      </div>
      <div className={classnames('detail', !isClicked && 'hide')}>
        <div className='events'>
          <span className='date-event'>日期赛事</span>
          <span className='home'>主</span>
          <span className='away'>客</span>
          <span className='handicap'>让球</span>
          <span className='over-under'>大小</span>
        </div>
        {(position === 'home' ? trends.home.detail : trends.away.detail).map((trend) => (
          <TrendItem key={trend.id} trend={trend} />
        ))}
      </div>
    </div>
  );
};
