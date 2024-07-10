export interface DatePickerProps {
  handelGetTime?: (time: string) => void;
  handleSportId?: (sportId: number) => void;
  sportId?: number
}

export interface WeekArr {
  time: string;
  name: string;
}

export interface GamesType {
  value: number;
  label: string;
}

export interface LeagueItemPrps {
  sportId: number;
  initActiveIndex: number;
  setInitActiveIndex: (num: number)=> void;
  itemData?: any;
  index?: number;
  data?: any;
  actIndex?:number;
  inView?: boolean;
  toggleCollapseLeague?: (num: number)=>void;
  isCollapse?: Array<string>;
  isNetGames?: boolean;
}
