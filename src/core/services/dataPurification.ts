/*
 * @Author: Passion.KMG
 * @Date: 2023-12-18 15:03:22
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/services/dataPurification.ts
 * @Description: 接口数据 MAPPING 与 数据清洗
 */
import {TMatchDetail, TPlayTypeDetail, TBetItemLine} from '@core/apis/models/sport/get-match-list.d';
import {MatchDetailStatistics, IMatchDetailApi} from '@core/apis/models/sport/get-match-detail-statistics';
import {TMatchStatistics} from '@core/apis/models/sport/get-match-statistics';
import {TBetItem} from '@core/apis/models/sport/get-betting-odds';
import {TLeagueStatisticsItem} from '@core/apis/models/sport/get-league-statistics';
import {TMatch, TOrder} from '@core/services/Table.d';
import * as ESport from '../constants/enum/sport';
import * as TYPES from '@core/reducers/_reduxStore.d';
import G from '@constants/global';
import {TKeys} from '@constants/global';
import {subtractDecimals} from '@core/utils/math';
import {multiplyAndFix} from '@core/helpers/unit';
import {getViewOddFn} from '@core/hooks/sports/useOddTransfer';
import {JsqSort, assertHomeAwayScore} from '@core/utils';
import {TGameResultStatisticsItem} from '@core/apis/models/sport/get-game-result';
import dayjs from 'dayjs';
import {EGameResult} from '@core/constants/enum/sport/gamesResult';
import configs from '@views/kmg/public/configs';

const sortMap: any = {
  'HOME': 0,
  'DRAW': 1,
  'AWAY': 2,
  'HOME_FIRST': 0,
  'HOME_LAST': 1,
  'AWAY_FIRST': 2,
  'AWAY_LAST': 4,
};

function getSortIndex({kindsCode, sortIndex, betHandicap, hoa}: {kindsCode: string; sortIndex: number; betHandicap: string, hoa: string}) {
  if (kindsCode.endsWith('_1X2')) {
    return sortMap[betHandicap?.toUpperCase()] || sortIndex;
  } else if (kindsCode === 'FT_TTS') {
    return sortMap[`${hoa?.toUpperCase()}_${betHandicap?.toUpperCase()}`] ?? 9;
  }
  return sortIndex;
}

/**
 * @description: 将接口数据映射到本地数据
 * @param matchList
 */
