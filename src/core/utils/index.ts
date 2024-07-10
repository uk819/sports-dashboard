import {Detail} from '@core/apis/models/dashboard/get-betting-record';
import {TBetItemLine} from '@core/apis/models/sport/get-match-list';
import {EHandicapType, EOddType, ESportType, HANDICAP_TYPE_MAP, useOtherScoreIds} from '@core/constants/enum/sport';
import {TMatch, TOrder, SubCtid, TextMsg} from '@core/services/Table';
import dayjs from 'dayjs';
export enum TCtidTypes {
  goalScore = 0,
  cornerScore = 1,
  punishScore = 2,
  homeGoalScore = 12,
  awayGoalScore = 13,
  minutes15Score = 16,
  minutes15To30Score = 17
}
// 通过玩法 code 获取玩法名称
export const getPlayNameByKc = ({code, name, ctid, sportId}: {code: string, name?: string, ctid?: number, sportId?: number}) => {
  if (ctid !== undefined && name !== undefined && ctid !== 0) return name;
  switch (code) {
    case 'FT_OU':
      switch (sportId) {
        case 5:
          return '总局数';
        default:
          return '全场大小';
      };
    case 'HT_OU':
      return '半场大小';
    case 'FT_OE':
    case 'Total_Match_Legs_OE':
      return '全场单双';
    case 'FT_HF':
      return '半场 / 全场';
    case 'HT_OE':
      return '单双-上半场';
    case 'FT_AH':
      switch (sportId) {
        case 6:
          return '全场让盘';
        case 23:
          return '全场让分';
        case 5:
        case 19:
          return '全场让局';
        default:
          return '全场让球';
      };
    case 'HT_AH':
      return '半场让球';
    case 'FT_1X2':
    case 'FT_ML':
      return '全场独赢';
    case 'HT_1X2':
    case 'HT_ML':
      return '半场独赢';
    case 'FT_CS':
      return '全场波胆';
    case 'HT_CS':
      return '波胆-上半场';
    case 'BothTeamsToScore':
      return '双方进球';
    case 'FTS_AH':
      return '全场让局';
    case 'FTS_OU':
      return '总局数';
    case 'FT_XX':
      return '全场总分';
    case 'Winner_1X2':
      return '独赢1X2';
    case 'Winner':
      return '全场独赢';
    case 'PT_AH':
      return '让分';
    case 'Most_180':
      return '最高180分';
    case 'PT_OU':
      switch (sportId) {
        case 19:
          return '全场总分';
        default:
          return '总分大小';
      }
    default:
      return name;
  }
};
// getBetPalyName(data.details[0].kindsCode)
// 通过玩法 code 获取主客队名称
export const getBetPalyName = (code: string) => {
  switch (code) {
    case 'FT_AH':
    case 'HT_AH':
    case 'HT_OU':
    case 'FT_OU':
      return 'betHomeOrAway';
    case 'HT_1X2':
    case 'FT_1X2':
    case 'HT_CS':
    case 'FT_CS':
    case 'HT_OE':
    case 'FT_OE':
      return 'betHandicap';
    default:
      return 'betHomeOrAway';
  }
};

// 通过 体育类型 id 获取 玩法列表 （显示在赛事列表）
export const getPlayListBySid = (sid: number) => {
  switch (sid) {
    case 1:
      return ['FT_1X2', 'FT_AH', 'FT_OU', 'HT_1X2', 'HT_AH', 'HT_OU'];
    case 2:
      return ['FT_ML', 'FT_AH', 'FT_OU', 'HT_ML', 'HT_AH', 'HT_OU'];
    case 3:
      return ['FT_ML', 'FTS_AH', 'FTS_OU'];
    case 5:
      return ['FT_ML', 'FT_AH', 'FT_OU'];
    // 排球数据 总分code暂不清楚等有数据后对接
    case 6:
      return ['FT_ML', 'FT_AH', 'FT_XX'];
    case 8:
      return ['Winner', 'Total_Match_Legs_OE', 'Most_180'];
    case 10:
      return ['FT_ML', 'FT_AH', 'FT_OU'];
    case 11:
      return ['FT_AH', 'FT_OU', 'FT_OE'];
    case 12:
      return ['FT_1X2', 'FT_AH', 'FT_OU', 'FT_OE'];
    case 13:
      return ['Winner_1X2', 'Total_Match_Legs_OE'];
    case 16:
      return ['FT_ML', 'FT_AH', 'FT_OU', 'HT_ML', 'HT_AH', 'HT_OU'];
    case 18:
      return ['FT_ML', 'FT_AH', 'FT_OU', 'FT_OE'];
    case 19:
      return ['FT_ML', 'FT_AH', 'PT_AH', 'PT_OU'];
    case 23:
      return ['FT_ML', 'FT_AH', 'PT_OU'];
    case 276:
    case 277:
    case 278:
    case 279:
      return ['win_final'];
    default:
      return ['FT_1X2', 'FT_AH', 'FT_OU', 'HT_1X2', 'HT_AH', 'HT_OU'];
  }
};

