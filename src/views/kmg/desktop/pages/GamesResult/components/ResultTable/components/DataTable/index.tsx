// import {IconFilterDescending} from '@views/kmg/desktop/components/Icon';
import {ReactNode} from 'react';
import SingleDataRow from './SingleDataRow';
import ChampionDataRow from './ChampionDataRow';
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
import classnames from 'classnames';
import {DpIcon} from '@views/kmg/desktop/components';

export interface propTypes {
  tags: Record<EGameResult, ReactNode>,
  gamesResult: Array<TGameResultStatistic>
};

export default React.memo(() => {
  const tableRef = useScrollToTop();
  const {gamesResult, loading, noData, viewDetail, handleDetailView, championDetailResult} = useGameResultListData();
  const {sportId} = useSelector((state: TStore) =>state.sport.userSettings.gameResultPageInfo);
  const tags = _.find(sportsCategory, {sportId})?.resultIcons;
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const handleOrder = ()=> {
    setIsActive(!isActive);
  };

  return (
    <div className={styles.wrapper}>
      <div className="header">
        <div className={classnames('body-row', `sports-${sportId}`)}>
          <span className='wide-element contain-filtering'>
            <span>比赛时间</span>
            <DpIcon className='date-order' type='order'active={isActive} onClick={handleOrder}/>
            {/* <span><IconFilterDescending /></span> */}
          </span>
          <span className='wide-element'>联赛</span>
          <span className='wide-element'>{sportId !== 999 ? '赛事' : '玩法'}</span>
          {!!tags && sportId !==999 ? Object.entries(tags).map(([key, icon])=> {
            return (
              <Tooltip key={key} title={icon.title} placement='bottom'>
                <span>{!icon.element ? icon.title : icon.element}</span>
              </Tooltip>
            );
          }) : <span>结果</span>}
        </div>
      </div>
      <div className="table-body" ref={tableRef}>
        {loading.display && loading.text === ELoadingKeys.GAMES_RESULT ? (
          <DpSkeleton type={ELoadingKeys.GAMES_RESULT} length={7} />
        ) : noData ? (
          <div className='no-record'>
            <Empty description='暂无数据' type="record" />
          </div>
        ) : (sportId !== 999 ?
          (isActive ? [...gamesResult].reverse(): gamesResult).map((row, idx) => <SingleDataRow key={row.mid || idx} viewDetail={viewDetail} toggleIcon={handleDetailView} data={row} tags={tags} sportId={sportId} />):
          (isActive ? [...championDetailResult].reverse(): championDetailResult).map((champion, idx)=> <ChampionDataRow data={champion} key={idx} />))}
      </div>
    </div>
  );
});
