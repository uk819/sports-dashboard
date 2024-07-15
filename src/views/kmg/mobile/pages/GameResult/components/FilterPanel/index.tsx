import Overlay from '@template/components/Overlay';
import style from './style.module.scss';
import {IndexBar} from 'antd-mobile';
import GroupHead from './components/groupHead';
import GroupContent from './components/groupContent';
import {useGameResultListData} from '@core/hooks/sports/useRenderData';
import {useEffect, useState} from 'react';
import usePublicState from '@core/hooks/usePublicState';
interface Props {
  display: boolean;
  close: () => void;
}

const FilterPanel = React.memo(({display, close}: Props) => {
  const {gameResultByGroup, filterTags, gamesResult, setFilter, setAllTag} = useGameResultListData();
  const {dispatch, ACTIONS} = usePublicState();
  const numberOfLeague = Object.keys(_.groupBy(gamesResult, 'ln')).length;
  const toggleSetAllTag = () => {
    if (filterTags.length === 0) {
      setAllTag(false);
    } else {
      setAllTag(true);
    }
  };
  const [showLeagues, setShowLeagues] = useState<{
    [key: string]: boolean;
  }>({});
  const searchClick = ()=>{
    if (numberOfLeague===0) {
      dispatch(ACTIONS.BASE.openToast({text: '至少选择1个联赛', types: 'error'}));
      return;
    }
    close();
  };
  useEffect(() => {
    const initialShowLeagues: { [key: string]: boolean } = {};
    Object.keys(gameResultByGroup).forEach((key) => {
      initialShowLeagues[key] = true;
    });
    setShowLeagues(initialShowLeagues);
  }, [gameResultByGroup]);
  return (
    <Overlay display={display} zIndex={1000} close={close}>
      <div className={style.wrapper}>
        <div className={style.head}>
          <div className={style.filter}>
            <div className={style.icon} />
            <div className={style.txt}>全部赛事</div>
            <div className={style.status}>(<span>{numberOfLeague}</span>/{gamesResult.length}）</div>
          </div>
          <div className={style.select}>
            <div>全选</div>
            <div onClick={toggleSetAllTag} className={filterTags.length === 0 ? style.selected : style.nonSelected}></div>
          </div>
        </div>
        <div className={style.content}>
          <IndexBar>
            {Object.entries(gameResultByGroup).map(([key, value]) => (
              <IndexBar.Panel
                key={key}
                title={<GroupHead
                  groupKey={key}
                  groups={value}
                  filter={filterTags}
                  setFilter={setFilter}
                  setShowLeagues={(data: any) =>setShowLeagues(data) }
                  showLeagues={showLeagues}
                />}
                index={key}
              >
                {showLeagues[key] && (
                  <GroupContent
                    groups={value}
                    filter={filterTags}
                    setFilter={setFilter}
                  />
                )}
              </IndexBar.Panel>
            ))}
          </IndexBar>
        </div>
        <div className={style.close} onClick={searchClick}>关闭</div>
      </div>
    </Overlay>
  );
});

export default FilterPanel;