// 通过 体育类型 id 获取 玩法列表 （显示在赛事列表内部下方） CorrectScore是波胆
export const getPlayListBySidSub = (ctid: number | string) => {
  switch (ctid) {
    case 1: // 角球
      return ['FT_1X2', 'FT_AH', 'FT_OU', 'HT_1X2', 'HT_AH', 'HT_OU'];
    case 2: // 罚牌
      return ['FT_1X2', 'FT_AH', 'FT_OU', 'HT_1X2', 'HT_AH', 'HT_OU'];
    case 0: // 波胆
      return ['FT_CS', 'HT_CS'];
    default:
      return ['FT_1X2', 'FT_AH', 'FT_OU', 'HT_1X2', 'HT_AH', 'HT_OU'];
  }
};

// 判断数组里面是否有值
export const hasArrayValue = (arr:any[]) => arr.some((item)=>!!item);

// 底部玩法展示 角球 罚牌 波胆
export const filterDownPlay = (match: TMatch, subCtid: SubCtid) => {
  // 查询相应的玩法有没有数据
  const _hasJiaoqiuData=hasArrayValue(transforMarkets(match, getPlayListBySidSub(subCtid['jiaoqiu']), subCtid['jiaoqiu']));
  const _hasBodanData=hasArrayValue(transforMarkets(match, getPlayListBySidSub(subCtid['bodan']), subCtid['bodan']));
  const _hasFapaiData=hasArrayValue(transforMarkets(match, getPlayListBySidSub(subCtid['fapai']), subCtid['fapai']));
  // const _playSort = match.playSort;
  const _arr = [
    {name: '角球', type: 'jiaoqiu', hasData: _hasJiaoqiuData, ctid: subCtid['jiaoqiu']},
    {name: '波胆', type: 'bodan', hasData: _hasBodanData, ctid: subCtid['bodan']},
    {name: '罚牌', type: 'fapai', hasData: _hasFapaiData, ctid: subCtid['fapai']},
  ];

  return _arr.filter((item)=> item.hasData);
  // if (_playSort<24) return _arr.filter((item)=> item.hasData);
  // if (_playSort>=24&&_playSort<=50) return _arr.slice(0, 2).filter((item)=> item.hasData);
  // if (_playSort>50) return _arr.slice(1, 2).filter((item)=> item.hasData);
  // return [];
};

export const getMobilePlayListBySid = (sid: number) => {
  switch (sid) {
    case 1:
      return ['FT_1X2', 'FT_AH', 'FT_OU', 'HT_1X2', 'HT_AH', 'HT_OU'];
    case 2:
      return ['FT_ML', 'FT_AH', 'FT_OU'];
    case 3:
      return ['FT_ML', 'FTS_AH', 'FTS_OU'];
    case 5:
      return ['FT_ML', 'FT_AH', 'FT_OU'];
    case 6:
      return ['FT_ML', 'FT_AH', 'FT_XX'];
    case 8:
      return ['Winner', 'FT_AH', 'FT_OU'];
    case 10:
      return ['FT_ML', 'FT_AH', 'FT_OU'];
    case 11:
      return ['FT_AH', 'FT_OU', 'FT_OE'];
    case 12:
      return ['FT_1X2', 'FT_AH', 'FT_OU'];
    case 13:
      return ['Winner_1X2', 'FT_ML', 'FT_AH'];
    case 16:
      return ['FT_ML', 'FT_AH', 'FT_OU'];
    case 19:
      return ['FT_ML', 'PT_AH', 'PT_OU'];
    case 23:
      return ['FT_ML', 'FT_AH', 'PT_OU'];
    case 276:
    case 277:
    case 278:
    case 279:
      return ['win_final'];
    default:
      return ['FT_1X2', 'FT_AH', 'FT_OU'];
  }
};

