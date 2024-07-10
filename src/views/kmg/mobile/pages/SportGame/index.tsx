/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:38:07
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/index.tsx
 * @Description:
 */
import useSportsGameInit from '@core/hooks/sports/useSportsGameInit';
import usePollInterval from '@core/hooks/sports/usePollInterval';
import pageWrapper from '@this/components/PageWrapper';
import MatchTypeSelector, {DatePicker} from './components/MatchTypeSelector';
import SportTypeSelector from './components/SportTypeSelector';
import OptionBar from './components/OptionBar';
import MainContent from './components/MainContent';
import Navigation from './components/Navigation';
import BetCart from './components/BetCart';
import BettingSuccessNotice from './components/BettingSuccessNotice';
import SwitchAutoOddNotice from './components/SwitchAutoOddNotice';
import SettingMenu from './components/SettingMenu';
import BettingDetails from './components/BettingDetails';
import OrderRecords from './components/OrderRecords';
import 'swiper/css';
import css from './style.scss';
import HandicapTutorial from './components/HandicapTutorial';
import React, {useMemo, useState} from 'react';
import useSettings from '@core/hooks/sports/useSettings';
import {EGameType, EESportType, ESportType, EMatchTypes} from '@core/constants/enum/sport';
import FavoriteDetail from './components/FavoriteDetail';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import {useSelector} from 'react-redux';
import classNames from 'classnames';
import TStore from '@core/reducers/_reduxStore';
import useUserInfoHooks from '@core/hooks/users/useUserInfoHooks';
import {isESports as isES} from '@core/utils/index';

export const SportGame = React.memo(() => {
  useSportsGameInit();
  usePollInterval();
  const [showFavorite, setShowFavorite] = React.useState(false);
  const [showDatePick, setShowDatePick] = useState(false);
  useEventEmitter<TMitt['toggleFavorite']>({mittName: 'toggleFavorite', on: ({display}) => setShowFavorite(display)});
  const orderHistoryStatus = useSelector((state: TStore) => state.base.mobile.orderHistoryStatus);
  const {switchGameType, sportId, matchType} = useSettings();
  const isESports = useMemo(() => {
    return isES() || sportId > 33;
  }, [sportId]);
  useUserInfoHooks();

  React.useEffect(() => {
    switchGameType(isESports ? EGameType.ESPORTS : EGameType.SPORTS, isESports ? EESportType.LOL : ESportType.FOOTBALL);
  }, [isESports]);
  useEventEmitter<TMitt['showDatePick']>({mittName: 'showDatePick', on: ({display}) => setShowDatePick(display)});

  return (
    <div className={css.wrapper}>
      <div className={classNames('header', {'is-esports': sportId > 33, [`sid-${sportId}`]: true})}>
        <MatchTypeSelector />
        {
          ([EMatchTypes.EARLY, EMatchTypes.PARLAY].includes(matchType) || showDatePick) && !showFavorite && !isESports &&
          <DatePicker />
        }
        <SportTypeSelector />
        <OptionBar />
        {
          showDatePick && !showFavorite && isESports &&
          <DatePicker />
        }
      </div>
      {/* <SearchMenu /> */}
      {
        showFavorite ? <FavoriteDetail /> : <MainContent />
      }
      <Navigation />
      <BetCart />
      <SettingMenu />
      <HandicapTutorial />
      <BettingSuccessNotice />
      <SwitchAutoOddNotice />
      <BettingDetails />
      {
        orderHistoryStatus >= 0 &&
        <OrderRecords />
      }
    </div>
  );
});

export default pageWrapper(SportGame, {title: 'DP体育'});
