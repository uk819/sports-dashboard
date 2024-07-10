import useOrderCart from '@core/hooks/sports/useOrderCart';
import usePublicState from '@core/hooks/usePublicState';
import {MultipleBetContext} from './MultipleBetContext';
interface Iprops{
  tag: string,
  isMultiple?: boolean,
}
const OrderItem = React.memo(({tag}: Iprops) => {
  const {inputRef, setTotalBetAmount, getRemainAmount} = React.useContext(MultipleBetContext);
  const {orders, orderTags, setOrderMoney, maxBalance} = useOrderCart();
  const {user} = usePublicState();
  const [fastBets, setFastBets] = React.useState([
    {label: '+100', val: 100},
    {label: '+500', val: 500},
    {label: '+1000', val: 1000},
    {label: '+2000', val: 2000},
    {label: '+5000', val: 5000},
  ]);
  const isDisabled = (tag?: string, bet?: any) => {
    if (tag !== 'All') {
      const {available, locked} = orders[tag];
      if ((!available || locked)) {
        return true;
      }
    }
    const remainAmount = getRemainAmount();
    const orderSize = orderTags.length;
    const totalBalance = user.info.totalBalance;
    const averageAmount = (totalBalance / orderSize).toFixed(2);
    const orderAmountByMinMaxLimit = _.chain(orders).values().minBy('maxBetAmount').value();
    // 如果是单项注单
    if (orders[tag]) {
      const maxBetAmount = orders[tag].inReservationStatus ? orders[tag].reservationMaxBetAmount : orders[tag].maxBetAmount;
      if (remainAmount < 10) return true;
      if (bet.val > maxBetAmount) return true;
      if ((Number(maxBetAmount) - Number(orders[tag].money)) < bet.val) {
        return true;
      }
      if (bet.val <= remainAmount) return false;
    }
    // 如果是多项注单
    if (remainAmount < 10) return true;
    if (bet.val > averageAmount) return true;
    if (bet.val > maxBalance) return true;
    if ((maxBalance - Number(orderAmountByMinMaxLimit.money)) < bet.val) {
      return true;
    }
    if (bet.val * orderSize > remainAmount) return true;
    return false;
  };
  const assginBetAmountToPerOrderFromAll = (lable: string, val: string)=>{
    const million = 10000000;
    const orderSize = orderTags.length;
    const totalBalance = user.info.totalBalance;
    const averageAmount = Math.floor(totalBalance / orderSize);
    _.each(orderTags, (tag) => {
      // 如果点击是MAX
      if (lable === 'MAX') {
        if (Number(averageAmount) < maxBalance) {
          setTotalBetAmount(averageAmount);
          setOrderMoney(averageAmount, tag);
          inputRef.current[tag].value = String(averageAmount);
        } else {
          setTotalBetAmount(maxBalance);
          setOrderMoney(maxBalance, tag);
          inputRef.current[tag].value = String(maxBalance);
        }
      } else {
        // 其他数字按钮
        const totalBet = (Number(orders[tag].money) * million + Number(val) * million)/million;
        if (totalBet > maxBalance) return;
        setTotalBetAmount(totalBet);
        setOrderMoney(totalBet, tag);
        inputRef.current[tag].value = String(totalBet);
      }
    });
  };
  const assginBetAmountToPerOrderFromCommon = (lable: string, val: string, tag: string)=>{
    const maxBetAmount = orders[tag].inReservationStatus ? orders[tag].reservationMaxBetAmount : orders[tag].maxBetAmount;
    const million = 10000000;
    const remainAmount = getRemainAmount();
    if (lable === 'MAX') {
      if (remainAmount === 0) return;
      if (remainAmount > maxBetAmount) {
        setOrderMoney(Math.floor(Number(maxBetAmount)), tag);
        inputRef.current[tag].value = String(Math.floor(Number(maxBetAmount)));
        return;
      }
      setOrderMoney(Math.floor(Number(remainAmount)), tag);
      inputRef.current[tag].value = String(Math.floor(Number(remainAmount)));
      return;
    } else {
      const totalBet = Number(orders[tag].money) + Number(val) >= maxBetAmount ? maxBetAmount : ((Number(orders[tag].money)*million) + (Number(val) * million))/million;
      setTotalBetAmount('');
      setOrderMoney(totalBet, tag);
      inputRef.current[tag].value = String(totalBet);
    }
  };
  const addBetAmount = (tag: string, bet?: any) => {
    if (tag ==='All') {
      assginBetAmountToPerOrderFromAll(bet.label, bet.val);
      return;
    } else {
      assginBetAmountToPerOrderFromCommon(bet.label, bet.val, tag);
    }
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