// 通过 体育类型 id 获取 玩法列表 （显示在赛事列表）新手版本
export const getNewbiePlayListBySid = (sid: number, round: string) => {
  switch (sid) {
    case 1:
      return ['FT_1X2'];
    case 2:
    case 3:
    case 5:
    case 6:
    case 10:
    case 13:
    case 16:
    case 19:
    case 23:
      return ['FT_ML'];
    case 8:
      return ['Winner'];
    case 276:
    case 277:
    case 278:
    case 279:
      if (round?.toUpperCase() === 'BO2') {
        return ['wdl_final'];
      }
      return ['win_final'];
    default:
      return ['FT_1X2'];
  }
};

// 转换 投注项名称
export const getNameByhoa = (name: string, kc?: string, TOrder?: TOrder, inMainList = false) => {
  if (kc === 'FT_HF') {
    const map: any = {
      'H': TOrder.teams.home.name,
      'A': TOrder.teams.away.name,
      'D': '和',
    };
    return name.split('').map((item) => map[item]).join(' / ');
  } else if (kc && kc.endsWith('_TG')) {
    return name.includes('UP') ? name.replace('UP', '及以上') : name.split('').join('~');
  } else if (kc === 'FT_TTS') {
    if (name?.toUpperCase() === 'FIRST') return '无进球';
  }
  if (inMainList && (name === TOrder.teams.home.name || name === TOrder.teams.away.name)) {
    if (name === TOrder.teams.home.name) return '主';
    if (name === TOrder.teams.away.name) return '客';
  }
  switch (name?.toUpperCase()) {
    case 'HOME':
      return '主';
    case 'AWAY':
      return '客';
    case 'DRAW':
      return '平局';
    case 'ODD':
      return '单';
    case 'EVEN':
      return '双';
    case 'OVER':
      return '大';
    case 'UNDER':
      return '小';
    case 'FIRST':
      return '首个进球';
    case 'LAST':
      return '最后进球';
    default:
      return name;
  }
};

export const transforMarkets = (match: TMatch, betTypeList: string[], ctidNum=0) => {
  if (match.sportId > 33) return transforEsportsMarkets(match, betTypeList);
  const obj = match.playTypes.reduce((o: any, b) => {
    if (b.ctid === ctidNum && !o[b.code]) {
      o[b.code] = b;
    };
    return o;
  }, {});
  return betTypeList.map((betType) => obj[betType]);
};


export const transforEsportsMarkets = (match: TMatch, betTypeList: string[]) => {
  const obj = match.playTypes.reduce((o: any, b) => {
    if (!o[`${b.code.split('_')[0]}_${b.playGroupIds[0]}`]) o[`${b.code.split('_')[0]}_${b.playGroupIds[0]}`] = b;
    return o;
  }, {});
  return betTypeList.map((betType) => obj[betType]);
};

export const mobileTransforMarkets = (sportId: number, playTypes: TMatch['playTypes'], betTypeList: string[], ctid: number = 0) => {
  if (sportId > 33) return mobileTransforEsportsMarkets(playTypes, betTypeList);
  const obj = playTypes.reduce((o: any, b) => {
    if (b.ctid === ctid) {
      o[b.code] = b;
    };
    return o;
  }, {});
  return betTypeList.map((betType) => obj[betType]);
};

export const mobileTransforEsportsMarkets = (playTypes: TMatch['playTypes'], betTypeList: string[]) => {
  const obj = playTypes.reduce((o: any, b) => {
    o[`${b.code.split('_')[0]}_${b.playGroupIds[0]}`] = b;
    return o;
  }, {});
  return betTypeList.map((betType) => obj[betType]);
};

// 投注项通过权重排序
export const getWeightsByBetName = (name: string) => {
  if (name === 'Home') return 0;
  if (name === 'Away') return 1;
  return 2;
};

