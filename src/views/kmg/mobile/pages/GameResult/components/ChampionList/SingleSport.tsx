import React, {useEffect, useRef, useState} from 'react';
import {TChampionResult} from '@core/reducers/_reduxStore.d';
import style from './style.module.scss';
import Item from './Item';
import ChampionFilterBar from '../fliterBar/ChampionFilterBar';

export default React.memo(({data}: {data: TChampionResult}) => {
  const {sportId: id, sportName: sn, counts, details} = data;
  const matches = _.groupBy(details, 'matchName');
  const mnAll = useRef([]);
  const isCollapseAll = useRef(false);
  const [isCollapse, setIsCollapse]=useState<string[]>([]);

  useEffect(() => {
    mnAll.current = Object.keys(matches);
  }, [matches]);

  const onToggle = ()=> {
    if (isCollapseAll.current) {
      setIsCollapse([]);
    } else {
      setIsCollapse(mnAll.current);
    }
    isCollapseAll.current = !isCollapseAll.current;
  };

  const toggleCollapseLeague = (mn: string)=> {
    const _pre = isCollapse.length ? [...isCollapse] : [];
    if (_.includes(_pre, mn)) {
      _.remove(_pre, (item) => item === mn);
      isCollapseAll.current = (_pre.length === mnAll.current.length);
      setIsCollapse(_pre);
    } else {
      const _newLen = _pre.push(mn);
      isCollapseAll.current = (_newLen === mnAll.current.length);
      setIsCollapse(_pre);
    }
  };

  return (
    <div className={style.single_wrapper}>
      <ChampionFilterBar sportId={id} count={counts} sportName={sn} toggle={onToggle} showPanel={isCollapseAll.current} />
      {Object.entries(matches).map(([mn, match]) => {
        return <Item key={mn} mn={mn} match={match} isCollapse={isCollapse} toggleCollapseLeague={toggleCollapseLeague} />;
      })}
    </div>
  );
});
