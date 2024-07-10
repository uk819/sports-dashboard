import {Button, Checkbox} from 'antd';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import DpIcon from '@this/components/Icon';
import styles from '../style.scss';
import React, {useState} from 'react';
import OrderItem from './orderItem';
import ConfrimedOrders from './confrimedOrders';
import {MultipleBetContext} from './MultipleBetContext';
import MultipleBetOrderItem from './MultipleBetOrderItem';
import usePublicState from '@core/hooks/usePublicState';
import {Series} from '@core/apis/models/dashboard/get-betting-record';
import {useMemo} from 'react';
import {formatCurrency} from '@core/helpers/unit';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import {InfoCircleOutlined} from '@ant-design/icons';
import classnames from 'classnames';
import {isChampion} from '@core/utils';
interface IProps{
  hideOrderCart: () => void;
}
export default React.memo(({hideOrderCart}: IProps) => {
  const [totalBetAmount, setTotalBetAmount] = useState('');
  const inputRef = React.useRef<{[key: string]: HTMLInputElement}>({});
  const {user, base} = usePublicState();
  const [alert, setAlert] = React.useState('');
  const [isExpand, setIsExpand] = useState(true);
  const {removeAllOrder, removeOrder, orders, orderTags, isExistConfirmed, verifyOrderTokenThenSubmitSingleOrder,
    confirmSubmitStatus, setConfirmAcceptChangeOdd, submitLoading, seriesList, getSeriesData, updateSeriseOfMoneyBatch} = useOrderCart();
  const [activeFastBtn, setActiveFastBtn] = useState(null);
  const [minBetAlert, setMinBetAlert] = React.useState(false);
  useEventEmitter<TMitt['submitErrorMsg']>({mittName: 'submitErrorMsg', on: (data) => {
    setAlert(data.display);
    setTimeout(() => {
      setAlert('');
    }, 3000);
  }});
  const [orderStatus, setOrderStatus] = React.useState({
    fails: [],
    lockds: [],
    transforms: [],
    sameMatch: [],
  });
  React.useEffect(() => {
    getSeriesData();
    const fails:Array<string> = [];
    const lockds:Array<string> = [];
    const transforms:Array<string> = [];
    let sameMatchId:Array<number> = [];
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
    const matchIds = _.map(Object.values(orders), (item) => _.get(item, 'matchId'));
    const uniqueArr = _.uniq(matchIds);
    const hasDuplicates = uniqueArr.length !== matchIds.length;
    if (hasDuplicates) {
      // 筛选出重复的数字
      const duplicates = _.filter(matchIds, (val, i, iteratee) => _.includes(iteratee, val, i + 1));
      sameMatchId = duplicates;
    } else {
      sameMatchId = [];
    }
    setOrderStatus({fails, lockds, transforms, sameMatch: sameMatchId});
    return ()=>{
      setOrderStatus({
        fails: [],
        lockds: [],
        transforms: [],
        sameMatch: [],
      });
    };
  }, [orders]);
  React.useEffect(() => {
    getSeriesData();
  }, [orders, seriesList]);
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
  const amountVilidation = (v: string )=>{
    return v.replace(/[^\d.]/g, '') // 将非数字和点以外的字符替换成空
        .replace(/^\./g, '') // 验证第一个字符是数字而不是点
        .replace(/\.{2,}/g, '.') // 出现多个点时只保留第一个
        .replace('.', '$#$') // 1、将数字的点替换成复杂字符$#$
        .replace(/\./g, '') // 2、将字符串的点直接清掉
        .replace('$#$', '.') // 3、将复杂字符再转换回点
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
  };
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
      sameMatch: [],
      transforms: orderStatus.transforms,
    });
  };
  const hasInvalidOrder = () => {
    return orderStatus.fails.length > 0 || orderStatus.lockds.length > 0;
  };
  const hasSameMatchOrder = () => {
    const flag = orderStatus.sameMatch.length > 0 || hasChampion();
    return flag && (
      <button className='fail-staus'>
        <p>红色选项不可结合进行串关投注</p>
      </button>
    );
  };
  const assertSameMatchOrder = () => {
    return orderStatus.sameMatch.length > 0;
  };
  const hasChampion = () => {
    return orderTags.some((tag) => isChampion(orders[tag].kc));
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
  const isReserveStatus=()=>{
    const order = _.find(orders, (item) => item.inReservationStatus === true);
    if (order) return true;
    return false;
  };
  const isDisable=()=>{
    const hasOrder = _.filter(Object.values(seriesList), (item: Series)=>Number(item.money) >= item.minBetAmount).length;
    return hasOrder ? false : true;
  };
  const allBetAmount = useMemo(() => {
    return seriesList.reduce((a, b: any) => a += b.multiple * b.money, 0);
  }, [seriesList]);
  const allWinAmount = useMemo(() => {
    return seriesList.reduce((a, b: any) => a += b.maxWinAmount, 0);
  }, [seriesList]);
  const hasTwoOrderMore = ()=>{
    return orderTags.length >= 2;
  };
  const renderErrorMsg =(className?: string, text?: string)=>{
    return (
      <button className={`fail-staus od-status-text ${className ?? ''}`}>
        <p>{text || alert}</p>
      </button>
    );
  };
  const submitOrder = ()=>{
    const hasMinMoney = _.map(seriesList, 'money').filter((item:string)=>!!item).some((num: string) => Number(num) < 10);
    const hasMoney = _.map(seriesList, 'money').some((num: string) => Number(num) > 0);
    const ids = seriesList.filter((item: Series) => Number(item.money) < 10).map((item)=>item.id);
    if (!hasMoney) {
      setMinBetAlert(true);
      setTimeout(() => {
        setMinBetAlert(false);
      }, 3000);
      return;
    }
    if (hasMinMoney) {
      setMinBetAlert(true);
      updateSeriseOfMoneyBatch(ids);
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
          <div className="explain-box">
            <div className="dp-explain">
              <InfoCircleOutlined /> 串关赔率只展示欧盘
            </div>
          </div>
          <div className="bet-list">
            <MultipleBetContext.Provider value={{inputRef, totalBetAmount, setTotalBetAmount, getRemainAmount, amountVilidation, getTotalBetAmount}}>
              {
                orderTags.map((tag) => <OrderItem order={orders[tag]} tag={tag} key={tag} sameMatch={orderStatus.sameMatch} setTotalBetAmount={setTotalBetAmount} inputRef={inputRef} isReserveStatus={isReserveStatus} isSeries/>)
              }
              {seriesList.length>=1 && <MultipleBetOrderItem inputRef={inputRef} data={seriesList[0]} showOdd setActiveFastBtn={setActiveFastBtn} activeFastBtn={activeFastBtn}/>}
              {seriesList.length>=2 && <div className='switch-multiple' onClick={()=>setIsExpand(!isExpand)}>
                <em>复式连串过关投注</em>
                <DpIcon type='arrow' className={isExpand?'expand':'unexpand'}></DpIcon>
              </div>}
              {
                isExpand && seriesList.map((item, index)=>{
                  if (index === 0) return null;
                  return <MultipleBetOrderItem inputRef={inputRef} key={item.id} data={item} multi={index === seriesList.length - 1} seriesList={seriesList} setActiveFastBtn={setActiveFastBtn} activeFastBtn={activeFastBtn}/>;
                })
              }
            </MultipleBetContext.Provider>
          </div>
          <div className='bottom-content'>
            <div className='multiple-bottom-wrap'>
              <div className='multiple-info'>
                <p>
                  <em>总投注：</em>
                  <em className='blod'>{formatCurrency((allBetAmount || 0))}</em>
                </p>
                <p>
                  <em>预计总收益：</em>
                  <em className='blod theme-color'>{formatCurrency((allWinAmount || 0))}</em>
                </p>
              </div>
              {
                !hasTwoOrderMore() && <div className='od-status-text'>至少选择两场比赛</div>
              }
              {
                !alert && !minBetAlert && hasTwoOrderMore() && hasTransformOrder() && !hasInvalidOrder() && <div className='od-status-text'>赔率已更改</div>
              }
              {/* 移除失效的注单 */}
              {renderRemoveFailsOrder()}
              {hasSameMatchOrder()}
              {alert && renderErrorMsg()}
              {minBetAlert && renderErrorMsg(null, '最小单笔投注金额为10.00')}
              <div className="action">
                {
                  submitLoading ? <div className={classnames('submit-loading', `time-${base.config.orderCheckMaxTime}`)}></div> : <>
                    <Button size="small" shape="round" onClick={onCancel}>取消</Button>
                    {
                      // 正常
                      !assertSameMatchOrder()&& !hasTransformOrder() && !hasInvalidOrder() && !hasChampion() &&
                      <Button type="primary" size="small" shape="round" loading={submitLoading} onClick={submitOrder}>投注</Button>
                    }
                    {
                      // 赔率变动
                      !assertSameMatchOrder() && hasTransformOrder() && !hasInvalidOrder() && !hasChampion() &&
                      <Button type="primary" className={isDisable()?'':'od-change'} size="small" shape="round" loading={submitLoading} onClick={submitOrder}>
                          接受变化并投注
                      </Button>
                    }
                    {
                      // 失效
                      (assertSameMatchOrder() || hasInvalidOrder() || hasChampion()) &&
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
