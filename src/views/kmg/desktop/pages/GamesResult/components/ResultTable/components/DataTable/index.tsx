// import {IconFilterDescending} from '@views/kmg/desktop/components/Icon';
import {ReactNode} from 'react';
import SingleDataRow from './SingleDataRow';
import styles from './style.scss';
import {TGameResultStatistic} from '@core/reducers/_reduxStore';
import {EGameResult} from '@core/constants/enum/sport/gamesResult';
import DpSkeleton from '@views/kmg/desktop/components/Skeleton';
import Empty from '@views/kmg/desktop/components/Empty';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import sportsCategory from '@core/constants/enum/sport/sportsCategory';
import {useGameResultListData} from '@core/hooks/sports/useRenderData';
import {Tooltip} from 'antd';
import {useScrollToTop} from '@core/hooks/misc';
import {ELoadingKeys} from '@core/constants/enum/sport';

export interface propTypes {
  tags: Record<EGameResult, ReactNode>,
  gamesResult: Array<TGameResultStatistic>
};

export default React.memo(() => {
  const tableRef = useScrollToTop();
  const {gamesResult, loading, noData, viewDetail, handleDetailView} = useGameResultListData();
  const {sportId} = useSelector((state: TStore) =>state.sport.userSettings.gameResultPageInfo);
  const tags = _.find(sportsCategory, {sportId}).resultIcons;

  return (
    <div className={styles.wrapper}>
      <div className="header">
        <div className='body-row'>
          <span className='wide-element contain-filtering'>
            <span>日期</span>
            {/* <span><IconFilterDescending /></span> */}
          </span>
          <span className='wide-element'>联赛</span>
          <span className='wide-element'>赛事</span>
          {!!tags && Object.entries(tags).map(([key, icon])=> {
            return (
              <Tooltip key={key} title={icon.title} placement='bottom'>
                <span>{!icon.element ? icon.title : icon.element}</span>
              </Tooltip>
            );
          })}
        </div>
      </div>
      <div className="table-body" ref={tableRef}>
        {loading.display && loading.text === ELoadingKeys.GAMES_RESULT ? (
          <DpSkeleton type={ELoadingKeys.GAMES_RESULT} length={7} />
        ) : noData ? (
          <div className='no-record'>
            <Empty description='暂无数据' type="record" />
          </div>
        ) : gamesResult.map((row, idx) =>
          <SingleDataRow key={row.mid || idx} viewDetail={viewDetail} toggleIcon={handleDetailView} data={row} tags={tags} />)}
      </div>
    </div>
  );
});
