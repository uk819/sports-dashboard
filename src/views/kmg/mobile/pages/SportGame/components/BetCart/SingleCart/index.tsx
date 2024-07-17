/*
 * @Author: Galen.GE
 * @Date: 2024-01-19 11:59:17
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/BetCart/SingleCart/index.tsx
 * @Description:
 */
import {useSelector} from 'react-redux';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import BetItemInfo from '../BetItemInfo';
import Keyborad from '../Keyborad';
import TStore from '@core/reducers/_reduxStore';
import {TOrder} from '@core/services/Table';
import {useOddTransfer} from '@core/hooks/sports/useOddTransfer';
import classnames from 'classnames';
import {amountVilidation} from '@core/utils/math';
import style from './style.scss';

interface IProps{
  order?: TOrder
  orders?: Array<TOrder>
  hideModalAddMatchs?: Function
  setHeight?: Function
  close?: Function
  orderStatus?: {
   fails: Array<string>,
   lockds: Array<string>
  }
 }
export default React.memo(({order, close}: IProps) => {
  const {updateOrderReserve, updateOrderReserveOdd, setOrderMoney} = useOrderCart();
  const {getViewOdd} = useOddTransfer();
  const tags = useSelector((state: TStore) => state.sport.bet.orderTags);
  const [checkedAmount, setCheckedAmount] = React.useState('');
  const info = useSelector((state: TStore) => state.user.info);
  const setBetAmount = (amount: string)=>{
    const amountStr = amountVilidation(amount);
    const amountNumer = Number(amountStr);
    if (!Array.isArray(order) && amountNumer > order.maxBetAmount) return;
    setOrderMoney(amountNumer, tags[0]);
  };
  return (
    <div className={style.singleBetWrapper}>
      <BetItemInfo type="single" order={order} />
      <div className='money-input'>
        <div className="title">
          <em className={order.money?'hide':''}>限额 {order.minBetAmount}-{order.inReservationStatus ? order.reservationMaxBetAmount : order.maxBetAmount}</em>
          {order.money === 0 ?'': order.money}
          <em className="cursor"></em>
          <em>RMB</em>
        </div>
        {!order.inReservationStatus &&
          <span className='reserve-in'
            onClick={()=>{
              updateOrderReserve(order.tag, getViewOdd(order.od, order.oddBetType));
            }}>预约</span>}
        {order.inReservationStatus &&
          <span className='reserve-out'
            onClick={()=>{
              updateOrderReserve(order.tag, '0', false);
            }}>取消预约</span>}
      </div>
      {
        order.inReservationStatus && <div className='reserve-input'>
          {<div className={classnames('c1', order.reservationMarkOdd>=Number(order.reservationOdd) && 'unvisiable')}
            onClick={()=>(updateOrderReserveOdd(order.tag, (Number(order.reservationOdd) - 0.01).toFixed(2)))}>-</div>}
          <div className='c2'>
            <span>@</span>
            <span>{order.reservationOdd}</span>
          </div>
          <div className='c3' onClick={()=>(updateOrderReserveOdd(order.tag, (Number(order.reservationOdd) + 0.01).toFixed(2)))}>+</div>
        </div>
      }
      <Keyborad onChange={setBetAmount}
        value={String(order.money)}
        checked={checkedAmount}
        order= {order}
        maxBetAmount={order.maxBetAmount}
        setCheckedAmount={setCheckedAmount}
        closeBetOrderLayer={close}
        currentBalance={info.totalBalance}/>
    </div>
  );
});
