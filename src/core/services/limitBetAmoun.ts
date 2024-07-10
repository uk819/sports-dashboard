import {ESportType} from '@core/constants/enum/sport';
interface ELIMIT_AMOUNT_DATA {
  [key: string]: {
    [key: string]:{
      [key: string]:{
        [key: string]: number
      }
    }
  };
}
const enum GAME_TYPE {
  RUNING = 1,
  UNRUNING
}
const FOOTBALL = [
  {l: 1, range: [1, 10]},
  {l: 2, range: [11, 20]},
  {l: 3, range: [21, 30]},
  {l: 4, range: [31, 40]},
  {l: 5, range: [41, 50]},
  {l: 6, range: [51, 60]},
  {l: 7, range: [61, 70]},
  {l: 8, range: [71, 80]},
  {l: 9, range: [81, 100]},
  {l: 10, range: [101, 110]},
  {l: 11, range: [111, 120]},
  {l: 12, range: [121, 140]},
  {l: 13, range: [141, 150]},
  {l: 14, range: [151, 170]},
  {l: 15, range: [171, 200]},
  {l: 16, range: [201, 1000]},
];
const BASKETBALL = [
  {l: 1, range: [1, 10]},
  {l: 2, range: [11, 20]},
  {l: 3, range: [21, 30]},
  {l: 4, range: [31, 40]},
  {l: 5, range: [41, 50]},
  {l: 6, range: [51, 60]},
  {l: 7, range: [61, 70]},
  {l: 8, range: [71, 80]},
  {l: 9, range: [81, 100]},
  {l: 10, range: [101, 110]},
  {l: 11, range: [111, 120]},
  {l: 12, range: [121, 140]},
  {l: 13, range: [141, 150]},
  {l: 14, range: [151, 170]},
  {l: 15, range: [171, 200]},
  {l: 16, range: [201, 1000]},
];
const DATA: ELIMIT_AMOUNT_DATA = {
  [ESportType.FOOTBALL.toString()]: {
    [GAME_TYPE.RUNING]: {
      // 让球
      'FT_AH,HT_AH': {
        '1': 60000,
        '2': 50000,
        '3': 40000,
        '4': 30000,
        '5': 20000,
        '6': 10000,
        '7': 5000,
        '8': 5000,
        '9': 5000,
        '10': 5000,
        '11': 5000,
        '12': 5000,
        '13': 5000,
        '14': 5000,
        '15': 5000,
        '16': 5000,
        'spare': 5000,
      },
      // 大小
      'FT_OU,HT_OU': {
        '1': 60000,
        '2': 50000,
        '3': 40000,
        '4': 30000,
        '5': 20000,
        '6': 10000,
        '7': 5000,
        '8': 5000,
        '9': 5000,
        '10': 5000,
        '11': 5000,
        '12': 5000,
        '13': 5000,
        '14': 5000,
        '15': 5000,
        '16': 5000,
        'spare': 5000,
      },
      // 独赢
      'FT_1X2,HT_1X2': {
        '1': 60000,
        '2': 50000,
        '3': 40000,
        '4': 30000,
        '5': 20000,
        '6': 10000,
        '7': 5000,
        '8': 5000,
        '9': 5000,
        '10': 5000,
        '11': 5000,
        '12': 5000,
        '13': 5000,
        '14': 5000,
        '15': 5000,
        '16': 5000,
        'spare': 5000,
      },
    },
    [GAME_TYPE.UNRUNING]: {
      // 让球
      'FT_AH,HT_AH': {
        '1': 60000,
        '2': 50000,
        '3': 40000,
        '4': 30000,
        '5': 20000,
        '6': 10000,
        '7': 5000,
        '8': 5000,
        '9': 5000,
        '10': 5000,
        '11': 5000,
        '12': 5000,
        '13': 5000,
        '14': 5000,
        '15': 5000,
        '16': 5000,
        'spare': 5000,
      },
      // 大小
      'FT_OU,HT_OU': {
        '1': 60000,
        '2': 50000,
        '3': 40000,
        '4': 30000,
        '5': 20000,
        '6': 10000,
        '7': 5000,
        '8': 5000,
        '9': 5000,
        '10': 5000,
        '11': 5000,
        '12': 5000,
        '13': 5000,
        '14': 5000,
        '15': 5000,
        '16': 5000,
        'spare': 5000,
      },
      // 独赢
      'FT_1X2,HT_1X2': {
        '1': 60000,
        '2': 50000,
        '3': 40000,
        '4': 30000,
        '5': 20000,
        '6': 10000,
        '7': 5000,
        '8': 5000,
        '9': 5000,
        '10': 5000,
        '11': 5000,
        '12': 5000,
        '13': 5000,
        '14': 5000,
        '15': 5000,
        '16': 5000,
        'spare': 5000,
      },
    },
  },
  [ESportType.BASKETBALL.toString()]: {
    [GAME_TYPE.RUNING]: {
      // 让球
      'FT_AH,HT_AH,Q1_AH,Q2_AH,Q3_AH,Q4_AH': {
        '1': 60000,
        '2': 40000,
        '3': 30000,
        '4': 20000,
        '5': 15000,
        '6': 10000,
        '7': 6000,
        '8': 4000,
        '9': 3000,
        '10': 2500,
        '11': 2500,
        '12': 1500,
        '13': 1500,
        '14': 500,
        '15': 500,
        '16': 500,
        'spare': 500,
      },
      // 大小
      'FT_OU,HT_OU,Q1_OU,Q2_OU,Q3_OU,Q4_OU': {
        '1': 60000,
        '2': 40000,
        '3': 30000,
        '4': 20000,
        '5': 15000,
        '6': 10000,
        '7': 6000,
        '8': 4000,
        '9': 3000,
        '10': 2500,
        '11': 2500,
        '12': 1500,
        '13': 1500,
        '14': 500,
        '15': 500,
        '16': 500,
        'spare': 500,
      },
      // 独赢
      'FT_ML,HT_ML,Q1_ML,Q2_ML,Q3_ML,Q4_ML': {
        '1': 60000,
        '2': 40000,
        '3': 30000,
        '4': 20000,
        '5': 15000,
        '6': 10000,
        '7': 6000,
        '8': 4000,
        '9': 3000,
        '10': 2500,
        '11': 2500,
        '12': 1500,
        '13': 1500,
        '14': 500,
        '15': 500,
        '16': 500,
        'spare': 500,
      },
    },
    [GAME_TYPE.UNRUNING]: {
      // 让球
      'FT_AH,HT_AH,Q1_AH,Q2_AH,Q3_AH,Q4_AH': {
        '1': 60000,
        '2': 40000,
        '3': 30000,
        '4': 20000,
        '5': 15000,
        '6': 10000,
        '7': 6000,
        '8': 4000,
        '9': 3000,
        '10': 2500,
        '11': 2500,
        '12': 1500,
        '13': 1500,
        '14': 500,
        '15': 500,
        '16': 500,
        'spare': 500,
      },
      // 大小
      'FT_OU,HT_OU,Q1_OU,Q2_OU,Q3_OU,Q4_OU': {
        '1': 60000,
        '2': 40000,
        '3': 30000,
        '4': 20000,
        '5': 15000,
        '6': 10000,
        '7': 6000,
        '8': 4000,
        '9': 3000,
        '10': 2500,
        '11': 2500,
        '12': 1500,
        '13': 1500,
        '14': 500,
        '15': 500,
        '16': 500,
        'spare': 500,
      },
      // 独赢
      'FT_ML,HT_ML,Q1_ML,Q2_ML,Q3_ML,Q4_ML': {
        '1': 60000,
        '2': 40000,
        '3': 30000,
        '4': 20000,
        '5': 15000,
        '6': 10000,
        '7': 6000,
        '8': 4000,
        '9': 3000,
        '10': 2500,
        '11': 2500,
        '12': 1500,
        '13': 1500,
        '14': 500,
        '15': 500,
        '16': 500,
        'spare': 500,
      },
    },
  },
};
const sports = {
  [ESportType.FOOTBALL.toString()]: FOOTBALL,
  [ESportType.BASKETBALL.toString()]: BASKETBALL,
};
const transfLeagueToLevel = (lv: number, sprotId: ESportType): any =>{
  let result = undefined;
  const sport = sports[sprotId];
  if (!sport) return result;
  sport.find((item)=>{
    if ( lv>= item.range[0] && lv <=item.range[1]) {
      result = item.l;
      return;
    };
  });
  if (!result) result = 'spare';
  return result;
};
export const getMaxLimitAmount = (lv: number, sprotId: ESportType, isRunning: GAME_TYPE, playCode: string) => {
  const l = transfLeagueToLevel(lv, sprotId);
  if (!l) return anotherResult(sprotId, lv);
  const code = _.find(Object.keys(DATA[sprotId][isRunning]), (item) => item.includes(playCode));
  if (!code) return anotherResult(sprotId, lv);
  if (!DATA[sprotId][isRunning][code]) return anotherResult(sprotId, lv);
  if (!DATA[sprotId][isRunning][code][l]) return DATA[sprotId][isRunning][code]['spare'];
  return DATA[sprotId][isRunning][code][l];
};
const anotherResult = (sprotId: number, lv: number) => {
  if (sprotId > 33) {
    return lv <= 5 ? 10000 : 3000;
  }
  return lv <= 60 ? 10000 : 3000;
};
