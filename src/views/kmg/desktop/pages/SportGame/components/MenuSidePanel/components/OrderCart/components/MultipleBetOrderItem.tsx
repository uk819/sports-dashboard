import useOrderCart from '@core/hooks/sports/useOrderCart';
import MultipFastBetBtnSComponent from './MultipleFastBetBtns';
import classnames from 'classnames';
import {Series} from '@core/apis/models/dashboard/get-betting-record';
import {amountVilidation, interceptedTwoDigitsToString} from '@core/utils/math';
import usePublicState from '@core/hooks/usePublicState';
interface IProps{
  showOdd?: boolean;
  data?: Series;
  inputRef:{[key: string]: any};
  multi?: boolean;
  seriesList?: Series[];
  setActiveFastBtn: Function;
  activeFastBtn: string;
}
const OrderItem = React.memo(({data, showOdd, inputRef, multi = true, setActiveFastBtn, activeFastBtn}: IProps) => {
  const {updateSeriseOfMoney, seriesList} = useOrderCart();
  const {user} = usePublicState();
  const clearbetAmount = (id: string)=>{
    updateSeriseOfMoney(id, '');
    inputRef.current[id].value = '';
  };
  const getTotalBetAmountExcludeOwn =(tag: string)=>{
    let count = 0;
    seriesList.map((item: Series)=>{
      if (tag === item.id) return;
      count = Number(item.money) + count;
    });
    return count;
  };
  const handleChangeBalance = (v: string, tag: string) => {
    const value =amountVilidation(v);
    const betMoney: number = Number(value);
    const otherBetAmount = getTotalBetAmountExcludeOwn(tag);
    if (betMoney > data.maxBetAmount) {
      updateSeriseOfMoney(data.id, String(data.maxBetAmount));
      inputRef.current[tag].value = String(data.maxBetAmount);
      return;
    }
    if (betMoney > user.info.totalBalance - otherBetAmount) {
      const amount = user.info.totalBalance - otherBetAmount;
      updateSeriseOfMoney(data.id, String(amount));
      inputRef.current[tag].value = String(amount);
      return;
    }
    if (betMoney > user.info.totalBalance) {
      const amount = user.info.totalBalance;
      updateSeriseOfMoney(data.id, String(amount));
      inputRef.current[tag].value = String(amount);
      return;
    }
    const val = betMoney > data.maxBetAmount ? data.maxBetAmount : betMoney;
    inputRef.current[tag].value = String(Number(val)=== 0 ? '': value);
    updateSeriseOfMoney(data.id, String(val));
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
  return (
    <div className={classnames('bet-item')} key={data.id}
      onClick={()=>setActiveFastBtn(data.id)}>
      <div className='multiple-r-1'>
        <em className='name'>{data.firstText}串{data.secondText}</em>
        {showOdd && <em className='odds-total'>@{interceptedTwoDigitsToString(data.oddsTotal)}</em>}
      </div>
      <div className='input-box'>
        <input
          type='text'
          placeholder={isOverBetAmount(data.minBetAmount, data.maxBetAmount).text}
          disabled={isOverBetAmount(data.minBetAmount, data.maxBetAmount).flag?true: false}
          value={data.money}
          ref={(ref) => {
            inputRef.current[data.id] = ref;
          }}
          onChange={(e) =>handleChangeBalance(e.target.value, data.id)}/>
        <span className='x-wrap'>X{data.multiple}</span>
        {data.money ? <div className='close-input' onClick={() => clearbetAmount(data.id)}></div> : <></>}
      </div>
      {
        isOverBetAmount(data.minBetAmount, data.maxBetAmount).flag && <div className="error-message">超过本场赛事最大可赢金额</div>
      }
      {
        !isOverBetAmount(data.minBetAmount, data.maxBetAmount).flag && <div className="amount-after-serires flex-end">
          <div>
            最高可赢: <span>{interceptedTwoDigitsToString(data.maxWinAmount)}</span>
          </div>
        </div>
      }

      {!isOverBetAmount(data.minBetAmount, data.maxBetAmount).flag && activeFastBtn === data.id && <MultipFastBetBtnSComponent tag={data.id}/>}
    </div>
  );
});
export default OrderItem;
