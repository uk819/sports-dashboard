import useOrderCart from '@core/hooks/sports/useOrderCart';
import usePublicState from '@core/hooks/usePublicState';
import {MultipleBetContext} from './MultipleBetContext';
interface Iprops{
  tag: string,
  isMultiple?: boolean,
}
const OrderItem = React.memo(({tag}: Iprops) => {
  const {inputRef, setTotalBetAmount} = React.useContext(MultipleBetContext);
  const {seriesList, updateSeriseOfMoney, maxBalance, orders, orderTags} = useOrderCart();
  const {user} = usePublicState();
  const [fastBets, setFastBets] = React.useState([
    {label: '+100', val: 100},
    {label: '+500', val: 500},
    {label: '+1000', val: 1000},
    {label: '+2000', val: 2000},
    {label: '+5000', val: 5000},
  ]);
  const getRemainAmount = ()=>{
    let allBetMoney = 0;
    _.each(seriesList, (tag) => {
      const money = tag.money;
      allBetMoney = allBetMoney + Number(money);
    });
    const remain = user.info.totalBalance - allBetMoney;
    return remain <= 0 ? 0 : remain;
  };
  const hasInvalidOrder =()=>{
    let flag = false;
    orderTags.map((item)=>{
      if (!orders[item].available || orders[item].locked) {
        flag = true;
      }
    });
    return flag;
  };
  const isDisabled = (tag?: string, bet?: any) => {
    const invalids = hasInvalidOrder();
    if (invalids) return true;
    const remainAmount = getRemainAmount();
    // 如果是单项注单
    const series =_.find(seriesList, (item)=>item.id === tag);
    if (seriesList) {
      if (remainAmount<10) return true;
      if (bet.val > series.maxBetAmount) return true;
      if ((Number(series.maxBetAmount) - Number(series.money)) < bet.val) {
        return true;
      }
      if (bet.val > remainAmount) return true;
    }
    return false;
  };
  const assginBetAmountToPerOrderFromCommon = (lable: string, val: string, tag: string)=>{
    const million = 10000000;
    const remainAmount = getRemainAmount();
    const order =_.find(seriesList, (item)=>item.id === tag);
    if (lable === 'MAX') {
      if (remainAmount === 0) return;
      if (remainAmount >= order.maxBetAmount) {
        updateSeriseOfMoney(order.id, Math.floor(Number(order.maxBetAmount)).toString());
        inputRef.current[tag].value = String(Math.floor(Number(order.maxBetAmount)));
        return;
      }
      if (order.money && Number(order.money) > 0) {
        updateSeriseOfMoney(order.id, String(Number(order.money)+remainAmount));
        inputRef.current[tag].value = String(Math.floor(Number(order.money)+remainAmount));
        return;
      }
      updateSeriseOfMoney(order.id, Math.floor(Number(remainAmount)).toString());
      inputRef.current[tag].value = String(Math.floor(Number(remainAmount)));
      return;
    } else {
      const totalBet = Number(order.money) + Number(val) >= order.maxBetAmount ? order.maxBetAmount : ((Number(order.money)*million) + (Number(val) * million))/million;
      setTotalBetAmount('');
      updateSeriseOfMoney(order.id, String(totalBet));
      inputRef.current[tag].value = String(totalBet);
    }
  };
  const addBetAmount = (tag: string, bet?: any) => {
    assginBetAmountToPerOrderFromCommon(bet.label, bet.val, tag);
  };
  React.useEffect(()=>{
    const maxLen = 6;
    if (!user || !user.info) return;
    if (fastBets.length === maxLen) return;
    setFastBets([...fastBets, {label: 'MAX', val: maxBalance}]);
  }, [user.info.totalBalance]);
  return (
    <ul className="faster-bet-btn">
      {
        fastBets.map((bet) => (
          <li
            key={bet.label}
            className={bet.label==='MAX'?'max':''}
            onMouseDown={(e) =>e.preventDefault()}>
            <button
              disabled={isDisabled(tag, bet)}
              onClick={() =>addBetAmount(tag, bet)}>
              {bet.label}
            </button>
          </li>
        ))
      }
    </ul>);
});
export default OrderItem;