// 波胆数据格式转换
export const transferBoDan = (list: TOrder[]) => {
  const listData: TOrder[] = [];
  const list1: TOrder[] = [];
  const list2: TOrder[] = [];
  const list3: TOrder[] = [];
  let other: TOrder = null;
  list.forEach((item) => {
    const temp = {...item};
    if (temp.name === 'AOS') {
      temp.name = '其他';
      other = temp;
    } else {
      const h = temp.name.match(/H(\S*)A/)[1];
      const a = temp.name.split('A')[1];
      temp.name = `${h}-${a}`;
      if (/[0-9]/.test(h) && /[0-9]/.test(a)) {
        if (h > a) list1.push(temp);
        if (h === a) list2.push(temp);
        if (h < a) list3.push(temp);
      }
    }
  });
  list1.sort(BoDanSort);
  list2.sort(BoDanSort);
  list3.sort(BoDanSort);
  if (other) {
    list2.push(other);
  }
  const len = Math.max(list1.length, list2.length, list3.length);
  for (let i = 0; i < len; i++) {
    listData[0 + (i * 3)] = list1[i] || null;
    listData[1 + (i * 3)] = list2[i] || null;
    listData[2 + (i * 3)] = list3[i] || null;
  }
  return listData;
};

const BoDanSort = (a: TOrder, b: TOrder) => {
  const [aFirst, aSecond] = a.name.split('-');
  const [bFirst, bSecond] = b.name.split('-');
  if (aFirst !== bFirst) {
    return parseInt(aFirst) - parseInt(bFirst);
  }
  return parseInt(aSecond) - parseInt(bSecond);
};

// 净胜球排序
export const JsqSort = (list: TBetItemLine[]) => {
  const endIndex = Math.floor(list.length / 2);
  let arr: TBetItemLine[] = [];
  for (let i = 0; i < endIndex; i++) {
    const h = list.find((item) => item.h === `H${i}`);
    if (h) {
      arr.push(h);
      arr.push(list.find((item) => item.h === `A${i}`));
    } else {
      arr = arr.concat(list.slice(-2));
    }
  }
  if (list.length % 2 !== 0) arr.push(list[list.length - 1]);
  return arr;
};

// 通过 period 获取当前赛事状态名称
export const getMatchStatusByPeriod = _.memoize((period: string) => {
  if (/^\d+$/.test(period)) {
    return `第${period}局`;
  }
  switch (period) {
    case 's1':
      return '第1局';
    case 's2':
      return '第2局';
    case 's3':
      return '第3局';
    case 's4':
      return '第4局';
    case 's5':
      return '第5局';
  }
  switch (period?.toUpperCase()) {
    case '1H':
      return '上半场';
    case 'HT':
      return '中场休息';
    case '2H':
      return '下半场';
    case 'FT':
      return '比赛结束';
    case 'Q1':
      return '第1节';
    case 'Q2':
      return '第2节';
    case 'Q3':
      return '第3节';
    case 'Q4':
      return '第4节';
    case 'S1':
      return '第1盘';
    case 'S2':
      return '第2盘';
    case 'S3':
      return '第3盘';
    case 'S4':
      return '第4盘';
    case 'S5':
      return '第5盘';
    case 'OT':
      return '加时赛';
    case 'I1':
      return '第1局';
    case 'I2':
      return '第2局';
    case 'I3':
      return '第3局';
    case 'OT1':
      return '加时赛-上半场';
    case 'OT2':
      return '加时赛-下半场';
    case 'OHT':
      return '加时赛-中场休息';
    case '':
    case null:
    case undefined:
      return '未开赛';
    default:
      return '比赛中';
  }
});
export const getCurrentOddTypeText=(currentOddType: EOddType, sportId: number)=>{
  if (sportId > 33) return '';
  return `[${HANDICAP_TYPE_MAP[currentOddType]}]`;
};
export function arraysHaveSameElements<T>(array1: T[], array2: T[]): boolean {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  if (set1.size !== set2.size) {
    return false; // 数组长度不同，元素肯定不一样
  }

  for (const element of set1) {
    if (!set2.has(element)) {
      return false; // 数组元素不一样
    }
  }

  return true; // 数组包含相同的元素
}
// 获取投注球队或其他类型
export const getBetGameTypes =(info:Detail)=>{
  const t = info.betHandicap;
  if (['FT_CS', 'HT_CS'].includes(info.kindsCode)) {
    if (t ==='AOS') return '其他';
    return t.charAt(1) +'-' + t.charAt(3);
  };
  switch (info.betHandicap) {
    case 'Home':
      return info.homeTeamNameCn;
    case 'Away':
      return info.awayTeamNameCn;
    case 'Draw':
      return getNameByhoa(info.betHandicap);
    case 'Odd':
      return getNameByhoa(info.betHandicap);
    case 'Even':
      return getNameByhoa(info.betHandicap);
    case 'Over':
      return getNameByhoa(info.betHandicap);
    case 'Under':
      return getNameByhoa(info.betHandicap);
    default:
      return info.betHandicap;
  }
};
// 获取投注球队或其他玩法---------适用于已投注接口数据返回
export const getBetTeamType = (info:Detail)=>{
  const {betHomeOrAway, betHandicap, kindsCode} = info;
  const createOrderTmp = {
    teams: {
      home: {
        name: info.homeTeamNameCn,
      },
      away: {
        name: info.awayTeamNameCn,
      },
    },
  };
  return getOrderBetTypeAtBetting({betName: info.betN, betTeam: betHomeOrAway ?betHomeOrAway : betHandicap, orderName: betHandicap, ...createOrderTmp, kc: kindsCode} as any);
};

