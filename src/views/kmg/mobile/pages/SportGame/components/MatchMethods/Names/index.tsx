/*
 * @Author: Galen.GE
 * @Date: 2024-01-18 15:51:00
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/MatchMethods/Names/index.tsx
 * @Description:
 */
import {ESportsCategory} from '@constants/enum/sport/sportsCategory';
import FootBall from './FootBall';
import style from './style.scss';
import {getMobilePlayListBySid, getPlayNameByKc} from '@core/utils';
import {useMemo} from 'react';

interface IMatchTitlesProps {
  sportId: number;
  actIndex: number;
}
export default ({sportId, actIndex}: IMatchTitlesProps) => {
  return (
    <div className={style.nameWrapper}>
      <Names sportId={sportId} actIndex={actIndex} />
    </div>
  );
};

const Names = ({sportId, actIndex}: IMatchTitlesProps) => {
  const gameList = useMemo(() => {
    return getMobilePlayListBySid(sportId);
  }, [sportId]);

  const gameNames = useMemo(() => {
    return gameList.map((item) => getPlayNameByKc({code: item, sportId}));
  }, [gameList]);
  switch (sportId) {
    case ESportsCategory.FOOTBALL:
      return <FootBall actIndex={actIndex} />;
    default:
      return <div className="name-list">
        {
          gameNames.map((item) => <span className="label" key={item}>{item}</span>)
        }
      </div>;
  }
};
