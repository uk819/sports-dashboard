import {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import Overlay from '@template/components/OverlayBackdropClose';
import {TBettingOrder} from '@core/apis/models/dashboard/get-betting-record';
import {ALL_SPORTS_MAP, BET_RESULT_TYPE_MAP, EBetResultType, ESportType, EOrderTypeStatus} from '@core/constants/enum/sport';
import {ORDER_STATUS_MAP} from '@core/constants/enum/sport/orderTypes';
import useBetHistoryHooks from '@core/hooks/dashboard/useBetHistoryHooks';
import useNavigationHooks from '@core/hooks/sports/useNavigation';
import usePublicState from '@core/hooks/usePublicState';
import {getPlayNameByKc, displayHomeAwayScore, displayBetItem, getBetTeamType, isVisiableSecondText, getBetHandiCapAtBetting, chooseEuropeOrAsiaText, isChampion, isPlayingMatch} from '@core/utils/index';
import {formatCurrency} from '@core/helpers/unit';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import DpIcon from '@views/kmg/mobile/components/Icon';
import DpSwitchButton from '@this/components/SwitchButton';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import style from './style.scss';
import {getSeriesDigitsStr} from '@core/utils/math';
import classnames from 'classnames';
const betTypes =[
  {label: '未结算注单', key: '0', value: EOrderTypeStatus.UNSETTLED},
  {label: '已结算注单', key: '1', value: EOrderTypeStatus.SETTLED},
  {label: '预约注单', key: '3', value: `sub-${EOrderTypeStatus.ABNORMAL}`},
];
const reserveTypes =[
  {label: '进行中', key: '0'},
  {label: '已取消', key: EBetResultType.CANCELL, value: EBetResultType.CANCELL},
  {label: '预约失败', key: EBetResultType.AUTO_CANCEL, value: EBetResultType.AUTO_CANCEL},
];
export default () => {
  const {list, getList, showConfirm} = useBetHistoryHooks({pageNum: 1, pageSize: 200});
  const orderHistoryStatus = useSelector((state: TStore) => state.base.mobile.orderHistoryStatus);
  const [betType, setBetType] = useState<EOrderTypeStatus | string>(EOrderTypeStatus.UNSETTLED);
  const [reserveType, setReserveType] = useState<EBetResultType>();
  const {toggleMobileOrderHistory} = useNavigationHooks();
  const [direction] = useState('up');

  useEffect(() => {
    setBetType(orderHistoryStatus);
  }, []);
  useEffect(()=>{
    orderHistoryStatus > -1 && getList({billStatus: orderHistoryStatus, pageNum: 1, pageSize: 50});
  }, [orderHistoryStatus]);

  useEffect(()=>{
    const isReserve = betType === `sub-${EOrderTypeStatus.ABNORMAL}`;
    const rMap = {
      'undefined': 3,
      [EBetResultType.CANCELL.toString()]: 4,
      [EBetResultType.AUTO_CANCEL.toString()]: 5,
    };
    const bMap = {
      [EOrderTypeStatus.UNSETTLED.toString()]: 1,
      [EOrderTypeStatus.SETTLED.toString()]: 2,
      [`sub-${EOrderTypeStatus.ABNORMAL}`]: 3,
    };
    getList({
      pageNum: 1,
      pageSize: 50,
      queryType: isReserve ? rMap[String(reserveType)] : bMap[String(betType)],
    });
  }, [betType, reserveType]);
  const close = () => {
    setBetType(EOrderTypeStatus.UNSETTLED);
    setReserveType(undefined);
    toggleMobileOrderHistory(-1, -1);
  };
  return (
    <>
      {orderHistoryStatus < 0 ? (
        <></>
      ) : (
        <Overlay
          display
          zIndex={5}
          close={close}
          maskClickClose={true}
          hasMask
          containerClassname="order-record-overlay"
        >
          <div className={style.wrapper}>
            <div className='placeholder' onClick={close} />
            <div style={{position: 'relative'}} className={direction === 'up' ? 'display':'hide'} onClick={(e) => e.stopPropagation()}>
              <div className="close-btn">
                <DpIcon width={32} height={32} type='close' onClick={close} />
              </div>
              <DpSwitchButton
                className='type-header'
                value={betType}
                items={betTypes}
                onChange={(item:number)=>setBetType(item)}
                subValue={reserveType}
                subItems={reserveTypes}
                subOnChange={(item:number)=>setReserveType(item)}
              />
            </div>
            <div className="order-list-wrap">
              {((betType === `sub-${EOrderTypeStatus.ABNORMAL}` && list.filter((data) => reserveType === EBetResultType.AUTO_CANCEL ? (data.details[0].betResult !== EBetResultType.CANCELL) : reserveType === undefined ? [null, 0].includes(data.details[0].betResult) : (data.details[0].betResult ?? undefined) === reserveType).length < 1) || list.length < 1) && <OrderItem empty reserveType={reserveType} betType={betType} />}
              {betType !== `sub-${EOrderTypeStatus.ABNORMAL}` && list.map((item) => <OrderItem showConfirm={showConfirm} data={item} key={item.id} betType={betType} />)}
              {betType === `sub-${EOrderTypeStatus.ABNORMAL}` && list.filter((data) => reserveType === EBetResultType.AUTO_CANCEL ? (data.details[0].betResult !== EBetResultType.CANCELL) : reserveType === undefined ? [null, 0].includes(data.details[0].betResult) : (data.details[0].betResult ?? undefined) === reserveType).map((item) => <OrderItem showConfirm={showConfirm} data={item} key={item.id} betType={betType} />)}
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
};
interface IOrderItem {
  data?: TBettingOrder;
  betType?: EOrderTypeStatus | string;
  reserveType?: EBetResultType;
  showConfirm?: (orderId: string, isH5: boolean) => void;
  empty?: boolean;
}
function OrderItem({data, betType, reserveType, showConfirm, empty = false}: IOrderItem) {
  const {dispatch, ACTIONS} = usePublicState();
  const onCopy = (_: string, result: boolean) => {
    if (result) {
      dispatch(ACTIONS.BASE.openToast({text: '已复制订单号', types: 'info'}));
    }
  };
  return (
    <div className={`order-card${empty ? '-empty' : ''}${data?.details?.length > 1 ? ' group-orders' : ''}`} onClick={(e) => e.stopPropagation()}>
      {empty ? (
        <>
          <img src={require('@this/assets/images/betting-card/empty-history.svg')} alt="" />
          {betType === EOrderTypeStatus.UNSETTLED && <p>您暂时无未结算数据</p>}
          {betType === EOrderTypeStatus.SETTLED && <p>您暂时无已结算数据</p>}
          {(betType ===`sub-${EOrderTypeStatus.ABNORMAL}` && reserveType === undefined) && <p>您暂时无预约中数据</p>}
          {(betType ===`sub-${EOrderTypeStatus.ABNORMAL}` && reserveType === EBetResultType.CANCELL) && <p>您暂时无取消预约数据</p>}
          {(betType ===`sub-${EOrderTypeStatus.ABNORMAL}` && reserveType === EBetResultType.AUTO_CANCEL) && <p>您暂时无预约失败数据</p>}
        </>
      ) : (
        <>
          {data.details.length < 2 ? (
            <>
              {
                !isChampion(data.details[0]?.kindsCode) &&
                <div className="order-match-name">
                  <div>{data.details[0]?.homeTeamNameCn}</div>
                  <div>VS</div>
                  <div>{data.details[0]?.awayTeamNameCn}</div>
                </div>
              }
              <div className="order-match-info">
                <div>投注项: [{ALL_SPORTS_MAP[data.details[0]?.sportId]}] {isPlayingMatch(data.details[0].isInplay ? 1 : 0, data.details[0]?.kindsCode)} {getPlayNameByKc({code: data.details[0]?.kindsCode, name: data.details[0]?.betItemName, ctid: data.details[0]?.betItemCTID, sportId: data.details[0]?.sportId})}</div>
                <div>
                  <em className='play-name'>{getBetTeamType(data.details[0])}
                    {isVisiableSecondText(data.details[0].betHandicap, data.details[0].betN, data.details[0].kindsCode) && <em>{getBetHandiCapAtBetting(data.details[0].betHandicap, data.details[0].sportId)}</em>}
                  </em>
                  <em className='odd-val'>@{formatCurrency(data.details[0]?.oddValue)}</em>
                </div>
                {!isChampion(data.details[0]?.kindsCode) && (betType !== `sub-${EOrderTypeStatus.ABNORMAL}` && data.details[0].sportId < 276) && !!data.details[0].isInplay && (
                  <div>
                    下注时比分
                    {' '}
                    {data.billStatus === EOrderTypeStatus.UNSETTLED && <span>{displayHomeAwayScore(data.details[0]?.scoreBenchmark)}</span>}
                    {data.billStatus === EOrderTypeStatus.SETTLED && <span>{displayHomeAwayScore(data.details[0]?.scoreBenchmark)}</span>}
                  </div>
                )}
                <div>
                  {!isChampion(data.details[0]?.kindsCode) && (data.details[0]?.betResult !== EBetResultType.AUTO_CANCEL && data.details[0]?.betResult !== EBetResultType.CANCELL && data.billStatus == EOrderTypeStatus.SETTLED && data.details[0]?.sportId !== ESportType.TENNIS) && !displayHomeAwayScore(data.details[0]?.settleScore, data.details[0]?.sportId)?.includes('undefined') &&
                  <div className='settled-score'>{displayBetItem(data.details[0]?.betItemName, data.details[0]?.sportId)}
                    {data.details[0]?.betResult !== EBetResultType.HANDLE_CANCEL && displayHomeAwayScore(data.details[0]?.settleScore, data.details[0]?.sportId)}
                  </div>}
                </div>
              </div>
              <div className="order-match-detail">
                <div>投注单号：</div>
                <div className='order-match-id'>
                  <div>
                    {data.id}
                  </div>
                  <CopyToClipboard text={`${data.id}`} onCopy={onCopy}>
                    <DpIcon type='copy' className='copy'/>
                  </CopyToClipboard>
                </div>
              </div>
              <div className="order-match-detail">
                <div>投注时间：</div>
                <div>
                  {dayjs(data.details[0]?.createTime).format('YYYY/MM/DD HH:mm:ss')}
                  <span className="text-theme">
                    {chooseEuropeOrAsiaText(data.details[0].marketType, data.details[0].sportId)}
                  </span>
                </div>
              </div>
              <div className="order-match-detail">
                <div>[{ALL_SPORTS_MAP[data.details[0]?.sportId]}] {data.details[0]?.leagueNameCn}</div>
              </div>
              <div className="order-match-detail">
                <div>{betType === `sub-${EOrderTypeStatus.ABNORMAL}` ? '预约金额' : '投注额：'}</div>
                <div>{formatCurrency(data.productAmountTotal)} 元</div>
              </div>
              <div className="order-match-detail blue">
                <div>{data.billStatus === EOrderTypeStatus.SETTLED ? '返还金额' :'可赢额'}：</div>
                <div>
                  {
                    data.billStatus === EOrderTypeStatus.SETTLED &&
                    [EBetResultType.WIN, EBetResultType.WIN_HALF].includes(data.details[0]?.betResult) &&
                    <div><span className='bet-win'>{formatCurrency(data.productAmountTotal + data.profitAmount)} 元</span><span className={classnames('ml-10', [EBetResultType.WIN, EBetResultType.WIN_HALF].includes(data.details[0]?.betResult) ? 'text-red' : 'text-normal')}>{BET_RESULT_TYPE_MAP[data.details[0]?.betResult]}</span></div>
                  }
                  {
                    data.billStatus === EOrderTypeStatus.SETTLED &&
                    ![EBetResultType.WIN, EBetResultType.WIN_HALF].includes(data.details[0]?.betResult) &&
                    <div><span className="mr-10">{formatCurrency(data.productAmountTotal + data.profitAmount)} 元</span><span className={classnames([EBetResultType.WIN, EBetResultType.WIN_HALF].includes(data.details[0]?.betResult) ? 'text-red' : 'text-normal')}>{betType === EOrderTypeStatus.SETTLED ? BET_RESULT_TYPE_MAP[data.details[0]?.betResult] : ''}</span></div>
                  }
                  {data.billStatus === EOrderTypeStatus.UNSETTLED && <span>{formatCurrency(data.maxWinAmount)} 元</span>}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="group-orders-type">
                <DpIcon type="groupBet" />
                串关-{getSeriesDigitsStr(data.seriesType, data.details.length)}
              </div>
              <div className="orders-node-list">
                {data.details.map((detail, index) => (
                  <div key={index} className="node-item">
                    <div className="node-icon-and-line">
                      <div className="node-icon"></div>
                      {index < data.details.length - 1 && <div className="node-line"></div>}
                    </div>
                    <div className="node-content">
                      <div className='l-1'>
                        <div>
                          <em className='play-name'>{getBetTeamType(detail)}</em>&nbsp;
                          {
                            isVisiableSecondText(detail.betHandicap, detail.betN, detail.kindsCode) &&
                            <em>{getBetHandiCapAtBetting(detail.betHandicap, detail.sportId)}</em>
                          }
                        </div>
                        <div>
                          <em className='odd-val'>{formatCurrency(detail?.oddValue)}</em>
                        </div>
                      </div>
                      <div className='l-2'>
                        [{ALL_SPORTS_MAP[detail?.sportId]}] {getPlayNameByKc({code: detail?.kindsCode, name: detail?.betItemName, ctid: detail?.betItemCTID, sportId: detail?.sportId})}
                      </div>
                      {(betType !== `sub-${EOrderTypeStatus.ABNORMAL}` && detail.sportId < 276) && !!detail.isInplay && (
                        <div className='l-3'>
                          <div>
                            下注时比分
                            {' '}
                            {data.billStatus === EOrderTypeStatus.UNSETTLED && <span>{displayHomeAwayScore(detail?.scoreBenchmark)}</span>}
                            {data.billStatus === EOrderTypeStatus.SETTLED && <span>{displayHomeAwayScore(detail?.scoreBenchmark)}</span>}
                          </div>
                          <div>
                            {
                              data.billStatus === EOrderTypeStatus.SETTLED &&
                              [EBetResultType.WIN, EBetResultType.WIN_HALF].includes(detail?.betResult) &&
                              <span className='bet-win'>已结算 {BET_RESULT_TYPE_MAP[detail?.betResult]}</span>
                            }
                            {
                              data.billStatus === EOrderTypeStatus.SETTLED &&
                              ![EBetResultType.WIN, EBetResultType.WIN_HALF].includes(detail?.betResult) &&
                              <span className='bet-lose'>已结算 {BET_RESULT_TYPE_MAP[detail?.betResult]}</span>
                            }
                          </div>
                        </div>
                      )}
                      {!isChampion(detail.kindsCode) && (detail?.betResult !== EBetResultType.AUTO_CANCEL && detail?.betResult !== EBetResultType.CANCELL && data.billStatus == EOrderTypeStatus.SETTLED && detail?.sportId !== ESportType.TENNIS) && !displayHomeAwayScore(detail?.settleScore, detail.sportId)?.includes('undefined') &&
                      <div className='l-3'>{displayBetItem(detail.betItemName, detail.sportId)}
                        {detail.betResult !== EBetResultType.HANDLE_CANCEL && displayHomeAwayScore(detail?.settleScore, detail.sportId)}
                      </div>}
                      <div className='l-4'>
                        <div>{detail?.homeTeamNameCn} VS {detail?.awayTeamNameCn}</div>
                        {!(betType !== `sub-${EOrderTypeStatus.ABNORMAL}` && detail.sportId < 276) && (
                          <div>
                            {
                              data.billStatus === EOrderTypeStatus.SETTLED &&
                              [EBetResultType.WIN, EBetResultType.WIN_HALF].includes(detail?.betResult) &&
                              <span className='bet-win'>已结算 {BET_RESULT_TYPE_MAP[detail?.betResult]}</span>
                            }
                            {
                              data.billStatus === EOrderTypeStatus.SETTLED &&
                              ![EBetResultType.WIN, EBetResultType.WIN_HALF].includes(detail?.betResult) &&
                              <span className='bet-lose'>已结算 {BET_RESULT_TYPE_MAP[detail?.betResult]}</span>
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-match-detail">
                <div>{betType === `sub-${EOrderTypeStatus.ABNORMAL}` ? '预约金额' : '投注额：'}</div>
                <div>{formatCurrency(data.productAmountTotal)} 元</div>
              </div>
              <div className="order-match-detail blue">
                <div>{data.billStatus === EOrderTypeStatus.SETTLED ? '返还金额' :'可赢额'}：</div>
                <div>
                  {
                    data.billStatus === EOrderTypeStatus.SETTLED &&
                    [EBetResultType.WIN, EBetResultType.WIN_HALF].includes(data.details[0]?.betResult) &&
                    <span className='bet-win'>{formatCurrency(data.productAmountTotal + data.profitAmount)} 元</span>
                  }
                  {
                    data.billStatus === EOrderTypeStatus.SETTLED &&
                    ![EBetResultType.WIN, EBetResultType.WIN_HALF].includes(data.details[0]?.betResult) &&
                    <span>{formatCurrency(data.productAmountTotal + data.profitAmount)} 元</span>
                  }
                  {data.billStatus === EOrderTypeStatus.UNSETTLED && <span>{formatCurrency(data.maxWinAmount)} 元</span>}
                </div>
              </div>
              <div className="order-match-detail">
                <div>投注单号：</div>
                <div className='order-match-id'>
                  <div>
                    {data.id}
                  </div>
                  <CopyToClipboard text={`${data.id}`} onCopy={onCopy}>
                    <DpIcon type='copy' className='copy'/>
                  </CopyToClipboard>
                </div>
              </div>
              <div className="order-match-detail">
                <div>投注时间：</div>
                <div>
                  {dayjs(data.details[0]?.createTime).format('YYYY/MM/DD HH:mm:ss')}
                </div>
              </div>
            </>
          )}
          <div className="order-match-detail">
            <div>注单状态：</div>
            <div className={`${(betType === `sub-${EOrderTypeStatus.ABNORMAL}` && data.status === 0) ? 'blue' : ''}${(betType === `sub-${EOrderTypeStatus.ABNORMAL}` && data.status !== 0) ? 'red' : ''}`}>
              {betType === `sub-${EOrderTypeStatus.ABNORMAL}` && data.status === 0 ? '预约中' : (data.billStatus === EOrderTypeStatus.UNSETTLED || betType === EOrderTypeStatus.SETTLED) ? ORDER_STATUS_MAP[data.status] : BET_RESULT_TYPE_MAP[data.details[0].betResult]}
            </div>
          </div>
          {(betType === `sub-${EOrderTypeStatus.ABNORMAL}` && data.status === 0) && (
            <div
              className="order-match-button"
              onClick={() => showConfirm(`${data.id}`, true)}
            >
              取消预约
            </div>
          )}
          {/* {betType === EOrderTypeStatus.UNSETTLED && (
            <div className="order-match-tips">
              提前兑现规则声明 <img src={require('./i/info.png')} />
            </div>
          )} */}
        </>
      )}
    </div>
  );
};