const DX_BALL = ['FT_OU', 'HT_OU', 'Q1_OU', 'Q2_OU', 'Q3_OU', 'Q4_OU', 'FTS_OU', 'S1_OU', 'S2_OU', 'S3_OU'];
export const mapMatchList = (matchList: Array<TMatchDetail>, type: 'match-list' | 'match-detail' | 'favorite-list'): {
  matches: Array<TMatch>;
  leagues: Array<TYPES.TLeague>;
  updateTime: number
} => {
  let sortNo = 0;
  let cacheKey: TKeys = 'MATCH_LIST_ODDS';
  if (type === 'match-detail') {
    cacheKey = 'MATCH_DETAIL_ODDS';
  }
  if (type === 'favorite-list') {
    cacheKey = 'FAVORITE_MATCH_ODDS';
  }
  const prevOdds = G.GET(cacheKey) || {};
  const curOdds: any = {};
  const matches: Array<TMatch> = [];
  const leagues: Array<TYPES.TLeague> = [];
  const updateTime = new Date().getTime();
  _.each(matchList, (item: TMatchDetail): void | boolean => {
    if (!item.md) {
      return true;
    }
    const match: TMatch = {
      updateTime,
      sortNo,
      matchId: item.md.mid,
      playSort: item.md.lv,
      pmId: item.md.pmid,
      pdId: item.md.pdid,
      mid1: item.md.mid1,
      vid: item.md.vid,
      matchName: item.md.mn,
      leagueId: item.md.lid,
      leagueName: item.md.ln,
      sportId: item.md.sid,
      isLive: !!item.md.ip,
      playTypeCount: item.md.bc, // 缺失
      isFavorite: false,
      isNe: item.md.isNe === 1,
      hasCorner: !!item.md.hcn,
      spt: item.md.pt,
      round: `BO${item.md.pt}`,
      reverse: item.md.r === 1,
      isChampion: item.md.ic === 1,
      teams: {
        home: {
          name: item.md.ht?.tn,
          icon: item.md.ht?.lg,
          isHandicap: item.ptds?.filter((ptd) => ptd.kc === 'FT_AH' && ptd.ctid === 0)?.some((ptd) => ptd.hcl[0].bil.some((b) => (b.h.startsWith('-') && b.hoa?.toUpperCase() === 'HOME'))),
        },
        away: {
          name: item.md.at?.tn,
          icon: item.md.at?.lg,
          isHandicap: item.ptds?.filter((ptd) => ptd.kc === 'FT_AH' && ptd.ctid === 0)?.some((ptd) => ptd.hcl[0].bil.some((b) => (b.h.startsWith('-') && b.hoa?.toUpperCase() === 'AWAY'))),
        },
      },
      matchClock: {
        receiveTime: _.now(),
        startTime: Number(item.md.bt),
        second: item.md.me?.t ? Number(item.md.me?.t.split(':')[0]) * 60 + Number(Number(item.md.me?.t.split(':')[1])) : 0, // 缺失
        playTime: item.ptds?.length > 0 ? item.md.me?.t : 'FT',
        period: (item.md.ip === 1 && !item.md.me?.pd) ? 'LIVE' : item.md?.s === 'over' ? 'FT' : item.md.sid === 3 ? item.md.me?.pd?.toUpperCase() : item.md.me?.pd,
        isRunning: item.md.ip === 1, // 缺失
        isCountDown: false, // 缺失
      },
      score: {
        home: (JSON.parse(item.md.me?.tps || '{}')?.p?.adv !== undefined && JSON.parse(item.md.me.tps)?.p?.adv === 1) ? 'A' : item.md.me?.hs,
        away: (JSON.parse(item.md.me?.tps || '{}')?.p?.adv !== undefined && JSON.parse(item.md.me.tps)?.p?.adv === 0) ? 'A' : item.md.me?.as,
        homeRedCard: item.md.me?.hr || 0,
        awayRedCard: item.md.me?.ar || 0,
        homeYellowCard: item.md.me?.hy,
        awayYellowCard: item.md.me?.ay,
        homeCorner: item.ptds?.some((p) => p.ctid === 1) ? item.md.me?.hc : null,
        awayCorner: item.ptds?.some((p) => p.ctid === 1) ? item.md.me?.ac : null,
        periodScore: JSON.parse(item.md.me?.ps || '[]').map((item: {h: number; a: number; c: string;}) => ({
          home: item.h,
          away: item.a,
          period: item.c,
        })),
        otherScore: item.md.me?.tps ? JSON.parse(item.md.me.tps) : null,
      },
      animation: [], // 缺失
      live: item.md.u ? [item.md.u] : [],
      playGroup: JSON.parse(item.md.me?.hf || '[]').map((item: {id: number, n: string}) => ({id: item.id, name: item.n})),
      competitionType: (configs.SPORT.COMPETITION_TYPE[item.md.sid] && item.md.pt) ? `${item.md.pt}${configs.SPORT.COMPETITION_TYPE[item.md.sid]}${Math.floor(item.md.pt / 2) + 1}胜` : null,
      playTypes: (item.ptds || []).map((odd: TPlayTypeDetail) => ({
        code: odd.kc,
        playGroupIds: JSON.parse(odd.hf || '[]'),
        name: odd.bn,
        period: odd.bn, // 目前与名称保持一致，应该为某个枚举值
        ctid: odd.ctid,
        mks: odd.hcl.map((market) => ({ // 目前只做一条线
          mkId: market.sbim,
          allowParlay: true, // 缺失
          ops: (odd.kc === 'WinningMargin' ? JsqSort(market.bil) : market.bil)?.filter((od) => !!od).map((od: TBetItemLine, odIndex) => ({
            sortIndex: getSortIndex({kindsCode: odd.kc, sortIndex: odIndex, betHandicap: od.h, hoa: od.hoa}),
            win: od?.w,
            ctid: odd.ctid,
            matchId: item.md.mid,
            matchName: item.md.mn,
            matchDate: Number(item.md.bt),
            leagueId: item.md.lid,
            leagueName: item.md.ln,
            teams: {
              home: {
                name: item.md.ht?.tn,
                icon: '', // 缺失
              },
              away: {
                name: item.md.at?.tn,
                icon: '', // 缺失
              },
            },
            score: {
              home: item.md.me?.hs,
              away: item.md.me?.as,
              homeRedCard: item.md.me?.hr,
              awayRedCard: item.md.me?.ar,
              homeYellowCard: item.md.me?.hy,
              awayYellowCard: item.md.me?.ay,
              homeCorner: item.ptds?.some((p) => p.ctid === 1) ? item.md.me?.hc : null,
              awayCorner: item.ptds?.some((p) => p.ctid === 1) ? item.md.me?.ac : null,
              periodScore: JSON.parse(item.md.me?.ps || '[]').map((item: {h: number; a: number; c: string;}) => ({
                home: item.h,
                away: item.a,
                period: item.c,
              })),
            },
            sportId: item.md.sid,
            isRunning: item.md.ip === 1, // 缺失
            mkId: odd.hcl[0].sbim,
            playName: odd.bn,
            id: Number(od.bid),
            name: (item.md.sid < 33 && od.n) || (DX_BALL.includes(odd.kc) ? od.hoa === 'Over' ? `大 ${od.h}` : `小 ${od.h}` : od.h) || od.hoa,
            orderName: od.h,
            betTeam: (item.md.sid < 33 && od.n) ? '' : od.hoa || od.h,
            betHandicap: od.h,
            hoa: od.hoa,
            locked: od.s === 4,
            ended: od.s === 5,
            available: od.s === 2,
            od: od.od,
            type: od.h, // 投注时需要知道是哪一个玩法的赔率，待确认
            change: calcOddsChange(prevOdds[`${item.md.mid}-${odd.kc}-${odd.hcl[0].sbim}-${od.bid}`], od.od),
            justAddCar: true, // 是否是刚刚加入投注栏的订单
            prevOdd: od.od,
            minBetAmount: 10,
            finallyMaxBetAmount: 0,
            maxBetAmount: 0,
            maxWinAmount: 0,
            overAmountLimit: false,
            isReserve: false,
            inReservationStatus: false,
            reservationMaxBetAmount: 0,
            reservationMaxWin: 0,
            reservationOdd: '0',
            reservationMarkOdd: 0,
            reserveAlert: false,
            sportNameText: '',
            oddBetType: ESport.EOddTypeMap[od.ot] || ESport.EOddType.EUROPE,
            lv: item.md.lv,
            betName: (item.md.sid < 33 && od.n),
            kc: odd.kc,
            tag: (() => {
              curOdds[`${item.md.mid}-${odd.kc}-${odd.hcl[0].sbim}-${od.bid}`] = od.od;
              return `${item.md.mid}-${odd.kc}-${odd.hcl[0].sbim}-${od.bid}`;
            })(),
          })),
        })),
      })),
    };
    requestAnimationFrame(() => {
      G.SET(cacheKey, curOdds || {});
    });
    // 排序
    sortNo++;
    // 比赛
    matches.push(match);
    // 联赛
    const league: TYPES.TLeague = {
      leagueId: item.md.lid,
      leagueName: item.md.ln,
      leagueIcon: '', // 缺失
      isFavorite: false, // 缺失
      sportId: item.md.sid,
    };
    leagues.push(league);
  });

  return {
    matches,
    leagues: _.uniqBy(leagues, 'leagueId'),
    updateTime,
  };
};
// 判断kc 类型名字或是数值
const assertKcName = (kc:string, h:string)=>{
  if (['FT_CS', 'HT_CS'].includes(kc)) {
    if (h ==='AOS') return '其他';
    const [home, away]= assertHomeAwayScore(h);
    return home + '-' + away;
  };
  return h;
};
// 计算赔率变化
const calcOddsChange = (prevOdds: number, odds: number, isJustAddCar: boolean = false) => {
  if (isJustAddCar) return 'none';
  if (!prevOdds) return 'none';
  if (prevOdds > odds) return 'down';
  if (prevOdds < odds) return 'up';
  return 'none';
};
// 计算最高可赢
export const winMaxChange = (money:number|string, odds: number, currentOddType:number = 2) => {
  if (!money) return 0;
  return subtractDecimals(multiplyAndFix(Number(money), Number(odds)), Number(money));
};