// 获取注单玩法具体详情-----------适用于下注时本地数据展示
type TeamType = 'home' | 'away' | undefined;
export const getOrderBetTypeAtBetting = (order:TOrder)=>{
  const {betTeam, orderName, teams, kc} = order;
  const lname = betTeam.toLowerCase();
  if (['FT_TTS'].includes(order.kc)) {
    if (betTeam ==='Draw') return '无进球';
    return orderName==='Last'? `最后进球/${order.betName}`:`首个进球/${order.betName}`;
  }
  if (order.betName) {
    return order.betName;
  }
  if (kc && kc.endsWith('_TG')) {
    return getNameByhoa(betTeam, kc, order);
  }
  if (['FT_CS', 'HT_CS'].includes(order.kc)) {
    if (orderName ==='AOS') return '其他';
    const [home, away]= assertHomeAwayScore(orderName);
    return home +'-' + away;
  }

  if (kc === 'FT_HF') {
    return getNameByhoa(betTeam, kc, order);
  }
  if (betTeam === orderName && ['home', 'away'].includes(lname)) {
    return teams[lname as TeamType].name;
  }
  if (betTeam === orderName && !['home', 'away'].includes(lname)) {
    return getNameByhoa(betTeam);
  }
  if (betTeam !== orderName && ['over', 'under'].includes(lname)) {
    return getNameByhoa(betTeam);
  }
  if (betTeam !== orderName && ['home', 'away'].includes(lname)) {
    return teams[lname as TeamType].name;
  }
  return orderName;
};

// 是否滚球, 0:不是, 1:是
export const isPlayingMatch = (n: number, kindsCode: string)=>{
  if (isChampion(kindsCode)) return '冠军盘';
  return n === 1 ?'滚球' : '早盘';
};

// 获取注单玩法中具体数值或直接返回空-适用于下注时本地数据展示
export const getBetHandiCapAtBetting = (name: string, sprotId?: number)=>{
  // 电子竞技-过滤
  if (sprotId && sprotId > 33) {
    return '';
  }
  return name;
};

// 判断第二列是否显示
export const isVisiableSecondText = (betHandicap: string, betN: string, kc: string)=>{
  if (betN) return false;
  if (kc && kc.endsWith('_TG')) return false;
  // 只有数字才显示
  const temp = Number(betHandicap.split('/')[0]);
  if (!isNaN(temp) && isFinite(temp)) return true;
  return false;
};
export const assertHomeAwayScore = (scoreString:string) => {
  if (!scoreString) return '';
  const score = scoreString.replace('A', ' ').replace('H', '').split(' ');
  if (!score) return '';
  return score;
};
export const displayBetItem = (betItem:string, sprotId?: ESportType) => {
  if (sprotId > 276) return '';
  return betItem;
};
export const displayHomeAwayScore = (scoreString:string, sprotId?: ESportType) => {
  if (sprotId > 33) return '';
  if (scoreString ==='HA') return '';
  if (sprotId === ESportType.TENNIS || sprotId === ESportType.VOLLEYBALL) return '';
  const [home, away] = assertHomeAwayScore(scoreString);
  return `(${home + '-' + away})`;
};

