import {TMatch} from '@core/services/Table';
import style from './style.scss';
import BetGroupItem from '../BettingDetails/BetGroupItem';

interface IProps {
  match: TMatch;
}

export default React.memo(({match}: IProps) => {
  return (
    <div className={style.champion_item}>
      {
        match.playTypes.map((play) => <BetGroupItem key={`${play.code}_${play.name}`} isChampion={true} play={play} match={match} />)
      }
    </div>
  );
});
