import useMatchDetail from '@core/hooks/sports/useMatchDetail';
import DpImage from '@views/kmg/mobile/components/Image';
import DistributionItem from '../distributionItem';
import style from './style.scss';
import {distributions} from '../data';
import classnames from 'classnames';

export default ({position}: {position: 'home' | 'away'}) => {
  const {matchDetail} = useMatchDetail();
  const [isClicked, setIsClicked] = React.useState<boolean>(true);
  const type = [
    {id: 0, value: '总'},
    {id: 1, value: '主'},
    {id: 2, value: '客'},
  ];

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
        <p className='status'>{position === 'home' ? distributions.home.status : distributions.away.status}</p>
      </div>
      <div className={classnames('detail', !isClicked && 'hide')}>
        <div className='event-time'>
          {(position === 'home' ? distributions.home.detail : distributions.away.detail).map((distribution) => (
            <span className={`value-${distribution.id}`} key={distribution.id}>
              {distribution.time}
            </span>
          ))}
        </div>
        {type.map((type) => (
          <DistributionItem key={type.id} type={type.value} position={position} />
        ))}
      </div>
    </div>
  );
};
