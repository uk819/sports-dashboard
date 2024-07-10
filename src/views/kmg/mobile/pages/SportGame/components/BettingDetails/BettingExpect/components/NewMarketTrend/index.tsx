import Overlay from '@core/templates/mobile/components/Overlay';
import 'swiper/css';
import css from './style.scss';
import DetailHeader from '../DetailHeader';
import {TabProps} from '../..';
import {useState} from 'react';
import EachTeamTrend from './eachTeamTrend';

interface IProps {
  back: (e: TabProps) => void;
}
interface IPosition {
  id: number;
  value: 'home' | 'away';
}

const position: IPosition[] = [
  {id: 0, value: 'home'},
  {id: 1, value: 'away'},
];

export default (props: IProps) => {
  const [active, setActive] = useState(0);

  return (
    <Overlay display={true} zIndex={100} close={close}>
      <div className={css.wrapper}>
        <div className='container'>
          <DetailHeader tabs={['盘路走势']} back={props.back} active={active} setActive={(e: number) => setActive(e)} />
          <div className='team-detail'>
            {position.map((position) => (
              <EachTeamTrend key={position.id} position={position.value} />
            ))}
          </div>
        </div>
      </div>
    </Overlay>
  );
};
