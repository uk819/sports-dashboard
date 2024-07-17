import {useMemo} from 'react';
import style from '../style.module.scss';
interface Props {
  groupKey: string;
  groups: any;
  filter: number[];
  setFilter: (value: any) => void;
  setShowLeagues: (data: any) => void;
  showLeagues: any;
}
const GroupHead = React.memo(({groupKey, groups, filter, setFilter, showLeagues, setShowLeagues}: Props) => {
  const tags = useMemo(() => {
    const tmp:number[] = [];
    groups.forEach((group: any) => {
      tmp.push(group[0].leagueId);
    });
    return tmp;
  }, [filter]);
  const selectedAll = useMemo(() => {
    let tag = true;
    tags.forEach((group: any) => {
      if (filter.includes(group)) {
        tag = false;
      }
    });
    return tag;
  }, [tags]);
  const toggleSetAllTag = () => {
    if (!selectedAll) {
      setFilter(filter.filter((item) => !tags.includes(item)));
    } else {
      setFilter([...filter, ...tags]);
    }
  };
  const setShowPanel = () => {
    setShowLeagues({...showLeagues, [groupKey]: !showLeagues[groupKey]});
  };
  return (
    <div className={style.groupHead}>
      <div className={style.key}>
        <div onClick={setShowPanel} className={!showLeagues[groupKey] ? style.showPanel : style.hidePanel}></div>
        <div className={style.groupKey}>
          {groupKey}
        </div>
      </div>
      <div onClick={toggleSetAllTag} className={selectedAll? style.selected : style.nonSelected}></div>
    </div>
  );
});

export default GroupHead;