export const getTeamScoreByCtipType = (order: TOrder, ctipType: TCtidTypes, gameType?: ESportType) => {
  if (!order.isRunning) return '';
  if (order.sportId > 33) return '';
  if (gameType === ESportType.TENNIS || gameType === ESportType.VOLLEYBALL) return '';
  switch (ctipType) {
    case TCtidTypes.goalScore:
      return `(${order.score.home}-${order.score.away})`;
    case TCtidTypes.cornerScore:
      return `(${order.score.homeCorner}-${order.score.awayCorner})`;
    default:
      break;
  }
  return ``;
};
/**
 * type: 玩法种类
 * sportId: 游戏种类Id
 * currentOddType: 当前选择是亚盘或欧盘
 * 1. 如果是电竞,则默认都是欧盘
 * 2. 如果体育项目, 个别玩法只有欧盘
 * 3. 如果当前玩法支持 欧盘及亚盘, 那就选择当前盘口类型
 */
export const chooseEuropeOrAsia = (type: EOddType, sportId:number, currentOddType: EOddType) => {
  // 大于33是电竞
  if (sportId > 33) return EOddType.EUROPE;
  if (type !== EOddType.EUROPE) {
    return currentOddType;
  };
  return EOddType.EUROPE;
};

export const chooseEuropeOrAsiaText = (type: EOddType | EHandicapType, sportId: number) => {
  // 大于33是电竞
  if (sportId > 33) return '';
  return `[${HANDICAP_TYPE_MAP[type]}]`;
};

export const isESports = () => {
  const urlParams = new URLSearchParams(new URL(window.location.href).search);
  return process.env.GAME_TYPE === 'esports' || window.location.hash.endsWith('/esports') || urlParams.get('esports') === '1';
};

export const isMobile = () => {
  return process.env.CLIENT_MODE === 'mobile';
};

export const getAHScore = (sportId: number, kc: string, matchDetail: TMatch) => {
  if (useOtherScoreIds.includes(sportId)) {
    return /[0-9]/.test(kc.slice(1, 2)) ? `${matchDetail.score.otherScore?.periods ? matchDetail.score.otherScore?.periods.slice(-1)[0]?.h ?? 0 : 0} - ${matchDetail.score.otherScore?.periods ? matchDetail.score.otherScore?.periods.slice(-1)[0]?.a ?? 0 : 0}` : `${matchDetail.score.otherScore?.periods?.reduce((a, b) => a + b.h, 0) ?? 0} - ${matchDetail.score.otherScore?.periods?.reduce((a, b) => a + b.a, 0) ?? 0}`;
  }
  return `${matchDetail.score.home ?? ''} - ${matchDetail.score.away ?? ''}`;
};

export const transrRealTimeResult = (matchs: TextMsg[])=>{
  const reslut:Array<any> = [];
  if (_.isEmpty(matchs)) return reslut;
  matchs.map((item)=>{
    const {createTime, sportID, team, typeID, typeName, phase, score, statusCode, statusName, timePlayed, timeRemain, id} = item;
    reslut.push({
      createTime: dayjs(createTime, 'YYYY-MM-DD HH:mm:ss'),
      team,
      id,
      typeName,
      phase,
      score: ['9'].includes(typeID?.toString()) ? score : null,
      statusCode,
      statusName,
      cnText: phase,
      eventTime: transrTime(sportID, timePlayed, timeRemain),
      eventId: typeID,
    });
  });
  return reslut;
};

export const transrTime = (sportId: string, timePlayed: number, timeRemain: number)=>{
  switch (sportId) {
    case '1':
      return ((timePlayed/60).toFixed(0) || '01') + '\'';
    case '2':
    default:
      return (timeRemain/60).toFixed(0) + '\'' + (timeRemain%60 < 10 ? '0' : '') + timeRemain%60 + '\"';
  }
};

export const isChampion = (kc: string) => {
  return kc?.toUpperCase().includes('outright'.toUpperCase());
};
