export interface IEuropeanIndex {
  id: number;
  name: string;
  items: IEItem[];
}

interface IEItem {
    type: string;
    home: number;
    draw: number;
    away: number;
    homeWinRate: string;
    drawRate: string;
    awayWinRate: string;
    returnRate: string;
}


export const europeanIndexes: IEuropeanIndex[] = [
  {id: 0, name: '188bet', items: [{type: '初', home: 3.05, draw: 3.55, away: 2.19, homeWinRate: '30.38%', drawRate: '26.10%', awayWinRate: '43.5%', returnRate: '92.67%'},
    {type: '即', home: 2.33, draw: 3.60, away: 2.70, homeWinRate: '39.38%', drawRate: '25.10%', awayWinRate: '34.50%', returnRate: '92.87%'},
  ]},
  {id: 1, name: '888Sport', items: [{type: '初', home: 3.05, draw: 3.55, away: 2.19, homeWinRate: '30.38%', drawRate: '26.10%', awayWinRate: '43.5%', returnRate: '92.67%'},
    {type: '即', home: 2.33, draw: 3.60, away: 2.70, homeWinRate: '39.38%', drawRate: '25.10%', awayWinRate: '34.50%', returnRate: '92.87%'},
  ]},
  {id: 2, name: 'Vcbet', items: [{type: '初', home: 3.05, draw: 3.55, away: 2.19, homeWinRate: '30.38%', drawRate: '26.10%', awayWinRate: '43.5%', returnRate: '92.67%'},
    {type: '即', home: 2.33, draw: 3.60, away: 2.70, homeWinRate: '39.38%', drawRate: '25.10%', awayWinRate: '34.50%', returnRate: '92.87%'},
  ]},

  {id: 4, name: 'William Hill', items: [{type: '初', home: 3.05, draw: 3.55, away: 2.19, homeWinRate: '30.38%', drawRate: '26.10%', awayWinRate: '43.5%', returnRate: '92.67%'},
    {type: '即', home: 2.33, draw: 3.60, away: 2.70, homeWinRate: '39.38%', drawRate: '25.10%', awayWinRate: '34.50%', returnRate: '92.87%'},
  ]},
  {id: 5, name: 'Ladbrokes', items: [{type: '初', home: 3.05, draw: 3.55, away: 2.19, homeWinRate: '30.38%', drawRate: '26.10%', awayWinRate: '43.5%', returnRate: '92.67%'},
    {type: '即', home: 2.33, draw: 3.60, away: 2.70, homeWinRate: '39.38%', drawRate: '25.10%', awayWinRate: '34.50%', returnRate: '92.87%'},
  ]},
  {id: 6, name: 'Bwin', items: [{type: '初', home: 3.05, draw: 3.55, away: 2.19, homeWinRate: '30.38%', drawRate: '26.10%', awayWinRate: '43.5%', returnRate: '92.67%'},
    {type: '即', home: 2.33, draw: 3.60, away: 2.70, homeWinRate: '39.38%', drawRate: '25.10%', awayWinRate: '34.50%', returnRate: '92.87%'},
  ]},
  {id: 7, name: 'SBObet', items: [{type: '初', home: 3.05, draw: 3.55, away: 2.19, homeWinRate: '30.38%', drawRate: '26.10%', awayWinRate: '43.5%', returnRate: '92.67%'},
    {type: '即', home: 2.33, draw: 3.60, away: 2.70, homeWinRate: '39.38%', drawRate: '25.10%', awayWinRate: '34.50%', returnRate: '92.87%'},
  ]},
  {id: 8, name: '1xbet', items: [{type: '初', home: 3.05, draw: 3.55, away: 2.19, homeWinRate: '30.38%', drawRate: '26.10%', awayWinRate: '43.5%', returnRate: '92.67%'},
    {type: '即', home: 2.33, draw: 3.60, away: 2.70, homeWinRate: '39.38%', drawRate: '25.10%', awayWinRate: '34.50%', returnRate: '92.87%'},
  ]},
  {id: 9, name: '12bet', items: [{type: '初', home: 3.05, draw: 3.55, away: 2.19, homeWinRate: '30.38%', drawRate: '26.10%', awayWinRate: '43.5%', returnRate: '92.67%'},
    {type: '即', home: 2.33, draw: 3.60, away: 2.70, homeWinRate: '39.38%', drawRate: '25.10%', awayWinRate: '34.50%', returnRate: '92.87%'},
  ]},
  {id: 10, name: 'Dafabet', items: [{type: '初', home: 3.05, draw: 3.55, away: 2.19, homeWinRate: '30.38%', drawRate: '26.10%', awayWinRate: '43.5%', returnRate: '92.67%'},
    {type: '即', home: 2.33, draw: 3.60, away: 2.70, homeWinRate: '39.38%', drawRate: '25.10%', awayWinRate: '34.50%', returnRate: '92.87%'},
  ]},
];

