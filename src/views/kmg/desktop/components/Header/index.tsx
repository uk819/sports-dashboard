import React, {useEffect, useMemo, useRef, useState} from 'react';
import usePublicState from '@core/hooks/usePublicState';
import {useHistory} from 'react-router-dom';
import style from './style.scss';
import {ETHEME} from '../../configs';
import {useLocation} from 'react-router';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import useSettings from '@core/hooks/sports/useSettings';
import {EESportType, EGameType, ESportType} from '@core/constants/enum/sport';
import {isESports} from '@core/utils';
import classnames from 'classnames';

export default React.memo(() => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  const location = useLocation();
  const {user, base, dispatch, ACTIONS} = usePublicState();
  const [timeString, setTimeString] = useState(formatTime(Date.now()));
  const {switchGameType, sportId} = useSettings();
  const history = useHistory();
  const {emit} = useEventEmitter<TMitt['toggleFavorite']>({mittName: 'toggleFavorite'});
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeString(formatTime(base.serverTime + new Date().getTime() - base.serverTime));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);
  // 底线滑动效果
  const menuItems = [
    {content: '体育投注', path: '/', hidden: isESports()},
    {content: '电子竞技', path: '/'},
    {content: '注单历史', path: '/record'},
    {content: '赛果', path: '/games-result', hidden: isESports()},
    {content: isESports() ? '竞猜规则' : '体育竞猜规则', path: '/rule'},
    // {content: 'DEMO', path: '/demo'},
  ];
  type MenuItemRef = React.MutableRefObject<(HTMLLIElement | null)[]>;
  const menuItemElements: MenuItemRef = useRef([]);
  const hrElementRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = (idx: number) => {
    if (idx === 1) {
      switchGameType(EGameType.ESPORTS, EESportType.LOL);
    }
    if (idx === 0) {
      switchGameType(EGameType.SPORTS, ESportType.FOOTBALL);
    }
    setSelectedIndex(idx);
  };

  useEffect(()=>{
    if (location.pathname === '/announcement') {
      setSelectedIndex(5);
    }
    if (location.pathname === '/record') {
      setSelectedIndex(2);
    }
  }, [location.pathname]);

  const disabled = useMemo(() => {
    return ['/ip_limit', '/upgrade_progress'].includes(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const unlineSize = (menuItemElements.current[selectedIndex])?.offsetWidth || 0;
    let unlineShift = 0;
    let idx = 0;
    while (idx < selectedIndex) {
      unlineShift += (menuItemElements.current[idx])?.offsetWidth || 0;
      idx++;
    }

    const hrElement = hrElementRef.current;

    if (hrElement) {
      hrElement.style.marginLeft = `${unlineShift}px`;
      hrElement.style.width = `${unlineSize}px`;
    }
    dispatch(ACTIONS.SPORT.updatePagePath(menuItems[selectedIndex]?.path));
    emit({display: false});
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex < 2 && selectedIndex !== -1) {
      setSelectedIndex(sportId > 33 ? 1 : 0);
    }
  }, [sportId, selectedIndex]);

  useEffect(() => {
    handleClick(menuItems.findIndex((item) => item.path === location.pathname));
    if (location.pathname === '/announcement') {
      setSelectedIndex(5);
    }
  }, []);
  useEffect(() => {
    if (location.pathname === '/announcement') setSelectedIndex(-1);
  }, [location.pathname]);

  interface MenuItem {content: string, path: string, hidden?: boolean;};

  const renderItem = (
      onClick: (idx: number) => void,
  ) => ({content, path, hidden}: MenuItem, idx: number) => {
    return (
      <li
        key={idx}
        className={classnames('menu-item', {'active': selectedIndex === idx, 'dp-hidden': hidden})}
        ref={(el) => menuItemElements.current.push(el)}
        onClick={() => {
          if (disabled || selectedIndex === idx || hidden) return;
          onClick(idx);
          history.push(path);
        }}
      >
        {!hidden && content}
      </li>
    );
  };

  const renderItems = (
      items: MenuItem[],
      onClick: (idx: number) => void,
  ) => items.map(renderItem(onClick));

  const isE = isESports();

  return (
    <header className={style.wrapper}>
      <div className="contents">
        <ul className="menu-container">
          {renderItems(
              menuItems,
              handleClick,
          )}
          <hr id="underline" ref={hrElementRef}/>
        </ul>
        <div className="ad">
          <img
            src={require(`./i/ad${isE ? '_esport' : user.theme === ETHEME.DARK ? '_dark' : ''}.${isE ? 'webp' : 'png'}`)}
            alt="Ad"
          />
          <div className="date">
            <span>{timeString}</span> GMT+8
          </div>
        </div>
      </div>
    </header>
  );
});
