/*
 * @Author: Galen.GE
 * @Date: 2024-01-19 12:26:59
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/BetCart/BetItemInfo/index.tsx
 * @Description:
 */
import {TOrder} from '@core/services/Table';
import style from './style.scss';
import {useUnmount} from 'react-use';
import closeIcon from '../SingleCart/i/close.svg';
import {getViewOddFn, getViewOddType} from '@core/hooks/sports/useOddTransfer';
import {getBetHandiCapAtBetting, getOrderBetTypeAtBetting, getPlayNameByKc, isChampion, isVisiableSecondText} from '@core/utils';
import DpIcon, {IconDown, IconUp} from '@views/kmg/mobile/components/Icon';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import usePublicState from '@core/hooks/usePublicState';
import classnames from 'classnames';

interface IBetItemInfoProps {
  // 串关或者单关
  type: 'single' | 'multiple';
  order: TOrder;
}
export default ({type, order}: IBetItemInfoProps) => {
  const {base, user} = usePublicState();
  const oddType = getViewOddType(order.oddBetType, user.currentOddType, base.toggleSeries);
  const odd = getViewOddFn(order.od, order.oddBetType, oddType);
  const {removeOrder} = useOrderCart();
  const [countdown, setCountdown] = React.useState(4);
  const timer = React.useRef(null);

  useUnmount(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  });

  React.useEffect(() => {
    if (type === 'multiple') {
      return;
    }
    if (timer.current) {
      clearInterval(timer.current);
    }
    setCountdown(4);
    timer.current = setInterval(() => {
      setCountdown((state) => {
        if (state === 0) {
          clearInterval(timer.current);
          return state;
        }
        return state - 1;
      });
    }, 1000);
  }, [order]);
  const hasInvalidOrder = () => {
    return order.locked || !order.available;
  };
  return hasInvalidOrder() ? (
    <div className={style.closeWrapper}>
      <div className='close-view'>
        <img src={closeIcon}/>
        <em>盘口已关闭</em>
      </div>
      <div className='remove' onClick={()=>removeOrder(order.tag)}>
        <DpIcon type='removeSeries' className='remove-series'></DpIcon>
        <DpIcon type='removeSeries2' className='remove-series2'/>
      </div>
    </div>
  ) : (
    <div className={style.wrapper}>
      <div className="name-odd">
        <span className='name'>
          {getOrderBetTypeAtBetting(order)}
          <em className='space'></em>
          {
            isVisiableSecondText(order.betHandicap, order.betName, order.kc) && <em>{getBetHandiCapAtBetting(order.orderName, order.sportId)}</em>
          }
        </span>
        <span className={`odd ${order.change}`}>
          <em>@</em>
          {odd}
          {order.change ==='up' && <IconUp/>}
          {order.change ==='down' && <IconDown/>}
        </span>
      </div>
      <div className="infos">
        <div className='info-content'>
          <div className={classnames({'mb-16': isChampion(order.kc)})}>
            {getPlayNameByKc({code: order.tag.split(/-/)[1], name: order.playName, ctid: order.ctid, sportId: order.sportId}) || order.playName}
          </div>
          {
            !isChampion(order.kc) &&
            <div>{`${order.teams.home.name} - ${order.teams.away.name}`}</div>
          }
          <div>{order.leagueName}</div>
        </div>
      </div>
      {
        type === 'single' &&
        <span className="countdown">{countdown}</span>
      }
      {
        type === 'multiple' &&
        <div className='remove' onClick={()=>removeOrder(order.tag)}>
          <DpIcon type='removeSeries' className='remove-series'></DpIcon>
          <DpIcon type='removeSeries2' className='remove-series2'/>
        </div>
      }
    </div>
  );
};
