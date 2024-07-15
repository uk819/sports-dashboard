import style from '../style.module.scss';
interface Props {
  groups: any;
  filter: number[];
  setFilter: (value: any) => void;
}
const GroupContent = React.memo(({groups, filter, setFilter}: Props) => {
  const handleSelect = (leagueId: number) => {
    setFilter([...filter, leagueId]);
  };
  const handleCancelSelect = (leagueId: number) => {
    setFilter(filter.filter((item) => item !== leagueId));
  };
  return (
    <div className={style.groupContent}>
      {groups.map((group: any) => (
        <div key={group[0].leagueId} className={style.item}>
          <div className={style.name}>{group[0].ln}</div>
          <div className={style.select}>
            <div>({group.length})</div>
            {filter.includes(group[0].leagueId) ? (
              <div onClick={() => handleCancelSelect(group[0].leagueId)} className={style.nonSelected}></div>
            ) : (
              <div onClick={() => handleSelect(group[0].leagueId)} className={style.selected}></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default GroupContent;
