import {Button, Checkbox} from 'antd';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import DpIcon from '@this/components/Icon';
import {formatCurrency} from '@helpers/unit';
import DpSwitchButton from '@this/components/SwitchButton';
import styles from './style.scss';
import React, {useState} from 'react';
import OrderItem from './components/orderItem';
import ConfrimedOrders from './components/confrimedOrders';
import FastBetBtnsComponent from './components/fastBetBtns';
import {MultipleBetContext} from './components/MultipleBetContext';
import classnames from 'classnames';
import {TOrder} from '@core/services/Table';
import usePublicState from '@core/hooks/usePublicState';
import MultipleBetOrder from './components/MultipleBetOrder';
import {amountVilidation} from '@core/utils/math';
import {TMitt} from '@core/constants/enum/mitt';
import useEventEmitter from '@core/hooks/useEventEmitter';
interface IProps{
  hideOrderCart: () => void;
}
const items = [
  {
    label: '单关',
    value: '1',
  },
  {
    label: '串关',
    value: '2',
  },
];
export default React.memo(({hideOrderCart}: IProps) => {
  const [betType, setBetType] = React.useState('1');
  const {dispatch, ACTIONS} = usePublicState();
  const {isSeries, isExistConfirmed} = useOrderCart();
  React.useEffect(()=>{
    const checked = isSeries ? '2' : '1';
    setBetType(checked);
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className="go-back" onClick={hideOrderCart}>
        <DpIcon className='goback' width={24} height={24} type='goback'/>
        <span>返回导航</span>
      </div>
      {
        !isExistConfirmed && <div className='switch-type'>
          <DpSwitchButton value={betType} items={items}
            onChange={(item:string)=>{
              if (item ==='2') {
                dispatch(ACTIONS.BASE.toggleSerierWay({data: true}));
              } else {
                dispatch(ACTIONS.BASE.toggleSerierWay({data: false}));
              }
              setBetType(item);
            }}/>
        </div>
      }
      {
        betType === '1' ? <SingleBetPanel hideOrderCart={hideOrderCart}/> : <MultipleBetOrder hideOrderCart={hideOrderCart}/>
      }
    </div>
  );
});
const SingleBetPanel = React.memo(({hideOrderCart}: IProps) => {
  const [totalBetAmount, setTotalBetAmount] = useState('');
  const [alert, setAlert] = React.useState('');
  const [minBetAlert, setMinBetAlert] = React.useState(false);
  const inputRef = React.useRef<{[key: string]: HTMLInputElement}>({});
  const {user, base} = usePublicState();
  useEventEmitter<TMitt['submitErrorMsg']>({mittName: 'submitErrorMsg', on: (data) => {
    setAlert(data.display);
    setTimeout(() => {
      setAlert('');
    }, 3000);
  }});
  const {removeAllOrder, removeOrder, orders, orderTags, isExistConfirmed, setOrderMoney, maxBalance, verifyOrderTokenThenSubmitSingleOrder,
    confirmSubmitStatus, setConfirmAcceptChangeOdd, submitLoading, minBalance, updateOrder} = useOrderCart();
  const [orderStatus, setOrderStatus] = React.useState({
    fails: [],
    lockds: [],
    transforms: [],
  });
  React.useEffect(() => {
    const fails:Array<string> = [];
    const lockds:Array<string> = [];
    const transforms:Array<string> = [];
    _.each(orderTags, (tag) => {
      if (orders[tag].locked) {
        fails.push(tag);
        return;
      }
      if (!orders[tag].available) {
        lockds.push(tag);
        return;
      }
      if (orders[tag].od !== orders[tag].prevOdd) {
        transforms.push(tag);
      }
    });
    setOrderStatus({fails, lockds, transforms});
    return ()=>{
      setOrderStatus({
        fails: [],
        lockds: [],
        transforms: [],
      });
    };
  }, [orders]);
  const assginMoney = (betedAmount:string)=>{
    _.each(orderTags, (tag) => {
      inputRef.current[tag].value = betedAmount;
      setOrderMoney(betedAmount, tag);
    });
  };
  const getRemainAmount = ()=>{
    let allBetMoney = 0;
    _.each(orderTags, (tag) => {
      const money = orders[tag].money;
      allBetMoney = allBetMoney + Number(money);
    });
    const remain = user.info.totalBalance - allBetMoney;
    return remain <= 0 ? 0 : remain;
  };
  const getTotalBetAmount = ()=>{
    let allBetMoney = 0;
    _.each(orderTags, (tag) => {
      const money = orders[tag].money;
      allBetMoney = allBetMoney + Number(money);
    });
    return allBetMoney;
  };
  React.useEffect(()=>{
    if (isExistConfirmed) {
      setTotalBetAmount('');
    }
  }, [isExistConfirmed]);

  const onCancel = () => {
    hideOrderCart();
    removeAllOrder();
  };
  const clearInvaildOrders = () => {
    _.uniq([...orderStatus.fails, ...orderStatus.lockds]).forEach((tag:string)=>{
      if (!orders[tag].available || orders[tag].locked) {
        removeOrder(tag);
      }
    });
    setOrderStatus({
      fails: [],
      lockds: [],
      transforms: orderStatus.transforms,
    });
  };
  const hasInvalidOrder = () => {
    return orderStatus.fails.length > 0 || orderStatus.lockds.length > 0;
  };
  const hasTransformOrder = () => {
    return orderStatus.transforms.length > 0;
  };
  const renderRemoveFailsOrder =()=>{
    return (
      hasInvalidOrder() && <button className='fail-staus' onClick={clearInvaildOrders}>
        <p>移除无法投注项目</p>
        <DpIcon type='clear' />
      </button>
    );
  };
  const renderErrorMsg =(className?: string, text?: string)=>{
    return (
      <button className={`fail-staus od-status-text ${className ?? ''}`}>
        <p>{text || alert}</p>
      </button>
    );
  };
  const isReserveStatus=()=>{
    const order = _.find(orders, (item) => item.inReservationStatus === true);
    if (order) return true;
    return false;
  };
  const isDisable=()=>{
    const hasOrder = _.filter(Object.values(orders), (item: TOrder)=>Number(item.money) >= minBalance).length;
    return hasOrder ? false : true;
  };
  const handleChangeBalance = (value: string) => {
    const totalBalance =user.info.totalBalance;
    const averageAmount = Math.floor(totalBalance / orderTags.length);
    const betValStr = amountVilidation(value);
    const betVal: number = Number(betValStr);
    if (betVal > averageAmount) {
      setTotalBetAmount(String(averageAmount));
      assginMoney(String(averageAmount));
      return;
    }
    if (betVal > maxBalance) {
      setTotalBetAmount(String(maxBalance));
      assginMoney(String(maxBalance));
      return;
    }
    setTotalBetAmount(String(betVal));
    assginMoney(String(betVal));
  };
  const submitOrder = ()=>{
    const hasMinMoney = _.map(orders, 'money').filter((item:number)=>!!item).some((num: number) => num < 10);
    const hasMoney = _.map(orders, 'money').some((num: number) => num > 0);
    if (!hasMoney) {
      setMinBetAlert(true);
      setTimeout(() => {
        setMinBetAlert(false);
      }, 3000);
      return;
    }
    if (hasMinMoney) {
      setMinBetAlert(true);
      _.map(orders, (item) => {
        if (item.money && Number(item.money)<10) {
          updateOrder({...item, isMinBetAmount: true, money: 10}, item.tag);
        }
      });
      setTimeout(() => {
        setMinBetAlert(false);
      }, 3000);
      return;
    }
    verifyOrderTokenThenSubmitSingleOrder();
  };
  return (
    <div className={styles.single_bet_panel}>
      {
        isExistConfirmed ? <ConfrimedOrders/> :
        <>
          <div className="bet-list">
            <MultipleBetContext.Provider value={{inputRef, totalBetAmount, setTotalBetAmount, getRemainAmount, getTotalBetAmount}}>
              {
                orderTags.map((tag) => <OrderItem order={orders[tag]} tag={tag} key={tag} setTotalBetAmount={setTotalBetAmount} inputRef={inputRef} isReserveStatus={isReserveStatus} hasReserve/>)
              }
            </MultipleBetContext.Provider>
          </div>
          <div className='bottom-content'>
            <div className='bottom-wrap'>
              {
                !isExistConfirmed && orderTags.length > 1 &&
                <div className={classnames('bet-content', isReserveStatus() && 'reserve-opacity')}>
                  <div className='title'>
                    <span></span>
                    <span>多项注单</span>
                  </div>
                  <div className="fund-all">
                    <span className='orders'>{orderTags.length}X</span>
                    <div className='input-box'>
                      <input
                        type='text'
                        placeholder={`限额 10 ~ ${maxBalance}`}
                        value={totalBetAmount}
                        ref={(ref) => inputRef.current['all'] = ref}
                        onChange={(e) => {
                          handleChangeBalance(e.target.value);
                        }}/>
                      {totalBetAmount && totalBetAmount !='0' &&
                        <div className='close-input' onClick={() => {
                          setTotalBetAmount('');
                          assginMoney('');
                        }}>
                        </div>
                      }
                    </div>
                  </div>
                  <div className="fund-all">
                    <span className='orders'></span>
                    <div className="amount-after">最高可赢: { formatCurrency(_.sumBy(Object.values(orders), 'maxWin') || 0) } </div>
                  </div>
                  <MultipleBetContext.Provider value={{inputRef, totalBetAmount, setTotalBetAmount, getRemainAmount, getTotalBetAmount}}>
                    <FastBetBtnsComponent tag={'All'} isMultiple/>
                  </MultipleBetContext.Provider>
                </div>
              }
              {
                !alert && !minBetAlert && hasTransformOrder() && !hasInvalidOrder() && <div className='od-status-text'>赔率已更改</div>
              }
              {/* 移除失效的注单 */}
              {renderRemoveFailsOrder()}
              {alert && renderErrorMsg()}
              {minBetAlert && renderErrorMsg(null, '最小单笔投注金额为10.00')}
              {/* {submitLoading && renderErrorMsg('confirm-status', '订单需要系统审核，请关注投注记录')} */}
              <div className="action">
                {
                  submitLoading ? <div className={classnames('submit-loading', `time-${base.config.orderCheckMaxTime}`)}></div> : <>
                    <Button size="small" shape="round" onClick={onCancel}>取消</Button>
                    {
                      // 正常
                      !hasTransformOrder() && !hasInvalidOrder() &&
                      <Button type="primary" size="small" shape="round" loading={submitLoading} onClick={submitOrder}>投注</Button>
                    }
                    {
                      // 赔率变动
                      hasTransformOrder() && !hasInvalidOrder() &&
                      <Button type="primary" className={isDisable()?'':'od-change'} size="small" shape="round" loading={submitLoading} onClick={submitOrder}>
                          接受变化并投注
                      </Button>
                    }
                    {
                      // 失效
                      hasInvalidOrder() &&
                      <Button type="primary" shape="round" className='invalid-submit' disabled>
                          投注
                      </Button>
                    }
                  </>
                }
              </div>
            </div>
            <div className='od-status'>
              <Checkbox className='auto-odd-checked' checked={confirmSubmitStatus} onChange={(e)=>setConfirmAcceptChangeOdd(e.target.checked)}>
              </Checkbox>
              <em className='auto-odd pointer' onClick={() => setConfirmAcceptChangeOdd(!confirmSubmitStatus)}>自动接受赔率变更</em>
            </div>
          </div>
        </>
      }
    </div>
  );
});
