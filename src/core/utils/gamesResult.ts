import {TGameResultDetailItem, TGameResultFilteredDetailItem} from '@core/apis/models/sport/get-game-result';
import {BET_RESULT_TYPE_MAP} from '@core/constants/enum/sport';
import {getBetHandiCapAtBetting, getBetTeamType, getNameByhoa, getPlayNameByKc, isVisiableSecondText} from '.';
import {mapBetItemName} from '@core/constants/enum/sport/betItemName';

export const filterTeamName = (res: string, mTeam: string[]): string => {
  switch (res) {
    case mapBetItemName.Home:
      return mTeam[0];
    case mapBetItemName.Away:
      return mTeam[1];
    default:
      return res;
  }
};

export const filterHandiCap = (detail: TGameResultDetailItem, mTeam: string[]): string => {
  const {h, kc} = detail;
  switch (kc) {
    case 'FT_1X2':
    case 'HT_1X2':
      return filterTeamName(getNameByhoa(h), mTeam);
    case 'FT_OE':
    case 'HT_OE':
      return getNameByhoa(h);
    case 'FT_CS':
    case 'HT_CS':
      if (h === 'AOS') return '其他';
      return h.charAt(1) + '-' + h.charAt(3);
    case 'FT_AH':
    case 'HF_AH':
      return '(' + detail.h + ')';
    default:
      return h;
  }
};

export const filterHOA = (hoa: string, mTeam: string[]): string => {
  const type = getNameByhoa(hoa);
  return filterTeamName(type, mTeam);
};

export const filterGameResult = (details: Array<TGameResultDetailItem>, mTeam: string[], sprotId: number) => {
  const results: Array<TGameResultFilteredDetailItem> = [];
  details.map((detail) => {
    const {mid, bid, bs, ss, ctid, n, bn, kc} = detail;
    const obj = {
      betHomeOrAway: detail.hoa,
      betHandicap: detail.h,
      kindsCode: kc,
      homeTeamNameCn: mTeam[0],
      awayTeamNameCn: mTeam[1],
      betN: n,
      betTeam: detail.hoa ? detail.hoa : detail.h,
      orderName: detail.hoa,
    };
    // 筛选比赛结果
    const r = BET_RESULT_TYPE_MAP[detail.r];
    // 筛选盘口
    let h ='';
    const isVisible =isVisiableSecondText(detail.h, detail.n, detail.kc);
    if (isVisible) {
      h = getBetHandiCapAtBetting(detail.h, sprotId);
    }
    // 筛选HOA
    const hoa = getBetTeamType((obj)as any);
    // 分类代码
    const kcStr = getPlayNameByKc({code: kc, name: bn, ctid: ctid, sportId: 1});
    results.push({mid, bid, bs, ss, kc: kcStr, ctid, r, h, hoa, bn: '', n: ''});
  });

  return results;
};

/**

export const filterTeamName = (res: string, mTeam: string[]): string => {
  switch (res) {
    case mapBetItemName.Home:
      return mTeam;
    case mapBetItemName.Away:
      return _.reverse(mTeam[1]);
    default:
      return res;
  }
};
export const converseSign = (h: string): string => {
  switch (h[0]) {
    case '+':
      return '(' + _.replace(h, '+', '-') + ')';
    case '-':
      return '(' + _.replace(h, '-', '+') + ')';
    default:
      return h;
  }
}
 */
