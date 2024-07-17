import useOrderCart from '@core/hooks/sports/useOrderCart';
import usePublicState from '@core/hooks/usePublicState';
import {MultipleBetContext} from './MultipleBetContext';
interface Iprops{
  onChange: (value: number) => null,
  isMultiple?: boolean,
}
const OrderItem = React.memo(({onChange}: Iprops) => {
  const {getRemainAmount} = React.useContext(MultipleBetContext);
  const {orders, orderTags, maxBalance} = useOrderCart();
  const {user} = usePublicState();
  const [fastBets, setFastBets] = React.useState([
    {label: '+100', val: 100},
    {label: '+500', val: 500},
    {label: '+1000', val: 1000},
    {label: '+2000', val: 2000},
    {label: '+5000', val: 5000},
  ]);
  const isDisabled = (bet?: any) => {
    const remainAmount = getRemainAmount();
    const orderSize = orderTags.length;
    const totalBalance = user.info.totalBalance;
    const averageAmount = (totalBalance / orderSize).toFixed(2);
    const orderAmountByMinMaxLimit = _.chain(orders).values().minBy('maxBetAmount').value();
    if (remainAmount === 0) return true;
    if (bet.val > averageAmount) return true;
    if (bet.val > maxBalance) return true;
    if ((maxBalance - Number(orderAmountByMinMaxLimit.money)) < bet.val) {
      return true;
    }
    if (bet.val * orderSize > remainAmount) return true;
    return false;
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
              disabled={isDisabled(bet)}
              onClick={() => onChange(bet.val)}>
              {bet.label}
            </button>
          </li>
        ))
      }
    </ul>);
});
export default OrderItem;

