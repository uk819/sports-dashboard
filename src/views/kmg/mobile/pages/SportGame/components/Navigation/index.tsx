/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 17:17:59
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/Navigation/index.tsx
 * @Description:
 */
import useSettingMenu from '@core/hooks/sports/useSettings';
import css from './style.scss';
import useHandicapTutorial from '@core/hooks/sports/useHandicapTutorial';
import useNavigationHooks from '@core/hooks/sports/useNavigation';
// import {useHistory, useLocation} from 'react-router';
import useGuard from '@core/hooks/sports/useGuard';
import {EPollIntervalGuardKeys} from '@core/constants/enum/sport';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import useTheme from '@core/hooks/useTheme';
import {ETHEME} from '@views/kmg/mobile/configs';
import {SportPopup} from '@core/constants/enum/common';
import useProfile from '@core/hooks/users/useProfile';
import {isESports} from '@core/utils';

export default () => {
  const {handlePopUp} = useSettingMenu();
  const {handleHandicapTutorial} = useHandicapTutorial();
  const {toggleMobileOrderHistory} = useNavigationHooks();
  // const location = useLocation();
  // const history = useHistory();
  const {isReload, resetGuard, setIsReload} = useGuard();
  // const {emit} = useEventEmitter<TMitt['toggleFavorite']>({mittName: 'toggleFavorite'});
  const reloadEmit = useEventEmitter<TMitt['isReload']>({mittName: 'isReload'});
  const [showFavorite, setShowFavorite] = React.useState(false);
  useEventEmitter<TMitt['toggleFavorite']>({mittName: 'toggleFavorite', on: ({display}) => setShowFavorite(display)});
  const {theme} = useTheme();
  const {getProfile} = useProfile();

  const handleReload = ()=>{
    if (isReload) return;
    if (showFavorite) {
      reloadEmit.emit({display: true});
      setIsReload(true);
      setTimeout(() => {
        setIsReload(false);
      }, 2000);
      return;
    }
    getProfile();
    resetGuard(EPollIntervalGuardKeys.LEAGUE_STATISTICS);
  };

  // const handleChange = () => {
  //   history.push(location.pathname === '/' ? '/esports' : '/');
  //   emit({display: false});
  // };
  return (
    <div className={css.wrapper}>
      {
        !isESports() &&
        <div className="item" onClick={handleHandicapTutorial}>
          <img src={require(`./i/icon${theme === ETHEME.DARK ? '-' : '_'}1.png`)} />
          <span>盘口教程</span>
        </div>
      }
      <div className="item" onClick={() => handlePopUp(SportPopup.SETTING)}>
        <img src={require(`./i/icon${theme === ETHEME.DARK ? '-' : '_'}2.png`)} />
        <span>设置菜单</span>
      </div>
      <div className="item" onClick={() => toggleMobileOrderHistory(2, 1)}>
        <img src={require(`./i/icon${theme === ETHEME.DARK ? '-' : '_'}3.png`)} />
        <span>已结算注单</span>
      </div>
      <div className="item" onClick={() => toggleMobileOrderHistory(2, 0)}>
        <img src={require(`./i/icon${theme === ETHEME.DARK ? '-' : '_'}4.png`)} />
        <span>未结算注单</span>
      </div>
      <div className='item' onClick={handleReload}>
        <div className="icon-wrap">
          <img className={`${isReload && 'rotate-infinite'}`} src={require(`./i/icon${theme === ETHEME.DARK ? '-' : '_'}5.png`)} />
        </div>
        <span>刷新</span>
      </div>
    </div>
  );
};