// 统计接口映射到本地数据
export const mapMatchStatistics = (matchStatistics: Array<TMatchStatistics>): TYPES.TMatchStatistics => _.chain(matchStatistics)
    // .orderBy('sid')
    .map((item) => ({
      sportId: item.sid,
      sportName: item.snc,
      count: item.ct,
      available: item.s,
      sportShowSwitch: item?.sportShowSwitch,
      morningSwitch: item?.morningSwitch,
      rollingBallSwitch: item?.rollingBallSwitch,
    }))
    .value();

type ODD_TYPE = 'HK'|'ML'|'OU';
// 赔率接口映射到本地数据
export const mapBettingOdds = (bettingOdds: Array<TBetItem>, orders: { [key: string]: TOrder }): { [key: string]: TOrder } => {
  const _orders = _.cloneDeep(orders);
  // 更新 orders
  Object.keys(_orders).map((tag)=>{
    const order = _orders[tag];
    const odd: any = _.find(bettingOdds, {'bid': String(order.id)});
    if (odd) {
      const ot: ODD_TYPE = odd?.ot;
      const {reservationOdd, inReservationStatus, currentOddType} = order;
      const viewOdd = getViewOddFn(inReservationStatus? reservationOdd : odd.od, inReservationStatus? currentOddType: (ESport.EOddTypeMap as any)[ot], ESport.EOddType.EUROPE);
      const europeOdd = getViewOddFn(odd.od, ESport.EOddTypeMap[ot], 1);
      const realTimeMaxBetAmount = Math.floor(order.maxWinAmount / Number(europeOdd));
      let finallyMoney = '';
      if (order.money) {
        finallyMoney = Number(order.money) > realTimeMaxBetAmount ? String(realTimeMaxBetAmount) : String(order.money);
      }
      _orders[tag] = {
        ...order,
        od: odd.od,
        name: assertKcName(order.tag.split(/-/)[1], odd.h),
        change: calcOddsChange(order.prevOdd, odd.od, order.justAddCar),
        europeOdd: Number(europeOdd),
        maxWin: winMaxChange(order.money, Number(viewOdd)),
        maxBetAmount: order.maxBetAmount > realTimeMaxBetAmount ? realTimeMaxBetAmount : order.maxBetAmount,
        money: finallyMoney,
        locked: odd.s === 4,
        available: odd.s === 2,
        justAddCar: false,
        betHandicap: odd.h,
        oddBetType: (ESport.EOddTypeMap as any)[ot] || ESport.EOddType.EUROPE,
      };
    } else {
      _orders[tag] = {
        ...order,
        change: 'none',
        available: false,
      };
    }
  });
  return _orders;
};

