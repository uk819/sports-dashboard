/*
 * @Author: Galen.GE
 * @Date: 2024-01-19 11:59:17
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/BetCart/SingleCart/index.tsx
 * @Description:
 */
import Overlay from '@template/components/Overlay';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import successNotice from './i/success_notice.svg';
import style from './style.scss';
import {formatCurrency} from '@core/helpers/unit';
import {getBetHandiCapAtBetting, getBetTeamType, getPlayNameByKc, isChampion, isVisiableSecondText} from '@core/utils';
import {getSeriesDigitsStr} from '@core/utils/math';

export default () => {
  const {confirmOrders, removeConfirmedOrders, isSeries, checkResult} = useOrderCart();
  const getTitle = (orderId: number) => {
    const order = checkResult.find((cr) => cr.orderId === orderId.toString());
    if (order?.status === 0) {
      return '注单已确认';
    } else if ([2, 4, 5].includes(order?.status)) {
      return '注单未完成';
    } else {
      return '注单确认中';
    }
  };
  const close = ()=>{
    removeConfirmedOrders();
  };
  const getProductAmountTotal = ()=>{
    return _.reduce(confirmOrders, (result, item) => result + item.productAmountTotal, 0);
  };
  const getmaxWinAmountTotal = ()=>{
    const maxWinAmount =_.reduce(confirmOrders, (result, item) => result + item.maxWinAmount, 0);
    return maxWinAmount;
  };
  if (_.isEmpty(confirmOrders)) return null;
  const seriesNotice = ()=>{
    return (
      <div className={style.noticeWrapper}>
        <div className='icon-success'>
          {
            !checkResult.some((item) => item.status !== 0) && <em>注单已确认&nbsp;</em>
          }
          {
            checkResult.find((item) => item.status === 3) && <>{checkResult.filter((item) => item.status === 3).length}笔注单待确认&nbsp;</>
          }
          {
            checkResult.find((item) => [2, 4, 5].includes(item.status)) && <>{checkResult.filter((item) => [2, 4, 5].includes(item.status)).length}笔注单未完成</>
          }
        </div>
        <ul className='series-list'>
          {
            confirmOrders[0].details.map((item, index)=>(
              <li className='score-info' key={item.orderId+''+index}>
                <div className='odds'>
                  <em>
                    {getBetTeamType(item)}
                    <em className='space'></em>
                    {
                      isVisiableSecondText(item.betHandicap, item.betN, item.kindsCode) &&
                      <em>{getBetHandiCapAtBetting(item.betHandicap, item.sportId)}</em>
                    }
                  </em>
                  <p>
                    <span>@</span>
                    <span>{formatCurrency(item.oddValue)}</span>
                  </p>
                </div>
                <div className='info-content'>
                  <ul className='info-list'>
                    <li>{getPlayNameByKc({code: item.kindsCode, name: item.betItemName, ctid: item.betItemCTID})}</li>
                    {
                      !isChampion(item.kindsCode) &&
                      <li>{`${item.homeTeamNameCn} VS ${item.awayTeamNameCn}`}</li>
                    }
                    <li>{item.leagueNameCn}</li>
                  </ul>
                </div>
              </li>
            ))
          }
          {
            confirmOrders.map((item)=>(
              <li className='series-item-info' key={item.id}>
                <div className='s-1'>
                  <span>{getSeriesDigitsStr(item.seriesType, confirmOrders[0].details.length)}</span>
                  <span>{getTitle(item.id)}</span>
                </div>
                <div className='s-3'>
                  <span>注单单号</span>
                  <span>{item.id}</span>
                </div>
                <div className='s-2'>
                  <div>
                    <span>最高可赢</span>
                    <em>{formatCurrency((item.maxWinAmount) || 0)}</em>
                  </div>
                  <div>
                    <span>投注金额</span>
                    <em className='bet-amount'>{formatCurrency((item.productAmountTotal) || 0)}</em>
                  </div>
                </div>
              </li>
            ))
          }
        </ul>

        <ul className='bet-info'>
          <li>
            {<span>总投注额</span>}
            <span>{formatCurrency(getProductAmountTotal() || 0)}</span>
          </li>
          <li>
            <span>预计总收益</span>
            <span>{formatCurrency(getmaxWinAmountTotal() || 0)}</span>
          </li>
        </ul>
        <div className='confirm-btn' onClick={()=>(close())}>
          <button>确认</button>
        </div>
      </div>
    );
  };
  const singleNotice = ()=>{
    return (
      <div className={style.noticeWrapper}>
        <div className='icon-success'>
          {!isSeries && <img src={successNotice}/>}
          {
            !checkResult.some((item) => item.status !== 0) && (confirmOrders[0].isReserve === 1 ? <em>预约注单已确认&nbsp;</em> : <em>注单已确认&nbsp;</em>)
          }
          {
            checkResult.find((item) => item.status === 3) && <em>{checkResult.filter((item) => item.status === 3).length}笔注单待确认&nbsp;</em>
          }
          {
            checkResult.find((item) => [2, 4, 5].includes(item.status)) && <em>{checkResult.filter((item) => [2, 4, 5].includes(item.status)).length}笔注单未完成</em>
          }
        </div>
        <div className='score-info'>
          <div className='odds'>
            <em>
              {getBetTeamType(confirmOrders[0].details[0])}
              <em className='space'></em>
              {
                isVisiableSecondText(confirmOrders[0].details[0].betHandicap, confirmOrders[0].details[0].betN, confirmOrders[0].details[0].kindsCode) &&
                <em>{getBetHandiCapAtBetting(confirmOrders[0].details[0].betHandicap, confirmOrders[0].details[0].sportId)}</em>
              }
            </em>
            <p>
              <span>@</span>
              <span>{formatCurrency(confirmOrders[0].details[0].oddValue)}</span>
            </p>
          </div>
          <div className='info-content'>
            <ul className='info-list'>
              <li>{getPlayNameByKc({code: confirmOrders[0].details[0].kindsCode, name: confirmOrders[0].details[0].betItemName, ctid: confirmOrders[0].details[0].betItemCTID})}</li>
              {
                !isChampion(confirmOrders[0].details[0].kindsCode) &&
                <li>{`${confirmOrders[0].details[0].homeTeamNameCn} VS ${confirmOrders[0].details[0].awayTeamNameCn}`}</li>
              }
              <li>{confirmOrders[0].details[0].leagueNameCn}</li>
            </ul>
          </div>
        </div>
        <ul className='bet-info'>
          <li>
            {<span>下注金额</span>}
            <span>{formatCurrency(confirmOrders[0].productAmountTotal)}</span>
          </li>
          <li>
            <span>可赢金额</span>
            <span>{formatCurrency(confirmOrders[0].maxWinAmount)}</span>
          </li>
          <li>
            {confirmOrders[0].isReserve === 1 && <span>预约单号</span>}
            {confirmOrders[0].isReserve === 2 && <span>注单单号</span>}
            <span className='order-num'>{confirmOrders[0].id}</span>
          </li>
        </ul>
        <div className='confirm-btn' onClick={()=>(close())}>
          <button>确认</button>
        </div>
      </div>
    );
  };
  return (
    <Overlay display={!_.isEmpty(confirmOrders)} zIndex={10} close={close}>
      {
        isSeries ? seriesNotice() : singleNotice()
      }
    </Overlay>
  );
};
