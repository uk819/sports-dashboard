import {TBettingOrder} from '@core/apis/models/dashboard/get-betting-record.d';
import {BET_RESULT_TYPE_MAP, EBetResultType, EESportType, EGameType, EOrderTypeStatus} from '@constants/enum/sport/index';
import {formatCurrency} from '@helpers/unit';
import style from './style.scss';
import Empty from '@views/kmg/desktop/components/Empty';
import {chooseEuropeOrAsiaText, displayHomeAwayScore, getBetHandiCapAtBetting, getBetTeamType, getPlayNameByKc, isChampion, isPlayingMatch, isVisiableSecondText} from '@core/utils';
import {useInView} from 'react-intersection-observer';
import {Tooltip} from 'antd';
import classnames from 'classnames';
import useSettings from '@core/hooks/sports/useSettings';
import useReserverRecordHooks from '@core/hooks/dashboard/useReserverRecordHooks';
interface IProps {
  betType: number;
}
const tabs = [
  {
    name: '进行中',
    params: {queryType: 3},
  },
  {
    name: '已取消',
    params: {queryType: 4},
  },
  {
    name: '预约失败',
    params: {queryType: 5},
  },
];
export default React.memo(({betType}: IProps) => {
  const searchParams = {pageNum: 1};
  const {list, getList, params, hasMore, loading, showConfirm} = useReserverRecordHooks({...searchParams, isAdd: false});
  const [selectIndex, setSelectIndex] = React.useState(0);
  const actTab = React.useMemo(() => {
    return tabs[selectIndex] as typeof tabs[0];
  }, [selectIndex]);
  const {ref, entry, inView} = useInView();
  React.useEffect(()=>{
    const searchParams = {pageNum: 1, ...actTab.params};
    const stateParams = {isAdd: false};
    getList({...searchParams, isReserve: 1}, stateParams);
  }, []);
  React.useEffect(()=>{
    if (inView && entry.boundingClientRect.top > 500) {
      getList({pageNum: params.pageNum + 1}, {isAdd: true, isInit: false});
    }
  }, [inView]);
  return (
    <div className={classnames(style.wrapper)} >
      {
        <div className={classnames('reserve-tab')} >
          {
            tabs.map((item, index)=>{
              return (
                <div className={classnames(selectIndex === index ? 'active' : '')}
                  key={item.name}
                  onClick={()=>{
                    setSelectIndex(index);
                    getList({pageNum: 1, ...item.params});
                  }}>
                  <span className='text'>{item.name}</span>
                  <span className='line'></span>
                </div>
              );
            })
          }
        </div>
      }
      <div className='order-list'>
        {
          betType === EOrderTypeStatus.RESERVER &&
          list.map((item, idx: number) => <OrderItem showConfirm={showConfirm} data={item} key={idx} betType={betType}/>)}
        {!loading && hasMore && list.length>0 && <div className='more-data' ref={ref}>正在加载中...</div>}
        {list.length=== 0 && (
          <div className='dp-empty-wrap center'>
            <Empty description='暂无数据' type="empty" />
          </div>
        )}
      </div>
    </div>
  );
});