// 联赛列表接口映射到本地
export const mapLeagueStatistics = (LeagueStatistics: Array<TLeagueStatisticsItem>, sportId: number): Array<TYPES.TLeagueStatistic> => {
  const leagues: TYPES.TLeagueStatistic[] = [];
  _.each(LeagueStatistics, (i) => {
    const pushArr = (state: ESport.EMatchTypes) => {
      leagues.push({
        state,
        leagueId: i.lid,
        leagueName: i.ln,
        count: i.c,
        sportId,
        countGroup: {
          [ESport.EMatchTypes.IN_PLAY]: i.cip,
          [ESport.EMatchTypes.UPCOMING]: i.c - i.cip,
        },
        leagueIcon: i.lg,
        matchIds: {
          'in-play': i.ipmids,
          'upcoming': _.difference(i.mids, i.ipmids),
        },
        allMatchIds: i.mids,
        eids: i.mid1s,
        startTime: i.lst,
      });
    };
    if (i.cip > 0) {
      pushArr(ESport.EMatchTypes.IN_PLAY);
    }
    if (i.c - i.cip > 0) {
      pushArr(ESport.EMatchTypes.UPCOMING);
    }
  });
  return leagues;
};

// 赛事详情统计接口映射到本地
export const mapMatchDetailStatistics = (statistics: IMatchDetailApi): MatchDetailStatistics => {
  return {
    id: statistics.id,
    awayTeamHalfTimeScore: statistics.away_team_half_time_score,
    hometTeamHalfTimeScore: statistics.home_team_half_time_score,
    neutral: statistics.neutral,
    scores: statistics?.scores?.map((item) => ({
      matchId: item.match_id,
      team1: item.team1,
      team2: item.team2,
      type: item.type,
      updateTime: item.update_time,
    })),
    statics: statistics?.statics?.map((item) => ({
      period: item.period,
      team1: item.team1,
      team2: item.team2,
      typeCnName: item.type_cn_name,
      typeEnName: item.type_en_name,
      typeId: item.type_id,
    })),
  };
};

