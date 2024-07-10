import {IDetail} from '../data';
import style from './style.scss';
import classnames from 'classnames';

export default ({trend}: {trend: IDetail}) => {
  return (
    <div className={style.wrapper}>
      <div className='date-event'>
        <p className='date'>{trend.dataEvent.date}</p>
        <p className='league-name'>{trend.dataEvent.leagueName}</p>
      </div>
      <div className='home-name'>{trend.home.name}</div>
      <div className='score'>{`${trend.home.score}-${trend.away.score}`}</div>
      <div className='away-name'>{trend.away.name}</div>
      <div className='handicap'>
        <p className={classnames('value', trend.handicap.result !== '走水' && (trend.handicap.result === '赢' ? 'win' : 'lose'))}>{trend.handicap.value}</p>
        <p className={classnames('result', trend.handicap.result !== '走水' && (trend.handicap.result === '赢' ? 'win' : 'lose'))}>{trend.handicap.result}</p>
      </div>
      <div className='over-under'>
        <p className={classnames('value', {'lose': trend.overUnder.result !== '大'})}>{trend.overUnder.value}</p>
        <p className={classnames('result', {'lose': trend.overUnder.result !== '大'})}>{trend.overUnder.result}</p>
      </div>
    </div>
  );
};
