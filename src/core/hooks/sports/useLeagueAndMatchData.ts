/*
 * @Author: Passion.KMG
 * @Date: 2023-12-18 16:23:06
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/hooks/sports/useLeagueAndMatchData.ts
 * @Description: 对比赛的列表的一些操作
 */
import {TMatchDetail} from '@core/apis/models/sport/get-match-list.d';
import {mapMatchList} from '@core/services/dataPurification';
import {TMatch} from '@core/services/Table.d';
import db from '@core/services/db';
import usePublicState from '../usePublicState';
import storage from '@core/helpers/storage';
import getDpStore from '../useDpStore';
import {isMobile} from '@core/utils';
import {EMatchTypes} from '@core/constants/enum/sport';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  /**
   * @description: 保存赛事列表到数据库
   * @param matchList 赛事列表
   */
  const saveMatchListToDB = React.useCallback(({matchList, isSetDisplayState = true, sportId, openMatchId, matchType}: {matchList: Array<TMatchDetail>, isSetDisplayState: boolean, sportId: number, openMatchId?: number, matchType: EMatchTypes}) => {
    if (matchList.length === 0) {
      if (isSetDisplayState) {
        dispatch(ACTIONS.SPORT.updateDisplayType('empty'));
        dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: null}));
      }
      storage.setAny(`${sportId}_league_list`, []);
      return;
    }
    const cleanData = mapMatchList(matchList, 'match-list');
    // 如果没有比赛或者当前的详情比赛在列表中没有则取第一场比赛
    if (isSetDisplayState && matchType !== EMatchTypes.CHAMPION) {
      const matchId = openMatchId || cleanData.matches[0]?.matchId;
      dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId}));
    }
    db.transaction('rw', db.matches, async () => {
      let mergedMatches = cleanData.matches;
      const matchExt = storage.get('MATCH_EXT_INFO');
      if (matchExt) {
        mergedMatches = mergeMatchInfos(cleanData.matches, matchExt);
      }
      // 当前使用追加模式，不删除旧数据
      await db.matches.bulkPut(mergedMatches);
      // // 找出所有比赛对应的联赛id
      // const leagueIds = _.uniq(mergedMatches.map((match) => match.leagueId));
      // // 找出数据库中所有联赛对应的比赛
      // const leagueMatches = await db.matches.where('leagueId').anyOf(leagueIds).toArray();
      // // 删除数据中存在，但是最新的数据中不存在的比赛
      // const deleteMatchIds = _.differenceBy(leagueMatches, mergedMatches, 'matchId').map((match) => match.matchId);
      // await db.matches.bulkDelete(deleteMatchIds);
    }).then(() => {
      dispatch(ACTIONS.SPORT.updateMatchListUpdateTime());
      const {sportId} = getDpStore().getState().sport.userSettings;
      if (matchList[0]?.md.sid === sportId || isMobile()) {
        dispatch(ACTIONS.SPORT.updateDisplayType('list'));
      }
    }).catch((err) => {
      _console.error('Failed to update:', err);
    });
  }, []);

  return {
    saveMatchListToDB,
  };
};

// 合并赛事额外信息
export const mergeMatchInfos = (matches: Array<TMatch>, extMatchInfos: any) => {
  const mergedMatches = matches.map((matchItem) => {
    const match = extMatchInfos[matchItem.mid1];
    return match ? {
      ...matchItem,
      animation: [match.animation_url],
      live: [match.live?.flv_url],
      hasVideo: match.video_status,
      hasAnimate: match.animation_status,
      teamReverse: match.match_reverse,
    } : matchItem;
  });
  return mergedMatches;
};
