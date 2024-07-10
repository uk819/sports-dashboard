import useOrderCart from '@core/hooks/sports/useOrderCart';
import {TOrder} from '@core/services/Table';
import DpIcon from '@views/kmg/desktop/components/Icon';
import {getBetHandiCapAtBetting, getOrderBetTypeAtBetting, getPlayNameByKc, getTeamScoreByCtipType, isChampion, isPlayingMatch, isVisiableSecondText} from '@core/utils';
import {getViewOddType, getViewOddTypeName, useOddTransfer} from '@core/hooks/sports/useOddTransfer';
import {Tooltip} from 'antd';
import dayjs from 'dayjs';
import {formatCurrency} from '@core/helpers/unit';
import FastBetBtnSComponent from './fastBetBtns';
import {MultipleBetContext} from './MultipleBetContext';
import classnames from 'classnames';
import usePublicState from '@core/hooks/usePublicState';
import {amountVilidation} from '@core/utils/math';
interface IProps {
  order: TOrder,
  tag: string,
  hasReserve?: boolean,
  inputRef:{[key: string]: any},
  setTotalBetAmount: Function,
  isReserveStatus: Function,
  isSeries?: boolean
  sameMatch?: Array<number>
}
const OrderItem = React.memo(({order, tag, isReserveStatus, hasReserve, isSeries, sameMatch=[]}: IProps) => {
  const {inputRef, setTotalBetAmount, getRemainAmount} = React.useContext(MultipleBetContext);
  const {removeOrder, isExistConfirmed, setOrderMoney, updateOrderReserve, updateOrderReserveOdd, orders} = useOrderCart();
  const {getViewOdd} = useOddTransfer();
  const {user, base} = usePublicState();
  React.useEffect(() => {
    updateOrderReserve(tag, '0.00', false);
    setOrderMoney(order.money, tag);
  }, [user.currentOddType]);
  const getTotalBetAmountExcludeOwn =()=>{
    let count = 0;
    Object.values(orders).map((item: TOrder)=>{
      if (item.tag!==tag) count = Number(item.money) + count;
    });
    return count;
  };
  const reserverVerifyBalance = (v: string, tag: string)=>{
    const value =amountVilidation(v);
    const betMoney: number = Number(value);
    const otherBetAmount = getTotalBetAmountExcludeOwn();
    if (betMoney > order.reservationMaxBetAmount) {
      setOrderMoney( order.reservationMaxBetAmount, tag);
      inputRef.current[tag].value = String( order.reservationMaxBetAmount);
      return;
    }
    if (betMoney > user.info.totalBalance - otherBetAmount) {
      const amount = user.info.totalBalance - otherBetAmount;
      setOrderMoney(amount, tag);
      inputRef.current[tag].value = String(amount);
      return;
    }
    const remainBet = getRemainAmount();
    const maxOrderMoney = remainBet + Number(order.money);
    const val = betMoney > maxOrderMoney ? maxOrderMoney : betMoney;
    inputRef.current[tag].value = String(Number(val)=== 0 ? '': value);
    setOrderMoney(inputRef.current[tag].value === '' ? '' : Number(val), tag);
    setTotalBetAmount('');
  };
  const HandleChangeBalance = (v: string, tag: string) => {
    if (orders[tag].inReservationStatus) {
      reserverVerifyBalance(v, tag);
      return;
    }
    const value =amountVilidation(v);
    const betMoney: number = Number(value);
    const otherBetAmount = getTotalBetAmountExcludeOwn();
    if (betMoney > order.maxBetAmount) {
      setOrderMoney(order.maxBetAmount, tag);
      inputRef.current[tag].value = String(order.maxBetAmount);
      return;
    }
    if (betMoney > user.info.totalBalance - otherBetAmount) {
      const amount = user.info.totalBalance - otherBetAmount;
      setOrderMoney(amount, tag);
      inputRef.current[tag].value = String(amount);
      return;
    }
    const remainBet = getRemainAmount();
    const maxOrderMoney = remainBet + Number(order.money);
    const val = betMoney > maxOrderMoney ? maxOrderMoney : betMoney;
    inputRef.current[tag].value = String(Number(val)=== 0 ? '': value);
    setOrderMoney(inputRef.current[tag].value === '' ? '' : Number(val), tag);
    setTotalBetAmount('');
  };
  const validationReserveValue = (value: string)=>{
    const odd = amountVilidation(value);
    updateOrderReserveOdd(tag, odd);
  };
  const overMaxWinLimit = ()=>{
    const {money, maxWinAmount, maxWin} = order;
    if (!money) return false;
    if ( maxWinAmount < maxWin) {
      return true;
    }
    return false;
  };
  return (
    <div className={classnames('bet-item', !isSeries && isReserveStatus() && !order.inReservationStatus && 'reserve-opacity', isSeries && sameMatch.includes(order.matchId) && 'series-alert', {'series-alert': isSeries && isChampion(order.kc)})} key={tag}>
      <div className='remove' onClick={() => removeOrder(tag)}>
        <DpIcon className='close' type='close' width={10} height={10} />
      </div>
      <div className="match-league">
        {order.leagueName}
      </div>
      <div className="match-name">
        {
          !isChampion(order.kc) &&
          <Tooltip
            title={<span>{order.teams.home.name} VS {order.teams.away.name}{getTeamScoreByCtipType(order, order.ctid, order.sportId)}</span>}
          >
            <span>{order.teams.home.name} VS {order.teams.away.name}{getTeamScoreByCtipType(order, order.ctid, order.sportId)}</span>
          </Tooltip>
        }
      </div>
      {!order.isRunning &&
        <div className='match-time'>
          {dayjs(order.matchDate).format('YYYY-MM-DD HH:mm')}
        </div>
      }
      <div className={classnames('market')}>
        <div className='market-info'>
          <span className='top-game-type-wrap'>[{isPlayingMatch(order.isRunning ? 1 : 0, order.kc)}]
            <Tooltip title={getPlayNameByKc({code: tag.split(/-/)[1], name: order.playName, ctid: order.ctid, sportId: order.sportId}) || order.playName}>
              <em className='play-name-text'>
                {getPlayNameByKc({code: tag.split(/-/)[1], name: order.playName, ctid: order.ctid, sportId: order.sportId}) || order.playName}
              </em>
            </Tooltip>
          </span>
          <span className='bet-game-type-text'>{getViewOddTypeName(order.oddBetType, user.currentOddType, base.toggleSeries)}</span>
        </div>
        <div className='team-win'>
          <Tooltip className={getOrderBetTypeAtBetting(order) ? '' : 'display-none'} title={getOrderBetTypeAtBetting(order)}>
            <span>{getOrderBetTypeAtBetting(order)}</span>
          </Tooltip>
          &nbsp;{isVisiableSecondText(order.betHandicap, order.betName, order.kc) && <em>{getBetHandiCapAtBetting(order.orderName, order.sportId)}</em>}
          {!isSeries && order.inReservationStatus && <span className='resere-text'>[预约]</span>}
        </div>
        {
          (isSeries || !order.inReservationStatus) && <div className='odd'>
            <div className={order.justAddCar ? '' : order.change} >@{getViewOdd(order.od, order.oddBetType, getViewOddType(order.oddBetType, user.currentOddType, base.toggleSeries))}</div>
            {(!order.available || order.locked) && <div className='fail'>失效</div>}
            {(order.available && !order.locked && hasReserve) &&
            // <CustomToolTip title={customToolTipContent} placement="bottomLeft">
                <div className='reserve' onClick={()=>(updateOrderReserve(tag, getViewOdd(order.od, order.oddBetType, user.currentOddType), true))}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M3.5 3.5V0H4.5V3.5H8V4.5H4.5V8H3.5V4.5H0V3.5H3.5Z" fill="#3586FF"/>
                  </svg>
                  <span>预约</span>
                </div>
              // </CustomToolTip>
            }
          </div>
        }
        {
          !isSeries && order.inReservationStatus && <div className='odd'>
            <span>赔率</span>
            <div className='reserve-input'>
              {
                <span className='subtract'
                  onClick={()=>{
                    order.reservationMarkOdd < Number(order.reservationOdd) && updateOrderReserveOdd(tag, (Number(order.reservationOdd) - 0.01).toFixed(2));
                  }}>
                  <span></span>
                </span>
              }
              <input className='input' value={order.reservationOdd}
                onChange={(e)=>validationReserveValue(e.target.value)}/>
              <span className='add'
                onClick={(e)=>{
                  updateOrderReserveOdd(tag, (Number(order.reservationOdd) + 0.01).toFixed(2));
                  e.preventDefault();
                }}>
                <DpIcon type='add2'/>
              </span>
            </div>
            <DpIcon type='del' onClick={()=>(updateOrderReserve(tag, '0.00', false))}/>
          </div>
        }
      </div>
      {
        order.reserveAlert && <div className="error-message">预约赔率不能小于下注时赔率</div>
      }
      {
        !isSeries && <div className={overMaxWinLimit()?'input-box  red-alert':'input-box '} style={{display: isExistConfirmed ? 'none' : ''}}>
          <input id={tag} placeholder={`限额 10 ~ ${order.inReservationStatus?order.reservationMaxBetAmount: order.maxBetAmount}`} type='text'
            onChange={(e) => HandleChangeBalance(e.target.value, tag)}
            value={order.money}
            ref={(ref) => inputRef.current[tag] = ref}/>
          {order.money ? <div className='close-input' onClick={() => HandleChangeBalance('0', tag)}></div> : <></>}
        </div>
      }
      {
        !isSeries && <span className="amount-after-serires flex-end">最高可赢:{formatCurrency((order.inReservationStatus? order.reservationMaxWin: order.maxWin || 0))}</span>
      }
      {!isExistConfirmed && !isSeries && <FastBetBtnSComponent tag={tag}/>}
    </div>
  );
});
export default OrderItem;
