/*
 * @Description: REDUX 初始化状态
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2024-01-16 17:47:05
 * @LastEditors: Galen.GE
 */
import {ETHEME} from '@views/kmg/desktop/configs';
import storage from '@helpers/storage';
import * as ESport from '../constants/enum/sport';
import ESportsCategory from '@constants/enum/sport/sportsCategory';
import TStore, {TBase, TUser, TSport} from './_reduxStore.d';
import dayjs from 'dayjs';
import {dateFormat} from '@views/kmg/desktop/components/DateRangePicker';
import {SportPopup} from '@core/constants/enum/common';

const base: TBase = {
  loading: {display: false},
  modal: {display: false},
  toast: {types: 'info', text: ''},
  fullScreen: false,
  serverTime: _.now(),
  isInsideMatchList: true,
  toggleSeries: false,
  toggleSeriesVisible: false,
  mobile: {
    navigation: -1,
    orderHistoryStatus: -1,
  },
  config: {
    orderCheckMaxTime: 3,
  },
};

const user: TUser = {
  token: null,
  info: {
    userName: 'GUEST',
    totalBalance: 0,
    orderCount: 0,
  },
  currentOddType: storage.get('ODD_TYPE') || 1,
  theme: storage.get('CUR_THEME') ?? ETHEME.LIGHT,
  confirmSubmitStatus: false,
  limitData: {
    userOrderLimit: {
      productAmountTotalLimit: 10000,
      maxWinAmountLimit: 50000,
    },
    sportUserOrderLimit: {
      productAmountTotalLimit: 10000,
      maxWinAmountLimit: 50000,
    },
    esportUserOrderLimit: {
      productAmountTotalLimit: 10000,
      maxWinAmountLimit: 50000,
    },
  },
};

const sport: TSport = {
  pollIntervalGuard: {},
  isVisiableDetail: false,
  display: {
    matchStatistics: ESportsCategory.map((i) => ({sportId: i.sportId, sportName: i.name, count: 0, available: 1, rollingBallSwitch: true, morningSwitch: true, sportShowSwitch: true})),
    leagueStatistics: [],
    matchStatisticsEsports: [],
    matchListUpdateTime: 0,
    detailUpdateTime: 0,
    detailStatisticsUpdateTime: 0,
    matchSourceList: [],
    displayType: 'skeleton',
    currentMatchId: null,
    currentLeagueId: null,
    earlyGroup: [],
    fullScreen: false,
    zoomStatus: false,
    di: 0,
    favoriteIds: [],
    gameResultStatistics: [],
    gameResultDetail: {details: []},
    pagePath: '/',
    leagueTagStatistics: [],
    initMatchList: false,
  },
  userSettings: {
    matchType: ESport.EMatchTypes.IN_PLAY,
    sportId: ESport.ESportType.FOOTBALL,
    gameBettingType: storage.get('CUR_GAME_BETTING_TYPE') ?? null,
    sortBy: ESport.ESortBy.HOT,
    collapseLeagueIds: [],
    gameResultPageInfo: {
      sportId: 1,
      pageNum: 1,
      pageSize: 10,
      beginTime: dayjs().subtract(7, 'day').format(dateFormat),
      endTime: dayjs().format(dateFormat)},
  },
  bet: {
    orders: {},
    orderTags: [],
    confirmOrders: [],
    checkResult: [],
  },
  popUp: SportPopup.CLOSE,
  handicaptutorial: {
    isClicked: false,
  },
  handicapPractice: {
    isClicked: false,
  },
  seriesList: [],
  msgLiveList: [],
};

const store: TStore = {
  base,
  user,
  sport,
};

export default store;
