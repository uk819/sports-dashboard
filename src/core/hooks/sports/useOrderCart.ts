/*
 * @Author: Passion.KMG
 * @Date: 2023-12-20 17:08:42
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/hooks/sports/useOrderCart.ts
 * @Description: 订单操作
 */
import {useSelector} from 'react-redux';
import {OddType, TOrder} from '@core/services/Table';
import IStore, {TStore, TUser} from '@core/reducers/_reduxStore';
import usePublicState from '../usePublicState';
import {getViewOddFn, getViewOddType} from './useOddTransfer';
import useGuard from './useGuard';
import * as ESport from '@constants/enum/sport';
import storage from '@core/helpers/storage';
import useEventEmitter from '../useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import {chooseEuropeOrAsia} from '@core/utils';
import {find} from 'lodash';
import {Series} from '@core/apis/models/dashboard/get-betting-record';
import {getMaxLimitAmount} from '@core/services/limitBetAmoun';

import {interceptedTwoDigits, interceptedTwoDigitsToString} from '@core/utils/math';
import {useEffect} from 'react';
export default () => {
  const {dispatch, ACTIONS, user, base} = usePublicState();
  const {addGuard, updateQuerys} = useGuard();
  const pollIntervalGuard = useSelector((state: IStore) => state.sport.pollIntervalGuard);
  const {orders, orderTags, confirmOrders, checkResult} = useSelector((state: IStore) => state.sport.bet);
  const {toggleSeries: isSeries, config} = useSelector((state: IStore) => state.base);
  const isSeriesVisible = useSelector((state: IStore) => state.base.toggleSeriesVisible);
  const {confirmSubmitStatus, currentOddType} = useSelector((state: IStore) => state.user);
  const seriesList = useSelector((state: IStore) => state.sport.seriesList);
  const [isExistConfirmed, setIsExistConfirmedOrder] = React.useState(false);
  const betOrderMitt = useEventEmitter<TMitt['toggleBetOrder']>({mittName: 'toggleBetOrder'});
  // const switchAutoOddMitt = useEventEmitter<TMitt['switchAutoOdd']>({mittName: 'switchAutoOdd'});
  const visibleBetOrderMitt = useEventEmitter<TMitt['visibleBetOrder']>({mittName: 'visibleBetOrder'});
  const submitErrorMsg = useEventEmitter<TMitt['submitErrorMsg']>({mittName: 'submitErrorMsg'});
  const sportList = useSelector((state: TStore) => state.sport.display.matchStatistics);
  const limitData = useSelector((state: TStore) => state.user.limitData);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  // 限额金额
  const minBalance = 10;
  const [maxBalance, setMaxBalance] = React.useState(0);
  let timer: any = null;
  let outTimer: any = null;
  // 设置订单金额
  const setOrderMoney = React.useCallback((money: string | number, tag: string) => {
    if (!orders[tag]) return;
    const amount = Number(money);
    const orderInfo = {tag, money};
    if (money !== '' && (amount<orders[tag].minBetAmount || amount > orders[tag].maxBetAmount)) {
      dispatch(ACTIONS.SPORT.updateOrderMoney({...orderInfo, overAmountLimit: true}));
      return;
    }
    dispatch(ACTIONS.SPORT.updateOrderMoney(orderInfo));
  }, [orderTags]);
  // 更改预约单状态
  const updateOrderReserve = React.useCallback((tag: string, reservationOdd: string, status: boolean = true) => {
    if (!orders[tag]) return;
    dispatch(ACTIONS.SPORT.updateOrderReserve({tag, inReservationStatus: status, reservationOdd: reservationOdd}));
  }, [orderTags]);
  // 更改预约单赔率
  const updateOrderReserveOdd = React.useCallback((tag: string, reservationOdd: string) => {
    if (!orders[tag]) return;
    dispatch(ACTIONS.SPORT.updateOrderReserveOdd({tag, reservationOdd, currentOddType}));
  }, [orderTags, currentOddType]);
  // 删除已确认提交订单列表
  const removeConfirmedOrders = () => {
    removeAllOrder();
    dispatch(ACTIONS.SPORT.removeConfirmedOrders());
  };
  const pullNewestOrdersOdd = React.useCallback((orders: any) => {
    if (_.isEmpty(orders)) return;
    const data = _.map(orders, (it) => ({
      matchId: it.matchId,
      betItemsId: Number(it.id),
    }));
    dispatch(ACTIONS.SPORT.getLatestOdds({data: data}));
  }, []);
  React.useEffect(()=>{
    if (_.isEmpty(orders)) return;
    getDatas();
  }, []);
  const setConfirmAcceptChangeOdd =(status: boolean)=>{
    dispatch(ACTIONS.USER.setIsAccpetAutoOdd({data: status}));
    // switchAutoOddMitt.emit({display: status});
  };
  const getDatas = React.useCallback(()=>{
    const data = _.map(orders, (it) => ({
      matchId: it.matchId,
      betItemsId: Number(it.id),
    }));
    const betOddsGuard = pollIntervalGuard[ESport.EPollIntervalGuardKeys.BETTING_ODDS];
    if (_.isEmpty(betOddsGuard)) {
      addGuard(ESport.EPollIntervalGuardKeys.BETTING_ODDS, data);
      return;
    }
    updateQuerys(ESport.EPollIntervalGuardKeys.BETTING_ODDS, data);
  }, [orders]);
  // 返回订单列表
  const backOrdersDispaly = () => {
    orderTags.map((tag)=>{
      setOrderMoney('', tag);
    });
    isSeries && removeSeriseOfMoney();
    dispatch(ACTIONS.SPORT.removeConfirmedOrders());
  };
  // 删除或添加订单
  const addAndRemoveOrder = (odd: OddType) => {
    const order = _.find(orders, (item) => item.tag === odd.tag);
    if (isExistConfirmed) {
      removeAllOrder();
      removeConfirmedOrders();
      if (!order) {
        addOrder(odd);
      }
      return;
    }
    if (order) {
      removeOrder(odd.tag);
      return;
    }
    // 如果订单列表中不存在该订单，则添加
    addOrder(odd);
  };
  function calculateCombinations(matchs: number, series: number) {
    const factorial = (num: number) => {
      let result = 1;
      for (let i = 1; i <= num; i++) {
        result *= i;
      }
      return result;
    };
    const numerator = factorial(matchs);
    const denominator = factorial(series) * factorial(matchs - series);
    return numerator / denominator;
  }
  const generateSeriesData = React.useCallback(()=>{
    const orderList = Object.values(orders);
    if (orderList.length<2) {
      updateSerise([]);
      return;
    }
    const seriess:Array<Series> = [];
    const odds = _.orderBy(_.map(orderList, 'europeOdd'), [], ['desc']);
    const oddsTotal = _.reduce(odds, (result, num) => result * num, 1);
    orderList.map((item: TOrder, index: number)=>{
      let template = {
        multiple: 1,
        minBetAmount: 10.00,
        maxBetAmount: 100,
        firstText: 0,
        secondText: 0,
        optimalOd: 0,
        money: '',
        odd: 0,
        oddsTotal: 0,
        id: '',
        type: '',
        compose: false,
        maxWinAmount: 0,
        maxWinAmountLimit: 100,
        maxWinAmountStr: '0.00',
        overAmountLimit: false,
      };
      const i = 2+index;
      if (orderList.length < i) {
        const series = seriess.pop();
        seriess.unshift(series);
        if (orderList.length > 2) {
          let seriesOddTotal = 0;
          let maxWinAmount = 0;
          const multiple = Number(_.reduce(seriess, (result, n) => result + n.multiple, 0));
          const id = i +'-serier-' + multiple;
          const s = seriesList.find((l)=>l.id === id);
          template.money = s?.money || '';
          seriesList.map((item)=>{
            if (item.compose) return;
            const maxWin = item.odd * Number(template.money || 0);
            const itemMaxWinAmount = maxWin - Number(template.money || 0) * item.multiple;
            maxWinAmount += itemMaxWinAmount;
            seriesOddTotal = seriesOddTotal + item.odd;
          });
          const limitAmount = calcBetLimitForSeries(seriesOddTotal);
          const tmpMaxWinAmount = interceptedTwoDigits(maxWinAmount);
          if (template.money && Number(template.money)< template.minBetAmount || Number(template.money) > limitAmount) {
            template.overAmountLimit = true;
          }
          template = {...template, oddsTotal: oddsTotal, firstText: i - 1, secondText: multiple, odd: 0, multiple, id,
            type: i - 1 + '00' + multiple, compose: true, maxBetAmount: limitAmount, maxWinAmount: tmpMaxWinAmount,
            maxWinAmountStr: interceptedTwoDigitsToString(maxWinAmount)};
          seriess.push(template);
        }
        return;
      }
      const multiple = calculateCombinations(orderList.length, i);
      const id = i +'-serier-' + multiple;
      const s = seriesList.find((l)=>l.id === id);
      template.money = s?.money || '';
      let maxWinAmount = 0;
      const odList = combination(odds, i);
      const totalOdd = getOrderTotalOdd(odList);
      const limitAmount = calcBetLimitForSeries(totalOdd);
      maxWinAmount = interceptedTwoDigits(((totalOdd * Number(template.money)) - Number(template.money || 0) * multiple));
      const maxWinAmountStr = interceptedTwoDigitsToString(((totalOdd * Number(template.money)) - Number(template.money || 0) * multiple));
      if (template.money && Number(template.money)<template.minBetAmount || Number(template.money) > limitAmount) {
        template.overAmountLimit = true;
      }
      template = {...template, oddsTotal: oddsTotal, firstText: i, secondText: 1, odd: totalOdd, multiple, id, type: i+'00'+ multiple,
        maxBetAmount: limitAmount, optimalOd: 0, maxWinAmount, maxWinAmountStr: maxWinAmountStr};
      seriess.push(template);
      return;
    });
    updateSerise(seriess);
  }, [seriesList, orders]);
  // 实现组合算法
  function combination(arr:Array<number>, k: number) {
    const result:Array<number[]> = [];
    function helper(temp: any, start: number) {
      if (temp.length === k) {
        result.push(temp.slice()); // 将结果存储到 result 数组中
        return;
      }
      for (let i = start; i < arr.length; i++) {
        temp.push(arr[i]);
        helper(temp, i + 1);
        temp.pop();
      }
    }
    helper([], 0);
    return result;
  }
  // 所有组合赔率
  const getOrderTotalOdd = (arr: Array<number[]>)=>{
    let total = 0;
    arr.map((items)=>{
      const odd= Number(_.reduce(items, (result, n) => result * n, 1));
      total += odd;
    });
    return total;
  };
  const updateSerise = (seriess:Array<Series>)=>{
    if (JSON.stringify(seriesList) === JSON.stringify(seriess)) return;
    dispatch(ACTIONS.SPORT.updateSeriseData(seriess));
  };
  const calcBetLimitForSeries = (odd: number)=>{
    const maxWin = 100000;
    return Number.parseInt((maxWin / odd)+'');
  };
  const updateSeriseOfMoney = (id: string, money: string)=>{
    const serises = seriesList.map((item)=>{
      if (item.id ===id) return {...item, money};
      return item;
    });
    updateSerise(serises);
  };
  const updateSeriseOfMoneyBatch = (ids: string[]) => {
    const serises = seriesList.map((item) => {
      if (ids.includes(item.id)) return {...item, money: String(minBalance)};
      return item;
    });
    updateSerise(serises);
  };
  const removeSeriseOfMoney = ()=>{
    const serises = seriesList.map((item)=>{
      return {...item, money: ''};
    });
    updateSerise(serises);
  };
  const getSeriesData = React.useCallback(()=>{
    if (!isSeries) return;
    generateSeriesData();
  }, [isSeries, orders, seriesList]);
  React.useEffect(() => {
    if (_.isEmpty(orders)) return;
    const orderList =_.values(orders);
    const maxBet = _.minBy(orderList, 'maxBetAmount');
    setMaxBalance(maxBet.maxBetAmount);
  }, [orders]);
  React.useEffect(() => {
    if (confirmOrders && confirmOrders.length>0) {
      setIsExistConfirmedOrder(true);
    } else {
      setIsExistConfirmedOrder(false);
    }
  }, [confirmOrders]);
  const assertLimitTypeAmount = (userOrderLimit: TUser['limitData']['userOrderLimit'], otherOrderLimit: TUser['limitData']['userOrderLimit'])=>{
    if (userOrderLimit) {
      return userOrderLimit.maxWinAmountLimit > otherOrderLimit.maxWinAmountLimit ? otherOrderLimit : userOrderLimit;
    }
    return otherOrderLimit;
  };
  const chooseLimitBetAmount = (limitData: TUser['limitData'], sportId: number, matchLimitAmount: number)=>{
    let finallyLimit = null;
    const cp = _.cloneDeep(limitData);
    const {userOrderLimit, sportUserOrderLimit, esportUserOrderLimit} = cp;
    if (sportId > 33) {
      finallyLimit = assertLimitTypeAmount(userOrderLimit, esportUserOrderLimit);
      finallyLimit.productAmountTotalLimit = matchLimitAmount > finallyLimit.productAmountTotalLimit ? finallyLimit.productAmountTotalLimit : matchLimitAmount;
    } else {
      finallyLimit = assertLimitTypeAmount(userOrderLimit, sportUserOrderLimit);
      finallyLimit.productAmountTotalLimit = matchLimitAmount > finallyLimit.productAmountTotalLimit ? finallyLimit.productAmountTotalLimit : matchLimitAmount;
    }
    console.log('userOrderLimit', userOrderLimit);
    console.log('sportUserOrderLimit', sportUserOrderLimit);
    console.log('esportUserOrderLimit', esportUserOrderLimit);
    console.log('finallyLimit', finallyLimit);
    return finallyLimit;
  };
  // 添加订单
  const addOrder = React.useCallback((odd: OddType) => {
    if (orderTags.length === 10) {
      dispatch(ACTIONS.BASE.openToast({text: '投注量已达上限', types: 'error'}));
      return;
    };
    const europeOdd = getViewOddFn(odd.od, odd.oddBetType, 1);
    pullNewestOrdersOdd({...orders, [odd.tag]: odd});
    const sportName = find(sportList, {sportId: odd.sportId})?.sportName;
    const currentOddType = chooseEuropeOrAsia(odd.oddBetType, odd.sportId, user.currentOddType);
    delExistSameBetOrderForSeries(odd.matchId);
    const matchLimitAmount = getMaxLimitAmount(odd.lv, odd.sportId, odd.isRunning ? 1 : 2, odd.kc);
    const limit = chooseLimitBetAmount(limitData, odd.sportId, matchLimitAmount);
    dispatch(ACTIONS.SPORT.addOrder({data: {...odd, money: '', currentOddType, sportNameText: sportName, europeOdd: Number(europeOdd),
      maxBetAmount: limit.productAmountTotalLimit, maxWinAmount: limit.maxWinAmountLimit}}));
    visibleBetOrderMitt.emit({display: true});
  }, [orders, user.currentOddType, maxBalance, isSeries, limitData]);
  const delExistSameBetOrderForSeries =(matchId: number)=>{
    if (isSeries) {
      _.forEach(orders, (order)=>{
        if (order.matchId === matchId) {
          dispatch(ACTIONS.SPORT.removeOrder({data: {tag: order.tag}}));
          return;
        }
      });
    }
  };
  // 删除订单
  const removeOrder = React.useCallback((tag: string) => {
    const newest = _.omit({...orders}, tag);
    pullNewestOrdersOdd(newest);
    dispatch(ACTIONS.SPORT.removeOrder({data: {tag}}));
  }, [orders]);

  // 清空所有订单
  const removeAllOrder = React.useCallback(() => {
    dispatch(ACTIONS.SPORT.removeAllOrder());
  }, []);

  // 關閉已投注
  const closeConfirmedOrder = React.useCallback(() => {
    dispatch(ACTIONS.SPORT.closeConfirmedOrder());
  }, []);
  const getOrderToken = (isRetry: boolean)=>{
    dispatch(ACTIONS.SPORT.getBetorderToken({
      data: null,
      cb: (data: any)=>{
        if (data.code!==0) {
          dispatch(ACTIONS.BASE.openToast({text: data.msg, types: 'error'}));
          return;
        }
        storage.set('ORDER_TOKEN', data.data, 290);
        if (isRetry) return;
        !isSeries ? submitSingleOrder() : submitOrderMultipeOrder();
      }}));
  };
  // 修改订单
  const updateOrder = React.useCallback((diffOrder: any, orderTag: string) => {
    dispatch(ACTIONS.SPORT.updateOrder({data: {tag: orderTag, ...diffOrder}}));
  }, []);
  // 批量修改订单
  const updateOrderBacth = React.useCallback((orders: {[key: string]: TOrder}) => {
    dispatch(ACTIONS.SPORT.updateOrderBatch({data: orders}));
  }, []);
  const verifyOrderTokenThenSubmitSingleOrder = React.useCallback(() => {
    setSubmitLoading(true);
    if (storage.get('ORDER_TOKEN')) {
      !isSeries ? submitSingleOrder() : submitOrderMultipeOrder();
    } else {
      getOrderToken(false);
    }
  }, [isSeries, orders, seriesList]);
  const assignOddType = (order: TOrder, confirmSubmitStatus: boolean) =>{
    if (_.isEmpty(order)) return confirmSubmitStatus ? 3 : 1; // 如果为空，则时串单
    if (order.inReservationStatus) return 3; // 如果预约注单,直接接受任何赔率
    return confirmSubmitStatus ? 3 : 1;
  };
  const msgAlert = (msg: string)=>{
    if (process.env.CLIENT_MODE === 'mobile') {
      dispatch(ACTIONS.BASE.openToast({text: msg, types: 'error'}));
    } else {
      submitErrorMsg.emit({display: msg});
    }
  };
  // 提交单式订单
  const submitSingleOrder = React.useCallback(() => {
    const invalidOrder = _.filter(orders, (item) => item.money && item.money !== '0' && Number(item.money) < 10 );
    const vaildOrder = _.filter(orders, (item) => item.money && item.money !== '0');
    const _validOrders = Object.values(vaildOrder);
    if (invalidOrder.length > 0) {
      msgAlert('最小投注不能低于10元');
      setSubmitLoading(false);
      return;
    }
    if (_validOrders[0].inReservationStatus && Number(_validOrders[0].reservationOdd) < _validOrders[0].reservationMarkOdd) {
      msgAlert('预约赔率不能小于下注时赔率');
      setSubmitLoading(false);
      return;
    }
    // 组合投注项请求对象
    const isCrossCompetition = +(_.uniqBy(_validOrders, 'leagueId').length > 1);
    const betPayload = _.map(_validOrders, (item) => {
      const marketType = getViewOddType(item.oddBetType, user.currentOddType, base.toggleSeries);
      const oddValue = getViewOddFn(item.od, item.oddBetType, marketType);
      return {
        betCount: 1,
        betOrderDetailRequestDTOS: [{
          marketType,
          betItemId: item.id,
          leagueId: item.leagueId,
          matchId: item.matchId,
          oddValue: item.inReservationStatus ? item.reservationOdd : Number(oddValue),
          sportId: item.sportId,
          betHandicap: item.betHandicap,
        }],
        isReserve: item.inReservationStatus ? 1 : 2,
        currency: 'CNY',
        deviceType: 1,
        isCrossCompetition,
        oddAcceptionType: assignOddType(item, confirmSubmitStatus),
        orderAmount: Number(item.money),
        productAmountTotal: Number(item.money),
        seriesType: 1,
      };
    });
    const orderToken = storage.get('ORDER_TOKEN');
    // 提交订单
    dispatch(ACTIONS.SPORT.submitOrder({
      data: betPayload,
      headers: {'orderToken': orderToken},
      cb: (orders:any) => {
        const {msg, code, data} = orders;
        if (code!==0) {
          if (code === 10510) {
            dispatch(ACTIONS.USER.setBetLimit({
              cb: (res: any) => {
                resetLimitOrder(res.data);
              },
            }));
          }
          code === 10503 && getOrderToken(true);
          msgAlert(msg);
          setSubmitLoading(false);
          return;
        }
        msgAlert(undefined);
        dispatch(ACTIONS.USER.getUserInfo({}));
        // dispatch(ACTIONS.SPORT.showConfirmedOrder());
        // dispatch(ACTIONS.SPORT.addConfirmedOrders(data));
        storage.remove('ORDER_TOKEN');
        // betOrderMitt.emit({display: false});
        // setSubmitLoading(false);
        checkOrderStatus(data);
      },
    }));
  }, [orders, confirmSubmitStatus]);
  // 根据返回的限额重新设置到订单中
  const resetLimitOrder = (data: any, isSeries?: boolean)=>{
    if (isSeries) {
      generateSeriesData();
    } else {
      _.map(orders, (item:TOrder)=>{
        const matchLimitAmount = getMaxLimitAmount(item.lv, item.sportId, item.isRunning ? 1 : 2, item.kc);
        const limit = chooseLimitBetAmount(data, item.sportId, matchLimitAmount);
        item.maxWinAmount = limit.maxWinAmountLimit;
        item.maxBetAmount = limit.productAmountTotalLimit;
      });
      updateOrderBacth({...orders});
    };
  };
  const submitOrderMultipeOrder = React.useCallback(() => {
    const invaildOrder = _.filter(seriesList, (item) => item.money && item.money !== '0' && Number(item.money) < item.minBetAmount);
    const vaildOrder = _.filter(seriesList, (item) => item.money && item.money !== '0');

    if (invaildOrder.length > 0) {
      msgAlert('最小投注不能低于10元');
      setSubmitLoading(false);
      return;
    }
    if (vaildOrder.length === 0) {
      msgAlert('最小投注不能低于10元');
      setSubmitLoading(false);
      return;
    }
    const _orders = Object.values(orders);
    // 组合投注项请求对象
    const isCrossCompetition = +(_.uniqBy(_orders, 'leagueId').length > 1);
    const betOrderDetailRequestDTOS:Array<any> = [];
    _.map(_orders, (item) => {
      const marketType = getViewOddType(item.oddBetType, user.currentOddType, base.toggleSeries);
      const oddValue = getViewOddFn(item.od, item.oddBetType, marketType);
      betOrderDetailRequestDTOS.push({
        marketType,
        betItemId: item.id,
        leagueId: item.leagueId,
        matchId: item.matchId,
        oddValue: oddValue,
        sportId: item.sportId,
        betHandicap: item.betHandicap,
      });
    });
    const series = _.map(vaildOrder, (item) => {
      return {
        betCount: betOrderDetailRequestDTOS.length,
        betOrderDetailRequestDTOS: betOrderDetailRequestDTOS,
        isReserve: 2,
        currency: 'CNY',
        deviceType: 1,
        isCrossCompetition,
        oddAcceptionType: assignOddType(null, confirmSubmitStatus),
        orderAmount: Number(item.money),
        productAmountTotal: Number(item.money) * Number(item.multiple),
        seriesType: item.type,
      };
    });
    const orderToken = storage.get('ORDER_TOKEN');
    dispatch(ACTIONS.SPORT.submitOrder({
      data: series,
      headers: {'orderToken': orderToken},
      cb: (orders:any) => {
        const {msg, code, data} = orders;
        if (code!==0) {
          code === 10503 && getOrderToken(true);
          msgAlert(msg);
          setSubmitLoading(false);
          return;
        }
        msgAlert(undefined);
        // dispatch(ACTIONS.BASE.openToast({text: '投注成功', types: 'success'}));
        dispatch(ACTIONS.USER.getUserInfo({}));
        // dispatch(ACTIONS.SPORT.showConfirmedOrder());
        // dispatch(ACTIONS.SPORT.addConfirmedOrders(data));
        storage.remove('ORDER_TOKEN');
        // betOrderMitt.emit({display: false});
        // setSubmitLoading(false);
        checkOrderStatus(data);
      },
    }));
  }, [orders, confirmSubmitStatus, seriesList]);

  // 订单确认中逻辑
  const checkOrderStatus = (data: any) => {
    clearInterval(timer);
    timer = setInterval(() => {
      dispatch(ACTIONS.SPORT.betOrderCheck({data: {orderIds: data.map((item: any) => item.id)}, cb: (res: any) => {
        if (res.code === 0) {
          dispatch(ACTIONS.SPORT.updateCheckResult(res.data));
          if (!res.data.some((item: any) => item.status === 3)) {
            clearInterval(timer);
            clearTimeout(outTimer);
            dispatch(ACTIONS.SPORT.showConfirmedOrder());
            dispatch(ACTIONS.SPORT.addConfirmedOrders(data));
            betOrderMitt.emit({display: false});
            setSubmitLoading(false);
          }
        } else {
          msgAlert(res.msg);
        }
      }}));
    }, 1000);
    outTimer = setTimeout(() => {
      clearInterval(timer);
      dispatch(ACTIONS.SPORT.showConfirmedOrder());
      dispatch(ACTIONS.SPORT.addConfirmedOrders(data));
      betOrderMitt.emit({display: false});
      setSubmitLoading(false);
    }, config.orderCheckMaxTime * 1000);
  };
  useEffect(() => {
    return () => {
      clearInterval(timer);
      setSubmitLoading(false);
    };
  }, []);
  return {
    addAndRemoveOrder,
    addOrder,
    removeOrder,
    removeAllOrder,
    updateOrder,
    orders,
    orderTags,
    confirmOrders,
    isExistConfirmed,
    setOrderMoney,
    submitSingleOrder,
    closeConfirmedOrder,
    removeConfirmedOrders,
    backOrdersDispaly,
    maxBalance,
    minBalance,
    updateOrderReserve,
    updateOrderReserveOdd,
    verifyOrderTokenThenSubmitSingleOrder,
    confirmSubmitStatus,
    setConfirmAcceptChangeOdd,
    pullNewestOrdersOdd,
    submitLoading,
    setSubmitLoading,
    seriesList,
    updateSeriseOfMoney,
    updateSeriseOfMoneyBatch,
    getSeriesData,
    isSeries,
    isSeriesVisible,
    checkResult,
  };
};
