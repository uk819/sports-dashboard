// import sportsCategory from '@constants/enum/sport/sportsCategory';
import {useMemo} from 'react';
import TStore from '@core/reducers/_reduxStore';
import 'swiper/scss';
import useSettings from '@core/hooks/sports/useSettings';
import {useSelector} from 'react-redux';
import {EMatchTypes, ALL_ESPORTS} from '@core/constants/enum/sport';
import {isMobile} from '@core/utils';

export default ()=>{
  const {matchStatistics, matchStatisticsEsports} = useSelector((state: TStore) => state.sport.display);
  const {matchType} = useSelector((state: TStore) => state.sport.userSettings);
  const {sportId} = useSettings();
  const sportList = useMemo(()=> {
    if (isMobile()) {
      return matchStatistics;
    } else {
      return _.find(ALL_ESPORTS, {code: sportId}) ? matchStatisticsEsports : matchStatistics;
    }
  }, [matchStatisticsEsports, matchStatistics]);

  const list = useMemo(() => sportList.filter((item) => item.sportId !== 4), [sportList]);

  const switchMatchTypeDisplay: boolean = useMemo(()=> {
    const currentMatch=_.find(list, {'sportId': sportId});

    if (matchType === EMatchTypes.EARLY&&!currentMatch?.morningSwitch) {
      return false;
    };
    if (matchType === EMatchTypes.IN_PLAY&&!currentMatch?.rollingBallSwitch) {
      return false;
    };

    if (!currentMatch?.sportShowSwitch) {
      return false;
    };
    return true;
  }, [matchType, sportList, sportId]);

  const uncominghasDataRollnoData:boolean = useMemo(()=> {
    // 滚球关闭， 未开赛不展示滚球数据
    const currentMatch=_.find(list, {'sportId': sportId});
    if (matchType === EMatchTypes.UPCOMING&&!currentMatch?.rollingBallSwitch) {
      return false;
    };
    return true;
  }, [matchType, sportList, sportId]);

  return {
    switchMatchTypeDisplay,
    uncominghasDataRollnoData,
  };
};
