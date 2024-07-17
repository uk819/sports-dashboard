import {TGameResultCounts, TGameResultStatistic} from '@core/reducers/_reduxStore';

export interface DatePickerProps {
  handelGetTime?: (time: string) => void;
  handleSportId?: (sportId: number) => void;
  sportId?: number;
  currentTime?: string;
  opts?: Array<{label: string; value: number}>;
  setShowFilter?: (val: boolean) => void;
  gamesResult?: TGameResultStatistic[];
  counts?: TGameResultCounts;
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
  itemData?: any;
  index?: number;
  data?: any;
  inView?: boolean;
  toggleCollapseLeague?: (num: number) => void;
  isCollapse?: Array<string>;
}

export interface MatchTypeProps {
  matchType: number;
  setMatchType: (val: number) => void;
}
