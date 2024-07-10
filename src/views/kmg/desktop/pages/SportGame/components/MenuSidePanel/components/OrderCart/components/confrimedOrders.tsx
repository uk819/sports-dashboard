import {Button, Tooltip} from 'antd';
import {useSelector} from 'react-redux';
import DpIcon from '@this/components/Icon';
import {formatCurrency} from '@helpers/unit';
import TStore from '@core/reducers/_reduxStore';
import {chooseEuropeOrAsiaText, displayHomeAwayScore, getBetHandiCapAtBetting, getBetTeamType, getPlayNameByKc, isChampion, isPlayingMatch, isVisiableSecondText} from '@core/utils';
import React from 'react';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import styles from './style.scss';
import {getSeriesDigitsStr} from '@core/utils/math';
import classnames from 'classnames';
import {ClockCircleOutlined, StopOutlined} from '@ant-design/icons';
import useTheme from '@core/hooks/useTheme';
// import {useHistory} from 'react-router';
const ConfrimedOrders = React.memo(() => {
  const orders = useSelector((state: TStore) => state.sport.bet.confirmOrders);
  const {isExistConfirmed, removeConfirmedOrders, backOrdersDispaly, checkResult} = useOrderCart();
  const {jsTheme} = useTheme();
  // const history = useHistory();
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
  const getIcon = (orderId: number) => {
    const order = checkResult.find((cr) => cr.orderId === orderId.toString());
    if (order?.status === 0) {
      return <DpIcon className='close' type='confirmed'/>;
    } else if ([2, 4, 5].includes(order?.status)) {
      return <StopOutlined color={jsTheme.textRed} />;
    } else {
      return <ClockCircleOutlined color={jsTheme.dpYellow} />;
    }
  };
  const singleBetOrder = ()=>{
    return orders.map((item) => (
      <div className="bet-item" key={item.id}>
        <Tooltip title={getTitle(item.id)}>
          <div className='confirm-icon'>
            {
              getIcon(item.id)
            }
          </div>
        </Tooltip>
        <div className="match-league">
          {item.details[0].leagueNameCn}
        </div>
        <div className="match-name">
          {
            !isChampion(item.details[0]?.kindsCode) &&
            <Tooltip
              title={
                <span>{item.details[0].homeTeamNameCn} VS {item.details[0].awayTeamNameCn}
                  {item.details[0].isInplay === 1 && displayHomeAwayScore(item.details[0].scoreBenchmark, item.details[0].sportId)}
                </span>
              }
            >
              <span>{item.details[0].homeTeamNameCn} VS {item.details[0].awayTeamNameCn}
                {item.details[0].isInplay === 1 && displayHomeAwayScore(item.details[0].scoreBenchmark, item.details[0].sportId)}
              </span>
            </Tooltip>
          }
        </div>
        <div className='market'>
          <div className='market-info'>
            <span className='top-game-type-wrap'>
              <span className="no-wrap">
                [{isPlayingMatch(item.details[0].isInplay, item.details[0].kindsCode)}]
              </span>
              <Tooltip title={getPlayNameByKc({code: item.details[0].kindsCode, name: item.details[0].betItemName, ctid: item.details[0].betItemCTID})}>
                <em className='pl-6 play-name-text'>{getPlayNameByKc({code: item.details[0].kindsCode, name: item.details[0].betItemName, ctid: item.details[0].betItemCTID})}</em>
              </Tooltip>
            </span>
            <span className='bet-game-type-text'>{chooseEuropeOrAsiaText(item.details[0].marketType, item.details[0].sportId)}</span>
          </div>
          <div className='team-win'>
            <Tooltip className={getBetTeamType(item.details[0])?'':'display-none'} title={`${getBetTeamType(item.details[0])}`}>
              {getBetTeamType(item.details[0])}
            </Tooltip>
            {
              isVisiableSecondText(item.details[0].betHandicap, item.details[0].betN, item.details[0].kindsCode) &&
              <em>{getBetHandiCapAtBetting(item.details[0].betHandicap, item.details[0].sportId)}</em>
            }
            {item.isReserve == 1 && <span className='resere-text'>[预约]</span>}
          </div>
          <div className='odd'>
            <div>@{formatCurrency(item.details[0].oddValue)}</div>
          </div>
        </div>
        <div className="amount-series">
          <div>
            <span>投注金额</span>
            <span>{formatCurrency((item.productAmountTotal) || 0)}</span>
          </div>
          <div>
            <span>最高可赢</span>
            <span className='text-right'>{formatCurrency((item.maxWinAmount) || 0) }</span>
          </div>
        </div>
      </div>
    ));
  };
  const getProductAmountTotal = ()=>{
    return _.reduce(orders, (result, item) => result + item.productAmountTotal, 0);
  };
  const getmaxWinAmountTotal = ()=>{
    const maxWinAmount =_.reduce(orders, (result, item) => result + item.maxWinAmount, 0);
    return maxWinAmount;
  };
  const mutipleBetOrder = ()=>{
    return (<>
      {
        orders[0].details.map((item, index) => (
          <div className="bet-item" key={item.orderId + index}>
            <Tooltip title={getTitle(item.orderId)}>
              <div className='confirm-icon'>
                {
                  getIcon(item.orderId)
                }
              </div>
            </Tooltip>
            <div className="match-league">
              {item.leagueNameCn}
            </div>
            <div className="match-name">
              {
                !isChampion(item?.kindsCode) &&
                <Tooltip
                  title={
                    <span>{item.homeTeamNameCn} VS {item.awayTeamNameCn}
                      {displayHomeAwayScore(item.scoreBenchmark, item.sportId)}
                    </span>
                  }
                >
                  <span>{item.homeTeamNameCn} VS {item.awayTeamNameCn}
                    {displayHomeAwayScore(item.scoreBenchmark, item.sportId)}
                  </span>
                </Tooltip>
              }
            </div>
            <div className='market'>
              <div className='market-info'>
                <span className='top-game-type-wrap'>
                  [{isPlayingMatch(item.isInplay, item.kindsCode)}]
                  <Tooltip title={getPlayNameByKc({code: item.kindsCode, name: item.betItemName, ctid: item.betItemCTID})}>
                    <em className='pl-6 play-name-text'>{getPlayNameByKc({code: item.kindsCode, name: item.betItemName, ctid: item.betItemCTID})}</em>
                  </Tooltip>
                </span>
                <span className='bet-game-type-text'>{chooseEuropeOrAsiaText(item.marketType, item.sportId)}</span>
              </div>
              <div className='team-win'>
                <Tooltip className={getBetTeamType(item)?'':'display-none'} title={`${getBetTeamType(item)}`}>{getBetTeamType(item)}</Tooltip>
                {
                  isVisiableSecondText(item.betHandicap, item.betN, item.kindsCode) &&
                  <em>{getBetHandiCapAtBetting(item.betHandicap, item.sportId)}</em>
                }
              </div>
              <div className='odd'>
                <div>@{formatCurrency(item.oddValue)}</div>
              </div>
            </div>
          </div>
        ))
      }
      {mutipleBetOrderSeries()}
      {mutipleBetOrderSeriesCount()}
    </>);
  };
  const mutipleBetOrderSeriesCount = ()=>{
    return (
      <div className="bet-item">
        <div className="amount-after-series-total">
          <div>
            <span>总投注 {orders.length}</span>
            <span>{formatCurrency(getProductAmountTotal() || 0)}</span>
          </div>
          <div>
            <span>预计总收益</span>
            <span className='theme-color'>{formatCurrency(getmaxWinAmountTotal() || 0)}</span>
          </div>
        </div>
      </div>
    );
  };
  const mutipleBetOrderSeries = ()=>{
    return orders.map((item) => (
      <div className="bet-item" key={item.id}>
        <Tooltip title={getTitle(item.id)}>
          <div className='confirm-icon'>
            {
              getIcon(item.id)
            }
          </div>
        </Tooltip>
        <div className="match-league-series">
          {getSeriesDigitsStr(item.seriesType, orders[0].details.length)}
        </div>
        <div className="amount-series">
          <div>
            <span>投注金额</span>
            <span>{formatCurrency((item.productAmountTotal) || 0)}</span>
          </div>
          <div>
            <span>最高可赢</span>
            <span className='text-right'>{formatCurrency((item.maxWinAmount) || 0)}</span>
          </div>
        </div>
      </div>
    ));
  };
  if (orders.length === 0) return null;
  return (
    <div className={styles.bet_list_onfrim_wrap}>
      <div className="bet-list">
        {
          orders[0].seriesType === 1 ? singleBetOrder() : mutipleBetOrder()
        }
      </div>
      {isExistConfirmed && checkResult.some((item) => item.status !== 0) ? (
        <div className={classnames('od-confirm', {alert: !!checkResult.find((item) => item.status !== 0)})}>
          {
            checkResult.find((item) => item.status === 3) && <>{checkResult.filter((item) => item.status === 3).length}笔注单待确认&nbsp;</>
          }
          {
            checkResult.find((item) => [2, 4, 5].includes(item.status)) && <>{checkResult.filter((item) => [2, 4, 5].includes(item.status)).length}笔注单未完成</>
          }
        </div>
      ) : (
        <div className='od-confirm'>
          您的订单已确认
        </div>
      )}
      <div className="action">
        <Button className="save" onClick={backOrdersDispaly}>
          保留选项
        </Button>
        {
          // checkResult.filter((item) => item.status !== 4).length > 0 ?
          // <Button className="submit" type="primary" onClick={() => history.push('/record')}>查看</Button> :
          <Button className="submit" type="primary" onClick={removeConfirmedOrders}>确认</Button>
        }
      </div>
    </div>
  );
});
export default ConfrimedOrders;
