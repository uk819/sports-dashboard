export interface ITrend {
  home: ITeam;
  away: ITeam;
}

interface ITeam {
  status: IStatus;
  detail: IDetail[];
}

interface IStatus {
  winRate: string;
  ballRate: string;
}

export interface IDetail {
    id: number;
    dataEvent: IDataEvent;
    home: IItems;
    away: IItems;
    handicap: IHandicap;
    overUnder: IOverUnder;
}

interface IDataEvent {
  date: string;
  leagueName: string;
}

interface IItems {
  name: string;
  score: number;
}

interface IHandicap {
  value: string;
  result: string;
}

interface IOverUnder {
  value: string;
  result: '大' | '小';
}

export const trends: ITrend = {
  home: {status: {winRate: '赢盘率90%', ballRate: '大球率40%'}, detail: [
    {id: 0, dataEvent: {date: '24-01-06', leagueName: '土超'}, home: {name: '里泽体育', score: 2}, away: {name: '哈塔斯堡', score: 0}, handicap: {value: '3.5', result: '赢'}, overUnder: {value: '2.5', result: '大'}},
    {id: 1, dataEvent: {date: '24-01-06', leagueName: '土超'}, home: {name: '里泽体育', score: 2}, away: {name: '哈塔斯堡', score: 0}, handicap: {value: '3.5', result: '输'}, overUnder: {value: '2.5', result: '小'}},
    {id: 2, dataEvent: {date: '24-01-06', leagueName: '土超'}, home: {name: '里泽体育', score: 2}, away: {name: '哈塔斯堡', score: 0}, handicap: {value: '3.5', result: '赢'}, overUnder: {value: '2.5', result: '大'}},
    {id: 3, dataEvent: {date: '24-01-06', leagueName: '土超'}, home: {name: '里泽体育', score: 2}, away: {name: '哈塔斯堡', score: 0}, handicap: {value: '3.5', result: '赢'}, overUnder: {value: '2.5', result: '小'}},
  ]},
  away: {status: {winRate: '赢盘率90%', ballRate: '大球率40%'}, detail: [
    {id: 0, dataEvent: {date: '24-01-06', leagueName: '土超'}, home: {name: '里泽体育', score: 2}, away: {name: '哈塔斯堡', score: 0}, handicap: {value: '3.5', result: '走水'}, overUnder: {value: '2.5', result: '大'}},
    {id: 1, dataEvent: {date: '24-01-06', leagueName: '土超'}, home: {name: '里泽体育', score: 2}, away: {name: '哈塔斯堡', score: 0}, handicap: {value: '3.5', result: '输'}, overUnder: {value: '2.5', result: '小'}},
    {id: 2, dataEvent: {date: '24-01-06', leagueName: '土超'}, home: {name: '里泽体育', score: 2}, away: {name: '哈塔斯堡', score: 0}, handicap: {value: '3.5', result: '赢'}, overUnder: {value: '2.5', result: '大'}},
    {id: 3, dataEvent: {date: '24-01-06', leagueName: '土超'}, home: {name: '里泽体育', score: 2}, away: {name: '哈塔斯堡', score: 0}, handicap: {value: '3.5', result: '赢'}, overUnder: {value: '2.5', result: '小'}},
  ]}};
