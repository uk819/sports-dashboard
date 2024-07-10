import * as tags from '@views/kmg/desktop/pages/GamesResult/components/ResultTable/components/Icons';
import {EGameResult} from './gamesResult';
import {ALL_SPORTS_MAP} from '.';

export enum ESportsCategory {
  FOOTBALL = 1,
  BASKETBALL = 2,
  TENNIS = 3,
  E_SPORTS = 4,
  SNOOKER = 5,
  VOLLEYBALL = 6,
  SPECIAL_PROJECTS = 7,
  DARTS = 8,
  RUGBY = 9,
  BOXING_MMA = 10,
  HANDBALL = 11,
  ICE_HOCKEY = 12,
  CRICKET = 13,
  FINANCIAL_BETTING = 14,
  LOTTERY = 15,
  AMERICAN_FOOTBALL = 16,
  GOLF = 17,
  BASEBALL = 18,
  BADMINTON = 19,
  BEAUTY_CONTEST = 20,
  RACING = 21,
  BEACH_SOCCER = 22,
  TABLE_TENNIS = 23,
  SOFTBALL = 24,
  INDOOR_SOCCER = 25,
  BEACH_VOLLEYBALL = 26,
  WINTER_SPORTS = 27,
  FIELD_HOCKEY = 28,
  CYCLING = 29,
  GYMNASTICS = 30,
  TRACK_AND_FIELD = 31,
  MORE_SPORTS = 32,
  WATER_SPORTS = 33,
  DOTA = 276,
  CSGO = 277,
  LOL = 278,
  KING = 279,
}

export const sportsCategory = [
  {
    sportId: 1,
    name: ALL_SPORTS_MAP[1],
    resultIcons: tags.football,
  },
  {
    sportId: 2,
    name: ALL_SPORTS_MAP[2],
    resultIcons: tags.basketball,
  },
  {
    sportId: 3,
    name: ALL_SPORTS_MAP[3],
    resultIcons: tags.tennis,
  },
  {
    sportId: 4,
    name: ALL_SPORTS_MAP[4],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 5,
    name: ALL_SPORTS_MAP[5],
    resultIcons: tags.snooker,
  },
  {
    sportId: 6,
    name: ALL_SPORTS_MAP[6],
    resultIcons: tags.volleyball,
  },
  {
    sportId: 7,
    name: ALL_SPORTS_MAP[7],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 8,
    name: ALL_SPORTS_MAP[8],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 9,
    name: ALL_SPORTS_MAP[9],
    resultIcons: tags.rugby,
  },
  {
    sportId: 10,
    name: ALL_SPORTS_MAP[10],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 11,
    name: ALL_SPORTS_MAP[11],
    resultIcons: tags.handball,
  },
  {
    sportId: 12,
    name: ALL_SPORTS_MAP[12],
    resultIcons: tags.iceHockey,
  },
  {
    sportId: 13,
    name: ALL_SPORTS_MAP[13],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 14,
    name: ALL_SPORTS_MAP[14],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 15,
    name: ALL_SPORTS_MAP[15],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 16,
    name: ALL_SPORTS_MAP[16],
    resultIcons: tags.americasoccer,
  },
  {
    sportId: 17,
    name: ALL_SPORTS_MAP[17],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 18,
    name: ALL_SPORTS_MAP[18],
    resultIcons: tags.baseball,
  },
  {
    sportId: 19,
    name: ALL_SPORTS_MAP[19],
    resultIcons: tags.badminton,
  },
  {
    sportId: 20,
    name: ALL_SPORTS_MAP[20],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 21,
    name: ALL_SPORTS_MAP[21],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 22,
    name: ALL_SPORTS_MAP[22],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 23,
    name: ALL_SPORTS_MAP[23],
    resultIcons: tags.pingpong,
  },
  {
    sportId: 24,
    name: ALL_SPORTS_MAP[24],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 25,
    name: ALL_SPORTS_MAP[25],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 26,
    name: ALL_SPORTS_MAP[26],
    resultIcons: tags.beachVolleyball,
  },
  {
    sportId: 27,
    name: ALL_SPORTS_MAP[27],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 28,
    name: ALL_SPORTS_MAP[28],
    resultIcons: tags.hockey,
  },
  {
    sportId: 29,
    name: ALL_SPORTS_MAP[29],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 30,
    name: ALL_SPORTS_MAP[30],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 31,
    name: ALL_SPORTS_MAP[31],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 32,
    name: ALL_SPORTS_MAP[32],
    resultIcons: tags.otherGames,
  },
  {
    sportId: 33,
    name: ALL_SPORTS_MAP[33],
    resultIcons: tags.otherGames,
  },
];

export const eSportsCategory = [
  {
    sportId: 276,
    name: 'DOTA2',
    resultIcons: tags.otherGames,
  },
  {
    sportId: 277,
    name: 'CS:GO/CS2',
    resultIcons: tags.otherGames,
  },
  {
    sportId: 278,
    name: '英雄联盟',
    resultIcons: tags.otherGames,
  },
  {
    sportId: 279,
    name: '王者荣耀',
    resultIcons: tags.otherGames,
  },
];

export interface IconProps {
  title: string;
  element: React.ReactElement;
}
export default [...sportsCategory, ...eSportsCategory] as {
  sportId: number;
  name: string;
  resultIcons?: Record<EGameResult, IconProps>;
  rollingBallSwitch?: boolean;
  morningSwitch?: boolean;
  sportShowSwitch?: boolean;
}[];
