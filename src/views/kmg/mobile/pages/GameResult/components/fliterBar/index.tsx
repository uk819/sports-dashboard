import {TGameResultStatistic} from '@core/reducers/_reduxStore';
import classnames from 'classnames';
import style from './style.module.scss';
import _ from 'lodash';
import {useGameResultListData} from '@core/hooks/sports/useRenderData';
interface Props {
  setFilter?: () => void;
  toggle: () => void;
  showPanel: boolean;
  gameResult: TGameResultStatistic[];
}
const FilterBar = React.memo(({setFilter, toggle, showPanel, gameResult}: Props) => {
  const numberOfLeague = Object.keys(_.groupBy(gameResult, 'ln')).length;
  const {filterTags} = useGameResultListData();

  return (
    <div className={style.filter_wrapper}>
      <div className={style.filter}>
        <div
          className={filterTags.length <= 0 ? classnames(style.icon, style.filterIcon) : classnames(style.icon, style.filterIconActive)}
          onClick={() => setFilter()}
        />
        <div className={style.txt}>全部赛事</div>
        {setFilter ? (
          <div className={style.status}>({numberOfLeague}/{gameResult?.length})</div>
        ) : (
          <div className={style.status}>({gameResult?.length})</div>
        )}
      </div>
      <div onClick={() => toggle()} className={showPanel ? style.showPanel : style.hidePanel}></div>
    </div>
  );
});

export default FilterBar;

