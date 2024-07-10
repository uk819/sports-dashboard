/**
 * @Author: Weima.KMG
 * @Date:
 * @LastEditors:
 * @FilePath:
 * @Description:
 */
import {EBetResultType} from '@core/constants/enum/sport';
import {TBetItem} from './get-betting-odds';

// 赛果列表
export type TGameResultStatisticsItem = {
  leagueId: number;
  leagueLogo: string;
  leagueName: string;
  matchId: number;
  matchName: string;
  hteamLogo: string;
  hteamName: string;
  ateamLogo: string;
  ateamName: string;
  periodType: number;
  q1Goal: string;
  q2Goal: string;
  q3Goal: string;
  q4Goal: string;
  q5Goal: string;
  q6Goal: string;
  q7Goal: string;
  ftGoal: string;
  otGoal: string;
  pkGoal: string;
  finalGoal: string;
  h1Red: string;
  h2Red: string;
  ftRed: string;
  h1Yellow: string;
  h2Yellow: string;
  ftYellow: string;
  h1Corner: string;
  h2Corner: string;
  ftCorner: string;
  beginTime: string;
}

// 赛果信息
export type TGameResultVideoItem = {
  // 假資料形式
  url: string;
  img: string;
  teamId: number;
  time: string;
  typeId: number;
  playerNo: number;
  score: string;
}

export type TResultAddItem = {
  // match Id
  mid: number;
  // 比赛结果
  r: EBetResultType;
  // 開始比分
  bs: string;
  // 結算比分
  ss: string;
  // kindCode
  kc: string;
  // 0：比分类，1：角球类，2：罚牌类
  ctid: number;
}

export type TGameResultDetailItem = Omit<TBetItem, 'od' | 's'> & TResultAddItem;

export type TGameResultFilteredDetailItem = Omit<TBetItem, 'od' | 's'> & Omit<TResultAddItem, 'r'> & {r: string};

/**
export type TGameResultFilteredDetailItem = {
  mid: number;
  bid: string;
  bs: string;
  ss: string;
  kc: string;
  ctid: number;
  res: {
    h: string;
    hoa: string;
    r: string;
  }[];
}
 */
