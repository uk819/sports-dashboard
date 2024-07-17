import {IAOIndex} from '../data';
import style from './style.scss';

export default ({betIndexes}: {betIndexes: IAOIndex[]}) => {
  return (
    <div className={style.wrapper}>
      <div className='types'>
        <span className='home'>主</span>
        <span className='odds'>初始盘</span>
        <span className='away'>客</span>
        <span className='home'>主</span>
        <span className='odds'>即时盘</span>
        <span className='away'>客</span>
      </div>
      <div className='detail'>
        {betIndexes.map((betIndex) => (
          <div className='index' key={betIndex.id}>
            <div className='name'>
              <p>{betIndex.name}</p>
            </div>
            <div className='item'>
              <span className='home'>{betIndex.item.homeSt}</span>
              <span className='odds'>{betIndex.item.initialOdds}</span>
              <span className='away'>{betIndex.item.awaySt}</span>
              <span className='home'>{betIndex.item.homeNd}</span>
              <span className='odds'>{betIndex.item.liveOdds}</span>
              <span className='away'>{betIndex.item.awayNd}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