interface IOrderItem {
  data: TBettingOrder;
  betType:EOrderTypeStatus;
  showConfirm: (orderId: string) => void;
}
function OrderItem({data, betType, showConfirm}: IOrderItem) {
  const {switchSportByType, switchGameType, sportId} = useSettings();
  const handleSwitchSport = React.useCallback((newSportId: number) => {
    if (sportId === newSportId || (sportId > 33 && newSportId === EESportType.ALL)) {
      return;
    }
    if (sportId <= 33 && newSportId === EESportType.ALL) {
      switchGameType(EGameType.ESPORTS, EESportType.LOL);
    } else if (sportId > 33 && newSportId !== EESportType.ALL) {
      switchGameType(EGameType.SPORTS, newSportId);
    } else {
      switchSportByType(newSportId);
    }
  }, [sportId]);
  return (
    <div className='order-item'>
      <div className='game-type'>
        <span className='line'></span>
        <span className='type-name'>单关</span>
      </div>
      <div className='game-main'>
        {data.details.map((detail, index) => (
          <div key={detail.orderId+index}>
            <div className='reserve-status'>
              <div className='reserve-text'>
                {data.status === 0 ? '预约中' : BET_RESULT_TYPE_MAP[detail.betResult] }
              </div>
              {data.status === 0 && (
                <div
                  className="cancel-btn"
                  onClick={() => showConfirm(`${data.id}`)}
                >
                  取消
                </div>
              )}
            </div>
            <div className='league-name'>{detail.leagueNameCn}</div>
            <div className='match-names'>
              {
                !isChampion(detail.kindsCode) &&
                <Tooltip
                  title={`${detail.homeTeamNameCn} v ${detail.awayTeamNameCn}`}
                  placement='top'>
                  {detail.homeTeamNameCn} VS {detail.awayTeamNameCn}
                  {(data.details[0]?.betResult !== EBetResultType.AUTO_CANCEL && data.details[0]?.betResult !== EBetResultType.CANCELL && EOrderTypeStatus.UNSETTLED === data.billStatus && detail?.isInplay === 1) && displayHomeAwayScore(detail.scoreBenchmark, detail.sportId)}
                  {(data.details[0]?.betResult !== EBetResultType.AUTO_CANCEL && data.details[0]?.betResult !== EBetResultType.CANCELL && EOrderTypeStatus.SETTLED === data.billStatus) && displayHomeAwayScore(detail.settleScore, detail.sportId)}
                </Tooltip>
              }
            </div>
            <div className='bet-detail'>
              <div className='l-1'>
                <span>
                  <Tooltip title={`[${detail.sportNameCn}]`}>
                    <em onClick={()=>handleSwitchSport(detail.sportId)}>[{detail.sportNameCn}]</em>
                  </Tooltip>
                  {isPlayingMatch(detail.isInplay, detail.kindsCode)}&nbsp;&nbsp;{getPlayNameByKc({code: detail.kindsCode, name: detail.betItemName, ctid: detail.betItemCTID, sportId: detail.sportId})}&nbsp;&nbsp;
                  <em className='bet-game-type-text'>{chooseEuropeOrAsiaText(detail.marketType, detail.sportId)}</em>
                </span>
              </div>
              <div className='l-2'>
                <Tooltip title={`${getBetTeamType(detail)}`}>
                  <em className='play-type-name'>{getBetTeamType(detail)}</em>
                  {isVisiableSecondText(detail.betHandicap, detail.betN, detail.kindsCode) &&
                    <em>{getBetHandiCapAtBetting(detail.betHandicap, detail.sportId)}</em>}
                </Tooltip>
              </div>
              <div className='l-3'>
                <div className='odd'>
                  <span>@</span>
                  <span>{formatCurrency(detail.oddValue)}</span>
                </div>
                <div className='bet-result'>
                  {
                    (data.details[0]?.betResult !== EBetResultType.AUTO_CANCEL && data.details[0]?.betResult !== EBetResultType.CANCELL && data.billStatus == EOrderTypeStatus.SETTLED) &&
                    <span className={[EBetResultType.WIN, EBetResultType.WIN_HALF].includes(detail.betResult) ? 'win':'lose'}>
                      {BET_RESULT_TYPE_MAP[detail.betResult]}
                    </span>
                  }
                </div>
              </div>
            </div>
            {index !== data.details.length -1 && <div className='divider' />}
          </div>
        ))}
        <div className='bet-win'>
          <div>
            <span>投注金额</span>
            <span>{formatCurrency(data.productAmountTotal)}</span>
          </div>
          {
            data.billStatus == EOrderTypeStatus.UNSETTLED &&
            <div className='win-max-display'>
              <span>最高可赢</span>
              <span>{formatCurrency(data.maxWinAmount)}</span>
            </div>
          }
          {
            data.billStatus == EOrderTypeStatus.SETTLED &&
            <div className='win-max-display'>
              <span>返还金额</span>
              <span>{formatCurrency(data.profitAmount + data.productAmountTotal)}</span>
            </div>
          }
        </div>
      </div>
      <div className="order-bottom-line"></div>
    </div>
  );
}
