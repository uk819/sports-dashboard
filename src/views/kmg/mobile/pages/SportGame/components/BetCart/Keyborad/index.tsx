/*
 * @Author: Galen.GE
 * @Date: 2024-01-19 15:37:56
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/BetCart/Keyborad/index.tsx
 * @Description:
 */
import DpIcon from '@views/kmg/mobile/components/Icon';
import classNames from 'classnames';
import style from './style.scss';
import usePublicState from '@core/hooks/usePublicState';
import {TOrder} from '@core/services/Table';

interface IProps{
  value: string;
  onChange: (value: string) => void;
  closeBetOrderLayer: Function;
  setCheckedAmount: Function;
  maxBetAmount: number;
  currentBalance: number;
  checked: string;
  cname?: string;
  order?: TOrder;
}
export default ({onChange, value, closeBetOrderLayer, checked, setCheckedAmount, maxBetAmount, currentBalance, cname, order}: IProps) => {
  // 预设值
  const valueSet = ['100', '500', '1000', '2000', '5000'];
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '00'];
  const {dispatch, ACTIONS} = usePublicState();
  const handleClick = (input: string | number) => {
    clearCheckedBtn();
    let currentBetAmount : any = Number(value + input);
    if (input === '.') {
      currentBetAmount = value + input;
    }
    if (currentBetAmount > currentBalance) {
      onChange(String(currentBalance));
      return;
    }
    if (currentBetAmount > maxBetAmount) {
      onChange(String(maxBetAmount));
      return;
    }
    onChange(String(currentBetAmount));
  };

  const delPrve = () => {
    clearCheckedBtn();
    onChange(value.slice(0, value.length - 1));
  };
  const setMaxBetAmount = ()=>{
    if (order && order.inReservationStatus && currentBalance > order.reservationMaxBetAmount) {
      onChange(String(order.reservationMaxBetAmount));
      return;
    }
    if (currentBalance > maxBetAmount) {
      onChange(String(maxBetAmount));
      return;
    }
    onChange(String(currentBalance));
  };
  const clearCheckedBtn = ()=>{
    setCheckedAmount('');
  };
  return (
    <div className={`${style.wrapper+' '+ cname}`}>
      <div className="pre-set">
        {
          valueSet.map((value) =>
            <span key={value} className={value === checked ?'amount checked-amount':'amount'}
              onClick={() =>{
                if (Number(value) > currentBalance) {
                  dispatch(ACTIONS.BASE.openToast({text: '您的余额不足', types: 'error'}));
                  return;
                }
                if (Number(value) > maxBetAmount) {
                  setCheckedAmount(maxBetAmount);
                  onChange(maxBetAmount.toString());
                } else {
                  setCheckedAmount(value);
                  onChange(value);
                }
              }}>
              {value}
              {checked === value && <DpIcon type='checkOnAmount' className='checkd'/>}
            </span>,
          )
        }
      </div>
      <div className="keys">
        <div className="numbers">
          {
            numbers.map((value) =>
              <span className={classNames('item')} onClick={() => handleClick(value)} key={value}>{value}</span>,
            )
          }
        </div>
        <div className="operation">
          <span className='max-btn'
            onClick={()=>{
              setMaxBetAmount();
              clearCheckedBtn();
            }}>最大</span>
          <span onClick={()=>(delPrve())} className='big'>
            <DpIcon type='remove'/>
          </span>
          <span onClick={
            ()=>{
              closeBetOrderLayer();
            }
          }>
            <DpIcon type='keyboard'/>
          </span>
        </div>
      </div>
    </div>
  );
};
