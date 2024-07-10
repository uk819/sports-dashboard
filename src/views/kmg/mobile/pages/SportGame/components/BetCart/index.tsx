/*
 * @Author: Galen.GE
 * @Date: 2024-01-19 11:59:17
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/BetCart/SingleCart/index.tsx
 * @Description:
 */
import Overlay from '@template/components/Overlay';
import {useSelector} from 'react-redux';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import Header from './Header';
import TStore from '@core/reducers/_reduxStore';
import {TOrder} from '@core/services/Table';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import {formatCurrency} from '@core/helpers/unit';
import usePublicState from '@core/hooks/usePublicState';
import DpIcon from '@views/kmg/mobile/components/Icon';
import SeriesCart from './SeriesCart';
import SingleCart from './SingleCart';
import {Checkbox} from 'antd';
import style from './style.scss';
import Loading from '@core/templates/mobile/components/Loading';
import {Series} from '@core/apis/models/dashboard/get-betting-record';
import {isChampion} from '@core/utils';
export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const orders = useSelector((state: TStore) => state.sport.bet.orders);
  const tags = useSelector((state: TStore) => state.sport.bet.orderTags);
  const [visible, setVisible] = React.useState(false);
  const {removeAllOrder, verifyOrderTokenThenSubmitSingleOrder, setConfirmAcceptChangeOdd, seriesList, submitLoading, updateSeriseOfMoneyBatch,
    isSeries, getSeriesData, confirmSubmitStatus, setOrderMoney} = useOrderCart();
  useEventEmitter<TMitt['toggleBetOrder']>({mittName: 'toggleBetOrder', on: ({}) =>(close())});
  useEventEmitter<TMitt['visibleBetOrder']>({mittName: 'visibleBetOrder', on: ({display, showSeries}) =>(toggleBetOrder(display, showSeries))});
  const [order, setOrder] = React.useState<TOrder>(null);
  React.useEffect(() => {
    if (_.isEmpty(orders) && _.isEmpty(tags)) {
      if (visible) setVisible(false);
      return;
    };
    const order =orders[tags[0]];
    getSeriesData();
    setOrder(order);
  }, [orders, tags]);
  const seriesSubmit = ()=>{
    const ids = seriesList.filter((item: Series) => Number(item.money) < 10 && item.money).map((item)=>item.id);
    if (ids.length>0) {
      updateSeriseOfMoneyBatch(ids);
      dispatch(ACTIONS.BASE.openToast({text: `最小投注额不能低于10.00元`, types: 'error'}));
      return;
    }
    verifyOrderTokenThenSubmitSingleOrder();
  };
  const signleSubmit = ()=>{
    if (!order.money) {
      dispatch(ACTIONS.BASE.openToast({text: `最小投注额不能低于${order.minBetAmount}元`, types: 'error'}));
      return;
    }
    if (Number(order.money) < order.minBetAmount) {
      setOrderMoney(10, tags[0]);
      dispatch(ACTIONS.BASE.openToast({text: `最小投注额不能低于${order.minBetAmount}元`, types: 'error'}));
      return;
    }
    verifyOrderTokenThenSubmitSingleOrder();
  };
  const submit = ()=>{
    if (submitLoading) return;
    if (isSeries) {
      seriesSubmit();
      return;
    }
    signleSubmit();
  };
  const toggleBetOrder = (display: boolean, showSeries: boolean)=>{
    if (!showSeries && isSeries) return;
    setVisible(true);
  };
  const close = ()=>{
    if (!isSeries) {
      removeAllOrder();
    }
    setVisible(false);
  };
  const hasInvalidOrder = () => {
    const isExist = _.find(Object.values(orders), (item)=> !item.available || item.locked);
    return isExist ? true : false;
  };
  const hideModalAddMatchs = () => {
  };
  const changeBetType = () => {
    const state = !isSeries;
    if (state) {
      setVisible(false);
      setTimeout(() => {
        dispatch(ACTIONS.BASE.toggleSerierWay({data: state}));
      }, 500);
      return;
    }
    dispatch(ACTIONS.BASE.toggleSerierWay({data: state}));
  };
  if (_.isEmpty(order)) return null;
  return (
    <Overlay display={visible} zIndex={20}>
      <div className={style.betWrap}>
        <div className='bg' onClick={() => close()}/>
        <div className='betCartwrapper'>
          <Header />
          {isSeries && <SeriesCart orders={Object.values(orders)} hideModalAddMatchs={hideModalAddMatchs} close={close}/>}
          {!isSeries && <SingleCart order={order} close={close}/>}
          <div className="odds-change-apply">
            <Checkbox onChange={(e) => setConfirmAcceptChangeOdd(e.target.checked)} checked={confirmSubmitStatus}>
              自动接受更好赔率
            </Checkbox>
          </div>
          <div className="submit">
            {
              <div className='del'
                onClick={()=>{
                  removeAllOrder();
                  close();
                }}>
                <DpIcon type='del'/>
              </div>
            }
            {
              ((tags.length < 2 && isSeries) || hasInvalidOrder()) && <div className='action disable'>投注</div>
            }
            {
              ((!isSeries && !hasInvalidOrder()) || (tags.length >= 2 && isSeries && !hasInvalidOrder())) && <div className='action' onClick={submit}>
                投注
                {!isSeries && <span className='y-can-win'>可赢{formatCurrency((order.maxWin || 0)) }</span>}
              </div>
            }
            {
              !isChampion(order.kc) &&
              <div className='add-series' onClick={changeBetType}>
                <DpIcon type='add'/>{!isSeries?'串':'单'}
              </div>
            }
          </div>
        </div>
        <Loading type='progress' show={submitLoading} />
      </div>
    </Overlay>
  );
};
