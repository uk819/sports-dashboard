import {distributions} from '../data';
import style from './style.scss';

export default ({type, position}: {type: string; position: 'home' | 'away'}) => {
  return (
    <div className={style.wrapper}>
      <div className='content'>
        <span>{type}</span>
      </div>
      {(position === 'home' ? distributions.home.detail : distributions.away.detail).map((distribution) => (
        <span className={`value-${distribution.id}`} key={distribution.id}>
          {type === '总' ? distribution.all : type === '主' ? distribution.home : distribution.away}
        </span>
      ))}
    </div>
  );
};