// 赛果列表接口映射到本地
export const mapGameResultStatistics = (GameResultStatistics: Array<TGameResultStatisticsItem>, sportId: number): Array<TYPES.TGameResultStatistic> => {
  const gameResults: TYPES.TGameResultStatistic[] = [];

  const blankArr = ['-', '-'];

  // X-X 转换到 [X, X]
  const strSpliter = (str: string, spliter: string = '-'): any[] => {
    return _.split(str, spliter);
  };

  // 0-0 转换到 ['-', '-']
  const strSplitWithEmpty = (str: string): string[] => {
    const splitRes = strSpliter(str);

    if (Number(splitRes[0]) === 0 && Number(splitRes[1]) === 0) return blankArr;
    return splitRes;
  };

  const splitCommon = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon => {
    return {
      ln: i.leagueName,
      llogo: i.leagueLogo,
      mid: i.matchId,
      leagueId: i.leagueId,
      mn: [
        {logo: i.hteamLogo, title: i.hteamName},
        {logo: i.ateamLogo, title: i.ateamName},
      ],
      bt: dayjs(i.beginTime).format('YYYY-MM-DD HH:mm'),
    };
  };

  /**
   *
   */
  const goalAdder = (firstGoal: string, secondGoal: string) => {
    return strSpliter(firstGoal).map((el, ind) => Number(el) + Number(strSpliter(secondGoal)[ind]));
  };

  /**
   *
   */
  const finalGoal = (i: TGameResultStatisticsItem): number[] => Number(strSpliter(i.finalGoal)[0]) === 0 && Number(strSpliter(i.finalGoal)[1]) === 0 ? strSpliter(i.ftGoal) : strSpliter(i.finalGoal);

  const splitFootball = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameFootballDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.Q1G]: strSpliter(i.q1Goal),
        [EGameResult.Q2G]: strSpliter(i.q2Goal),
        [EGameResult.FTG]: finalGoal(i),
        [EGameResult.OTG]: strSplitWithEmpty(i.otGoal),
        [EGameResult.PK]: strSplitWithEmpty(i.pkGoal),
        [EGameResult.H1RC]: strSpliter(i.h1Red),
        [EGameResult.H2RC]: strSpliter(i.h2Red),
        [EGameResult.FTRC]: strSpliter(i.ftRed),
        [EGameResult.H1YC]: strSpliter(i.h1Yellow),
        [EGameResult.H2YC]: strSpliter(i.h2Yellow),
        [EGameResult.FTYC]: strSpliter(i.ftYellow),
        [EGameResult.H1CK]: strSpliter(i.h1Corner),
        [EGameResult.H2CK]: strSpliter(i.h2Corner),
        [EGameResult.FTCK]: strSpliter(i.ftCorner),
      },
    };
  };

  const splitBasketball = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameBasketballDetail} => {
    if (i.periodType === 4) {
      return {
        ...splitCommon(i),
        details: {
          [EGameResult.Q1G]: strSpliter(i.q1Goal),
          [EGameResult.Q2G]: strSpliter(i.q2Goal),
          [EGameResult.FHG]: goalAdder(i.q1Goal, i.q2Goal),
          [EGameResult.Q3G]: strSpliter(i.q3Goal),
          [EGameResult.Q4G]: strSpliter(i.q4Goal),
          [EGameResult.SHG]: goalAdder(i.q3Goal, i.q4Goal),
          [EGameResult.OTG]: strSplitWithEmpty(i.otGoal),
          [EGameResult.FTG]: finalGoal(i),
        },
      };
    }
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.Q1G]: blankArr,
        [EGameResult.Q2G]: blankArr,
        [EGameResult.FHG]: strSpliter(i.q1Goal),
        [EGameResult.Q3G]: blankArr,
        [EGameResult.Q4G]: blankArr,
        [EGameResult.SHG]: strSpliter(i.q2Goal),
        [EGameResult.OTG]: strSplitWithEmpty(i.otGoal),
        [EGameResult.FTG]: finalGoal(i),
      },
    };
  };

  const splitTennis = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameTennisDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.Q1G]: strSpliter(i.q1Goal),
        [EGameResult.Q2G]: strSpliter(i.q2Goal),
        [EGameResult.Q3G]: strSpliter(i.q3Goal),
        [EGameResult.Q4G]: i.periodType === 3 ? strSplitWithEmpty(i.q4Goal) : strSpliter(i.q4Goal),
        [EGameResult.Q5G]: i.periodType === 3 ? strSplitWithEmpty(i.q5Goal) : strSpliter(i.q5Goal),
        [EGameResult.TGAMES]: strSpliter(i.finalGoal),
        [EGameResult.SET]: strSpliter(i.ftGoal),
      },
    };
  };

  const splitSnooker = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameSnookerDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.GSCORE]: strSpliter(i.finalGoal),
        [EGameResult.FG]: strSpliter(i.ftGoal),
      },
    };
  };

  const splitVolleyball = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameVolleyballDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.Q1G]: strSpliter(i.q1Goal),
        [EGameResult.Q2G]: strSpliter(i.q2Goal),
        [EGameResult.Q3G]: strSpliter(i.q3Goal),
        [EGameResult.Q4G]: strSplitWithEmpty(i.q4Goal),
        [EGameResult.Q5G]: strSplitWithEmpty(i.q5Goal),
        [EGameResult.FG]: strSpliter(i.finalGoal),
        [EGameResult.GSCORE]: strSpliter(i.ftGoal),
      },
    };
  };

  const splitRugby = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameRugbyDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.HTG]: strSpliter(i.q1Goal),
        [EGameResult.FTG]: strSpliter(i.ftGoal),
        [EGameResult.OTG]: strSplitWithEmpty(i.otGoal),
        [EGameResult.PSO]: strSpliter(i.finalGoal),
      },
    };
  };

  const splitHandball = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameHandballDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.HTG]: strSpliter(i.q1Goal),
        [EGameResult.FTG]: strSpliter(i.ftGoal),
        [EGameResult.OTG]: strSplitWithEmpty(i.otGoal),
        [EGameResult.PSO]: strSpliter(i.finalGoal),
      },
    };
  };

  const splitIceHockey = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameIceHockeyDetail} => {
    console.log(i.periodType);
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.Q1G]: strSpliter(i.q1Goal),
        [EGameResult.Q2G]: strSpliter(i.q2Goal),
        [EGameResult.Q3G]: i.periodType === 3 ? strSpliter(i.q3Goal) : strSplitWithEmpty(i.q3Goal),
        [EGameResult.OTG]: strSplitWithEmpty(i.otGoal),
        [EGameResult.PSO]: blankArr,
        [EGameResult.FG]: strSpliter(i.ftGoal),
      },
    };
  };

  const splitAmericanSoccer = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameAmericaSoccerDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.Q1G]: strSpliter(i.q1Goal),
        [EGameResult.Q2G]: strSpliter(i.q2Goal),
        [EGameResult.Q3G]: strSpliter(i.q3Goal),
        [EGameResult.Q4G]: strSpliter(i.q4Goal),
        [EGameResult.HTG]: goalAdder(i.q1Goal, i.q2Goal),
        [EGameResult.OTG]: strSplitWithEmpty(i.otGoal),
        [EGameResult.FG]: strSpliter(i.ftGoal),
      },
    };
  };

  const splitBaseBall = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameBaseballDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.Q1G]: strSpliter(i.q1Goal),
        [EGameResult.Q2G]: strSpliter(i.q2Goal),
        [EGameResult.Q3G]: strSpliter(i.q3Goal),
        [EGameResult.OTG]: strSplitWithEmpty(i.otGoal),
        [EGameResult.PSO]: blankArr,
        [EGameResult.FG]: strSpliter(i.ftGoal),
      },
    };
  };

  const splitBadminton = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameBadmintonDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.Q1G]: strSpliter(i.q1Goal),
        [EGameResult.Q2G]: strSpliter(i.q2Goal),
        [EGameResult.Q3G]: strSpliter(i.q3Goal),
        [EGameResult.FG]: strSpliter(i.ftGoal),
        [EGameResult.GSCORE]: strSpliter(i.finalGoal),
      },
    };
  };

  const splitPingPong = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGamePingPongDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.Q1G]: strSpliter(i.q1Goal),
        [EGameResult.Q2G]: strSpliter(i.q2Goal),
        [EGameResult.Q3G]: strSpliter(i.q3Goal),
        [EGameResult.Q4G]: i.periodType === 3 ? strSplitWithEmpty(i.q4Goal) : strSpliter(i.q4Goal),
        [EGameResult.Q5G]: i.periodType === 3 ? strSplitWithEmpty(i.q5Goal) : strSpliter(i.q5Goal),
        [EGameResult.Q6G]: i.periodType !== 7 ? strSplitWithEmpty(i.q6Goal) : strSpliter(i.q6Goal),
        [EGameResult.Q7G]: i.periodType !== 7 ? strSplitWithEmpty(i.q7Goal) : strSpliter(i.q7Goal),
        [EGameResult.FG]: strSpliter(i.finalGoal),
        [EGameResult.GSCORE]: strSpliter(i.ftGoal),
      },
    };
  };

  const splitBeachVolleyBall = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameBeachVolleyBallDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.Q1G]: strSpliter(i.q1Goal),
        [EGameResult.Q2G]: strSpliter(i.q2Goal),
        [EGameResult.Q3G]: strSpliter(i.q3Goal),
        [EGameResult.Q4G]: strSplitWithEmpty(i.q4Goal),
        [EGameResult.Q5G]: strSplitWithEmpty(i.q5Goal),
        [EGameResult.FG]: strSpliter(i.finalGoal),
        [EGameResult.GSCORE]: strSpliter(i.ftGoal),
      },
    };
  };

  const splitHokey = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TGameHockeyDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.Q1G]: strSpliter(i.q1Goal),
        [EGameResult.Q2G]: strSpliter(i.q2Goal),
        [EGameResult.Q3G]: strSpliter(i.q3Goal),
        [EGameResult.Q4G]: strSpliter(i.q4Goal),
        [EGameResult.HTG]: goalAdder(i.q1Goal, i.q2Goal),
        [EGameResult.OTG]: strSpliter(i.otGoal),
        [EGameResult.FTG]: strSpliter(i.ftGoal),
        [EGameResult.PSO]: strSpliter(i.finalGoal),
      },
    };
  };

  const splitOtherGame = (i: TGameResultStatisticsItem): TYPES.TGameResultCommon & {details: TYPES.TOtherGameDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.FG]: strSpliter(i.ftGoal),
      },
    };
  };

  _.each(GameResultStatistics, (i) => {
    const pushArr = () => {
      switch (sportId) {
        case 1:
          gameResults.push(splitFootball(i));
          break;
        case 2:
          gameResults.push(splitBasketball(i));
          break;
        case 3:
          gameResults.push(splitTennis(i));
          break;
        case 5:
          gameResults.push(splitSnooker(i));
          break;
        case 6:
          gameResults.push(splitVolleyball(i));
          break;
        case 9:
          gameResults.push(splitRugby(i));
          break;
        case 11:
          gameResults.push(splitHandball(i));
          break;
        case 12:
          gameResults.push(splitIceHockey(i));
          break;
        case 16:
          gameResults.push(splitAmericanSoccer(i));
          break;
        case 18:
          gameResults.push(splitBaseBall(i));
          break;
        case 19:
          gameResults.push(splitBadminton(i));
          break;
        case 23:
          gameResults.push(splitPingPong(i));
          break;
        case 26:
          gameResults.push(splitBeachVolleyBall(i));
          break;
        case 28:
          gameResults.push(splitHokey(i));
          break;

        default:
          gameResults.push(splitOtherGame(i));
          break;
      };
    };
    pushArr();
  });

  return gameResults;
};
