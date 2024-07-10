/*
 * @Author: Passion.KMG
 * @Date: 2024-01-10 20:08:36
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MenuSidePanel/components/LeagueList.tsx
 * @Description:
 */
import React, {useMemo} from 'react';
import TStore from '@core/reducers/_reduxStore';
import usePublicState from '@core/hooks/usePublicState';
import DpImage from '@views/kmg/desktop/components/Image';
import {ALL_MATCH_TYPES, EMatchTypes} from '@constants/enum/sport';
import {useSelector} from 'react-redux';
import DpCollapse from '@views/kmg/desktop/components/Collapse';
import {useLeagueListData} from '@core/hooks/sports/useRenderData';
import {DpIcon} from '@views/kmg/desktop/components';
import storage from '@core/helpers/storage';
import useSwitchMatchType from '@core/hooks/sports/useSwitchMatchType';

export const LeagueList = React.memo(() => {
  const {switchMatchTypeDisplay, uncominghasDataRollnoData} = useSwitchMatchType();
  const {dispatch, ACTIONS} = usePublicState();
  const {leagues} = useLeagueListData();
  const {currentLeagueId, displayType} = useSelector((state: TStore) => state.sport.display);
  const {matchType, sportId} = useSelector((state: TStore) => state.sport.userSettings);
  const groupLeague = useMemo(() => {
    return _.groupBy(displayType === 'skeleton' ? storage.getAny(`${sportId}_league_list`) : leagues, 'state');
  }, [displayType, leagues]);
  const groupLeagueList = _.map(groupLeague, (item, key: EMatchTypes) => ({key, list: item}));

  // 滚球盘关， 未开赛去掉滚球盘
  if (!uncominghasDataRollnoData) {
    _.remove(groupLeagueList, (obj) => obj.key === EMatchTypes.IN_PLAY);
  }
  return (
    <div className='scroll-list-wrapper'>
      {
        switchMatchTypeDisplay && groupLeagueList.sort((item) => item.key === matchType ? -1 : 1).map((item) =>
          <DpCollapse
            header={
              ![EMatchTypes.EARLY, EMatchTypes.CHAMPION].includes(matchType) &&
              <div className="menu-item league-item league-group-name">
                <DpIcon type='arrow2' />
                <span>{_.find(ALL_MATCH_TYPES, {code: item.key})?.name } (<span>{_.sumBy(item.list, (league) => league.countGroup[item.key])}</span>)</span>
              </div>
            }
            key={item.key}
          >
            {
              item.list.map((it) =>
                <div
                  key={it.leagueId}
                  className={`menu-item league-item ${_.find(currentLeagueId, {id: it.leagueId, key: item.key}) ? 'active' : '' }`}
                  onClick={() => {
                    dispatch(ACTIONS.SPORT.updateDisplayZoomStatus(false));
                    dispatch(ACTIONS.SPORT.toggleSelectLeague({matchType: item.key, id: it.leagueId}));
                  }}>
                  <DpImage className='mr-6' size={16} width={16} type="league" src={it.leagueIcon} />
                  <span className='name league'>{it.leagueName}</span>
                  {
                    matchType !== EMatchTypes.CHAMPION &&
                    <span className='count'>{it.countGroup[item.key]}</span>
                  }
                </div>,
              )
            }
          </DpCollapse>,
        )
      }
    </div>
  );
});
