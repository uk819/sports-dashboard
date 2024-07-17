import React from 'react';
import TStore from '@core/reducers/_reduxStore.d';
import {useSelector} from 'react-redux';
import Empty from '@this/shadow/Empty';
import style from './style.module.scss';
import SingleSport from './SingleSport';

export default React.memo(() => {
  const {championResult} = useSelector((state: TStore) => state.sport.display);

  return (
    <div className={style.wrapper}>
      {championResult.length ? (
        <>
          {championResult.map((champion) => (<SingleSport key={champion.sportId} data={champion} />))}
          <div className={style.no_more} >没有更多数据了</div>
        </>
      ) : (
        <div className={style.empty_wrapper}><Empty/></div>
      )}
    </div>
  );
});
