import Overlay from '@core/templates/mobile/components/Overlay';
import 'swiper/css';
import css from './style.scss';
import DetailHeader from '../DetailHeader';
import {TabProps} from '../..';
import {useState} from 'react';
import EuropeanIndex from './europeanIndex';
import AsianOverUnderIndex from './asianOverUnderIndex';
import {asianIndex, overUnderIndex} from './data';

interface IProps {
  back: (e: TabProps) => void;
}

export default (props: IProps) => {
  const [active, setActive] = useState(0);

  return (
    <Overlay display={true} zIndex={100} close={close}>
      <div className={css.wrapper}>
        <div className='container'>
          <DetailHeader
            tabs={['欧洲指数', '亚洲指数', '大小指数']}
            back={props.back}
            active={active}
            setActive={(e: number) => setActive(e)}
          />
          {active === 0 ? (
            <EuropeanIndex />
          ) : active === 1 ? (
            <AsianOverUnderIndex betIndexes={asianIndex} />
          ) : (
            <AsianOverUnderIndex betIndexes={overUnderIndex} />
          )}
        </div>
      </div>
    </Overlay>
  );
};
