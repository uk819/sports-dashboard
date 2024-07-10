import Overlay from '@core/templates/mobile/components/Overlay';
import 'swiper/css';
import css from './style.scss';
import DetailHeader from '../DetailHeader';
import {TabProps} from '../..';
import {useState} from 'react';
import Results from './components/Results';
import HtoHResult from './components/HtoHResult';
import Order from './components/Order';

interface IProps {
  back: (e : TabProps)=> void;
}

export default ((props: IProps) => {
  const [active, setActive] = useState(0);
  return (
    <Overlay display={true} zIndex={100} >
      <div className={css.wrapper}>
        <div className='container'>
          <DetailHeader tabs={['近期战绩', '积分榜', '交锋战绩']} back={props.back} active={active} setActive={(e : number)=>setActive(e)}/>
          {
            active === 0 ? <Results/> : active === 1 ? <Order/> : <HtoHResult/>
          }
        </div>
      </div>
    </Overlay>
  );
});

