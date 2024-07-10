import Overlay from '@core/templates/mobile/components/Overlay';
import 'swiper/css';
import css from './style.scss';
import DetailHeader from '../DetailHeader';
import {TabProps} from '../..';
import {useState} from 'react';
// import useMatchDetail from '@core/hooks/sports/useMatchDetail';
// import DpImage from '@views/kmg/mobile/components/Image';
// import DistributionItem from './distributionItem';
// import {distributionsHome} from './data';
import EachTeamDistribution from './eachTeamDistribution';

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
    <Overlay display={true} zIndex={100}>
      <div className={css.wrapper}>
        <div className='container'>
          <DetailHeader tabs={['进球分布']} back={props.back} active={active} setActive={(e: number) => setActive(e)} />
          <div className='team-detail'>
            {position.map((position) => (
              <EachTeamDistribution key={position.id} position={position.value} />
            ))}
          </div>
        </div>
      </div>
    </Overlay>
  );
};
