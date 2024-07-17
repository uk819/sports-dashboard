import {ESportsCategory} from '@core/constants/enum/sport/sportsCategory';
import style from './style.module.scss';
import {LeagueItemPrps} from './../../type';
import {EGameResult} from '@core/constants/enum/sport/gamesResult';

export default React.memo(({sportId, data}: LeagueItemPrps) => {
  const getRes = (h: Number, a: Number):string => {
    const val = h > a ? style.con_win : (h < a ? style.con_lose : style.con);
    return val;
  };
  const itemRightCon = ()=> {
    if ([ESportsCategory.BADMINTON, ESportsCategory.BASEBALL, ESportsCategory.TABLE_TENNIS, ESportsCategory.LOL, ESportsCategory.DOTA, ESportsCategory.CSGO, ESportsCategory.KING].includes(sportId)) {
      return <>
        <div className={getRes(data?.details?.[EGameResult.FG]?.[0], data?.details?.[EGameResult.FG]?.[1])}>{data?.details?.[EGameResult.FG]?.[0] || 0}</div>
        <div className={getRes(data?.details?.[EGameResult.FG]?.[1], data?.details?.[EGameResult.FG]?.[0])}>{data?.details?.[EGameResult.FG]?.[1] || 0}</div>
      </>;
    }
    if (sportId===ESportsCategory.TENNIS) {
      return <>
        <div className={getRes(data?.details?.[EGameResult.SET]?.[0], data?.details?.[EGameResult.SET]?.[1])}>{data?.details?.[EGameResult.SET]?.[0] || 0}</div>
        <div className={getRes(data?.details?.[EGameResult.SET]?.[1], data?.details?.[EGameResult.SET]?.[0])}>{data?.details?.[EGameResult.SET]?.[1] || 0}</div>
      </>;
    }
    return <>
      <div className={getRes(data?.details?.[EGameResult.FTG]?.[0], data?.details?.[EGameResult.FTG]?.[1])}>{data?.details?.[EGameResult.FTG]?.[0] || 0}</div>
      <div className={getRes(data?.details?.[EGameResult.FTG]?.[1], data?.details?.[EGameResult.FTG]?.[0])}>{data?.details?.[EGameResult.FTG]?.[1] || 0}</div>
    </>;
  };
  return (
    <div className={style.oddsWrapper}>
      {itemRightCon()}
    </div>
  );
});
