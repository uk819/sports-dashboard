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
import style from './style.scss';
import {TOrder} from '@core/services/Table';
import classnames from 'classnames';
import {formatCurrency} from '@core/helpers/unit';
import {amountVilidation, interceptedTwoDigitsToString} from '@core/utils/math';
import {Series} from '@core/apis/models/dashboard/get-betting-record';
import DpIcon from '@views/kmg/mobile/components/Icon';
interface IProps{
  order?: TOrder
  orders?: Array<TOrder>
  hideModalAddMatchs?: Function
  setHeight?: Function
  height?: number
  close?: Function
  orderStatus?: {
   fails: Array<string>,
   lockds: Array<string>
  }
 }
export default React.memo(({orders, close}: IProps) => {
  const {seriesList, updateSeriseOfMoney, getSeriesData, removeOrder} = useOrderCart();
  const [isExpand, setIsExpand] = React.useState(false);
  const [checked, setChecked] = React.useState({} as Series);
  const [checkedAmount, setCheckedAmount] = React.useState('');
  const myDiv = React.useRef(null);
  const info = useSelector((state: TStore) => state.user.info);
  const allBetAmount = React.useMemo(() => {
    return seriesList.reduce((a, b: any) => a += b.multiple * b.money, 0);
  }, [seriesList]);
  const allWinAmount = React.useMemo(() => {
    return seriesList.reduce((a, b: any) => a += b.maxWinAmount, 0);
  }, [seriesList]);
  const scrollToBottom = () => {
    myDiv.current.scrollTop = myDiv.current.scrollHeight;
  };
  const handleChangeBalance = (v: string) => {
    const value =amountVilidation(v);
    const amountStr: number = Number(value);
    if (amountStr > checked?.maxBetAmount) return;
    updateSeriseOfMoney(checked?.id, String(value));
    setChecked({...checked, money: String(value)});
  };
  const hasInvalidOrder = () => {
    const isExist = _.find(orders, (item)=> !item.available || item.locked);
    return isExist ? true : false;
  };
  const clearInvaildOrders = () => {
    orders.map((item)=>{
      if (!item.available || item.locked) removeOrder(item.tag);
    });
  };
  const isOverBetAmount = (min: number, max: number)=>{
    if (max < min) {
      return {
        flag: true,
        text: `不可投注`,
      };
    }
    return {
      flag: false,
      text: `限额${min} ~ ${max}`,
    };
  };
  React.useEffect(()=>{
    getSeriesData();
    if (checked?.id) {
      const result = _.find(seriesList, (item: Series)=>item.id === checked?.id);
      setChecked(result);
    }
  }, [seriesList]);
  React.useEffect(()=>{
    scrollToBottom();
  }, [isExpand]);
  React.useEffect(()=>{
    seriesList.length>0 && setChecked(seriesList[0]);
  }, []);
  const seriesItemRender = (item: Series, isFrist?: boolean)=>{
    return item && (
      <div key={item.id} className={classnames('series-item', checked?.id === item.id && 'series-checked')}
        onClick={()=>{
          setChecked(item);
          setCheckedAmount('');
        }}>
        <div className='series-info'>
          <span>
            <em>{item.firstText}串{item.secondText}</em>
            {isFrist && <em>@{interceptedTwoDigitsToString(item.oddsTotal)}</em>}
          </span>
          {!isOverBetAmount(item.minBetAmount, item.maxBetAmount).flag && <span>
            最高可赢 {interceptedTwoDigitsToString(item.maxWinAmount)}
          </span>
          }
        </div>
        <div className='input-wrap'>
          {item.money}
          {!isOverBetAmount(item.minBetAmount, item.maxBetAmount).flag && checked?.id === item.id && <span className='cursor'></span>}
          {!isOverBetAmount(item.minBetAmount, item.maxBetAmount).flag && !item.money &&<span>限额 {item.minBetAmount} - {item.maxBetAmount}</span>}
          {isOverBetAmount(item.minBetAmount, item.maxBetAmount).flag &&
            <span>不可投注</span>
          }
          {item.money && Number(item.money) >0 && <span className='clear' onClick={()=>updateSeriseOfMoney(item.id, String(''))}>X</span>}
          {<em className='x-wrap'>X{item.multiple}</em>}
        </div>
      </div>
    );
  };
  return (
    <div className={style.seriesCartwrapper}>
      <div className='series-list-wrap' ref={myDiv}>
        {
          orders.map((item)=><BetItemInfo key={item.id} type="multiple" order={item}/>)
        }
        {seriesList.length>=1 && seriesItemRender(seriesList[0], true)}
        {
          isExpand && seriesList.map((item, index)=>{
            if (index === 0) return null;
            return seriesItemRender(item);
          })
        }
      </div>
      {orders.length <2 &&
        <div className='series-less-alert'>
            至少选择2场比赛
        </div>}
      {<div className='total-wrap'>
        <div className='bet-and-win-amount'>
          <div>
            <span>预计总收益</span>
            <span className='total-income'>{formatCurrency(allWinAmount)}</span>
          </div>
          <div>
            <span>总投注</span>
            <span className='text-right'>{formatCurrency(allBetAmount)}</span>
          </div>
        </div>
        {
          hasInvalidOrder() && <div className='series-invaild-alert' onClick={clearInvaildOrders}>
              清空无效注单
          </div>}
        {
          !hasInvalidOrder() && isOverBetAmount(checked?.minBetAmount, checked?.maxBetAmount).flag && <div className='series-invaild-alert'>
            已超过本次赛事最高可赢
          </div>}
        {
          seriesList.length > 1 && <div className='more'>
            {!isExpand && <span onClick={()=>setIsExpand(true)}>更多串关类型</span>}
            {isExpand && <span onClick={()=>setIsExpand(false)}>收起串关类型</span>}
            <DpIcon type='more'/>
          </div>
        }
      </div>}
      <Keyborad
        cname={isOverBetAmount(checked?.minBetAmount, checked?.maxBetAmount).flag?'key-disiable':''}
        onChange={handleChangeBalance}
        value={checked?.money}
        checked={checkedAmount}
        maxBetAmount={checked?.maxBetAmount}
        setCheckedAmount={setCheckedAmount}
        closeBetOrderLayer={close}
        currentBalance={info.totalBalance}/>
    </div>
  );
});