export interface IAOIndex {
  id: number;
  name: string;
  item: IAOItem;
}

interface IAOItem {
    homeSt: number;
    initialOdds: string | number;
    awaySt: number;
    homeNd: number;
    liveOdds: string | number;
    awayNd: string;
}

export const asianIndex: IAOIndex[] = [
  {id: 0, name: '12bet', item: {homeSt: 2.33, initialOdds: '受平/半', awaySt: 2.19, homeNd: 2.33, liveOdds: '平/半', awayNd: '43.50%'}},
  {id: 1, name: 'Bet365', item: {homeSt: 2.33, initialOdds: '平手', awaySt: 2.19, homeNd: 2.33, liveOdds: '平/半', awayNd: '43.50%'}},
  {id: 2, name: 'William Hill', item: {homeSt: 2.33, initialOdds: '受平/半', awaySt: 2.19, homeNd: 2.33, liveOdds: '平/半', awayNd: '43.50%'}},
  {id: 3, name: 'Vcbet', item: {homeSt: 2.33, initialOdds: '平手', awaySt: 2.19, homeNd: 2.33, liveOdds: '平/半', awayNd: '43.50%'}},
  {id: 4, name: 'Prinnacle Sports', item: {homeSt: 2.33, initialOdds: '受平/半', awaySt: 2.19, homeNd: 2.33, liveOdds: '平/半', awayNd: '43.50%'}},
  {id: 5, name: 'SBObet', item: {homeSt: 2.33, initialOdds: '平手', awaySt: 2.19, homeNd: 2.33, liveOdds: '平/半', awayNd: '43.50%'}},
  {id: 6, name: '188bet', item: {homeSt: 2.33, initialOdds: '受平/半', awaySt: 2.19, homeNd: 2.33, liveOdds: '平/半', awayNd: '43.50%'}},
];


export const overUnderIndex: IAOIndex[] = [
  {id: 0, name: 'Prinnacle Sports', item: {homeSt: 2.33, initialOdds: '3.55', awaySt: 2.19, homeNd: 2.33, liveOdds: '3.55', awayNd: '43.50%'}},
  {id: 1, name: 'SBObet', item: {homeSt: 2.33, initialOdds: '3.55', awaySt: 2.19, homeNd: 2.33, liveOdds: '3.55', awayNd: '43.50%'}},
  {id: 2, name: '188bet', item: {homeSt: 2.33, initialOdds: '3.55', awaySt: 2.19, homeNd: 2.33, liveOdds: '3.55', awayNd: '43.50%'}},
  {id: 3, name: '12bet', item: {homeSt: 2.33, initialOdds: '3.55', awaySt: 2.19, homeNd: 2.33, liveOdds: '3.55', awayNd: '43.50%'}},
  {id: 4, name: 'Bet365', item: {homeSt: 2.33, initialOdds: '3.55', awaySt: 2.19, homeNd: 2.33, liveOdds: '3.55', awayNd: '43.50%'}},
  {id: 5, name: 'William Hill', item: {homeSt: 2.33, initialOdds: '3.55', awaySt: 2.19, homeNd: 2.33, liveOdds: '3.55', awayNd: '43.50%'}},
  {id: 6, name: 'Vcbet', item: {homeSt: 2.33, initialOdds: '3.55', awaySt: 2.19, homeNd: 2.33, liveOdds: '3.55', awayNd: '43.50%'}},
];
