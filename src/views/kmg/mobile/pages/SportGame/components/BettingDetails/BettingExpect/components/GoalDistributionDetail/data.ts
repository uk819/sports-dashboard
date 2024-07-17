export interface IDistribution {
  home: ITeam;
  away: ITeam;
}

interface ITeam {
  status: string;
  detail: IDetail[];
}

export interface IDetail {
    id: number;
    time: string;
    all: number;
    home: number;
    away: number;
}

export const distributions: IDistribution = {
  home: {status: '同赛事', detail: [
    {id: 0, time: '1-15’', all: 3, home: 2, away: 2},
    {id: 1, time: '16-30’', all: 2, home: 2, away: 2},
    {id: 2, time: '31-45’', all: 2, home: 2, away: 2},
    {id: 3, time: '46-60’', all: 2, home: 2, away: 2},
    {id: 4, time: '61-75’', all: 2, home: 2, away: 2},
    {id: 5, time: '76-90’', all: 2, home: 2, away: 2},
  ]},
  away: {status: '同赛事', detail: [
    {id: 0, time: '1-15’', all: 3, home: 2, away: 2},
    {id: 1, time: '16-30’', all: 2, home: 2, away: 2},
    {id: 2, time: '31-45’', all: 2, home: 2, away: 2},
    {id: 3, time: '46-60’', all: 2, home: 2, away: 2},
    {id: 4, time: '61-75’', all: 2, home: 2, away: 2},
    {id: 5, time: '76-90’', all: 2, home: 2, away: 2},
  ]}};
