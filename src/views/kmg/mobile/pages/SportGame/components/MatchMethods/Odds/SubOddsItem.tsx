/*
 * @Author: Galen.GE
 * @Date: 2024-01-18 18:34:51
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/MatchMethods/Odds/index.tsx
 * @Description:
 */
// 玩法区块底部玩法

import {PlayType} from '@core/services/Table';

import FootBall from './FootBall';
import style from './style.scss';
import {getPlayListBySidSub, mobileTransforMarkets} from '@core/utils';
import {useMemo} from 'react';
import classnames from 'classnames';

interface IMatchTitlesProps {
  sportId: number;
  mks: PlayType[];
  actIndex?: number;
  inMainList?: boolean;
  ctid: number;
  isbodan: boolean;
}
export default ({sportId, mks, actIndex, inMainList, ctid, isbodan=false}: IMatchTitlesProps) => {
  return (
    <div className={classnames(style.oddsWrapper, {other: ![1, 12].includes(sportId)})}>
      <Odds inMainList={inMainList} actIndex={actIndex} sportId={sportId} mks={mks} ctid={ctid} isbodan={isbodan}/>
    </div>
  );
};

const Odds = ({sportId, mks, actIndex, ctid, isbodan}: IMatchTitlesProps) => {
  const gameList = useMemo(() => getPlayListBySidSub(ctid), [ctid]);

  const markets: PlayType[] = useMemo(() => {
    const _markets = mobileTransforMarkets(sportId, mks, gameList, ctid);

    if (isbodan&&!_markets[1]) {
      _markets[1]=_.cloneDeep(_markets[0]);
      _markets[1]?.mks[0]?.ops.map((item: any)=> {
        item.temporaryValue=true;
        return item;
      });
      _markets[1].code='HT_CS';
      return _markets;
    }
    if (isbodan&&!_markets[0]) {
      _markets[0]=_.cloneDeep(_markets[1]);
      _markets[0]?.mks[0]?.ops.map((item: any)=> {
        item.temporaryValue=true;
        return item;
      });
      _markets[0].code='FT_CS';
      return _markets;
    }
    return mobileTransforMarkets(sportId, mks, gameList, ctid);
  }, [gameList, sportId, mks]);

  return <FootBall actIndex={actIndex} data={markets} isbodan={isbodan} />;
};
