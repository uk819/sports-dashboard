import {Input} from 'antd';
import style from './style.scss';
import usePublicState from '@core/hooks/usePublicState';
import React, {useEffect, useMemo, useState} from 'react';
// const {Search} = Input;
import {SearchOutlined} from '@ant-design/icons';
import Overlay from '@template/components/Overlay';
import classnames from 'classnames';
import useSearchHistoryHooks from '@core/hooks/useSearchHistoryHooks';
import DpIcon from '@views/kmg/desktop/components/Icon';
import useSettings from '@core/hooks/sports/useSettings';
import {getMatchStatusByPeriod} from '@core/utils';
import dayjs from 'dayjs';
import Empty from '@core/templates/mobile/components/Empty';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import {SportPopup} from '@core/constants/enum/common';

interface IProps {
  onFocusChange?: (type: boolean) => void;
  isFocus?: boolean;
}

export interface SearchData {
  mid: number;
  ht: {
    tid: number;
    tn: string;
    lg: string;
    lv: number;
  },
  at: {
    tid: number;
    tn: string;
    lg: string;
    lv: number;
  },
  ip: number;
  bt: number;
  pd: string;
}

export default ({onFocusChange, isFocus}: IProps) => {
  const {dispatch, ACTIONS} = usePublicState();
  const [searchText, setSearchText] = useState<string>();
  const popUp = useSelector((state: TStore) => state.sport.popUp);
  const isOpen = useMemo(() => {
    return popUp === SportPopup.FILTER;
  }, [popUp]);
  const [open, setOpen] = useState(false);
  const {searchHistory, setHistory, clearSearchHistory} = useSearchHistoryHooks();
  const {sportId} = useSettings();
  const [list, setList] = useState<SearchData[]>(null);
  const {handlePopUp} = useSettings();


  const onClose = () => {
    setOpen(false);
    handlePopUp(SportPopup.CLOSE);
    setSearchText('');
    setList([]);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setOpen(true);
      }, 80);
    };
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleSearch = () => {
      searchMatch();
    };

    const delayedSearch = () => {
      clearTimeout(timer);
      timer = setTimeout(handleSearch, 1000);
    };
    delayedSearch();

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  const onClear = (e: React.MouseEvent<Element, MouseEvent>, word: string) => {
    e.stopPropagation();
    setHistory(sportId, word, false);
  };

  const searchMatch = _.throttle((word?: string) => {
    const text = word || searchText;
    if (!text?.trim()) return;
    dispatch(ACTIONS.SPORT.searchMatchByName({
      params: {sportId, keyword: text},
      cb: (res: any) => {
        setList(res.data);
        setHistory(sportId, text);
      }}));
  }, 1000);

  const handleOpenDetail = (matchId: number) => {
    dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId}));
    dispatch(ACTIONS.SPORT.switchVisiabelByDetail(true));
  };

  const onClickHistory = (word?: string) => {
    setSearchText(word);
    searchMatch(word);
  };

  return (
    <div className={style.wrapper}>
      <div className='search-button' onClick={() => handlePopUp(SportPopup.FILTER)}>
        {
          false &&
          <Input onFocus={() => onFocusChange && onFocusChange(true)} size="large" value={searchText} style={{height: 27, borderRadius: 14, fontSize: 11, lineHeight: 12}} placeholder="赛事搜索"/>
        }
        <SearchOutlined />
        <span className="ml-4">赛事搜索</span>
      </div>
      {
        isOpen &&
        <Overlay display maskClickClose zIndex={10} close={onClose} className={style.modal}>
          <div className={classnames('search-match-wrapper', {open: open, close: !open})} onClick={(e) => e.stopPropagation()}>
            <div className="search-header">
              <div className="cancel text-theme" onClick={onClose}>关闭</div>
              <div className="title">选择赛事</div>
              <div className="cancel text-theme" onClick={() => searchMatch()}>确定</div>
            </div>
            <Input size="large" value={searchText} onChange={(e) => setSearchText(e.target.value)} className='search-input' placeholder="请输入球队名称" prefix={<SearchOutlined />} />
            <div className="main-wrap">
              {
                !searchText?.trim() && searchHistory[sportId] &&
                <div className="search-history">
                  <div className='search-match-type flex items-center justify-between'>
                    <span>搜索历史</span>
                    <span className='clear' onClick={clearSearchHistory}>清除搜索历史</span>
                  </div>
                  {
                    searchHistory[sportId]?.map((item) => (
                      <div className='search-item flex items-center justify-between' onClick={() => onClickHistory(item)} key={item}>
                        {item}
                        <DpIcon type='del' onClick={(e) => onClear(e, item)} />
                      </div>
                    ))
                  }
                </div>
              }
              {
                searchText?.trim() &&
                <div className="search-match-list">
                  {
                    list && [1, 0].map((key) => (
                      _.groupBy(list, 'ip')[key] &&
                      <React.Fragment key={key}>
                        <div className="search-match-type">
                          {Number(key) === 0 ? '未开赛' : '滚球中'}
                        </div>
                        <div className="match-list">
                          {
                            _.groupBy(list, 'ip')[key].map((match) => (
                              <div className="search-item" key={match.mid} onClick={() => handleOpenDetail(match.mid)}>
                                <p>{`${match.ht.tn} v ${match.at.tn}`}</p>
                                <p>
                                  {match.ip === 1 && !!match.pd ? getMatchStatusByPeriod(match.pd) : dayjs(match.bt).format('MM月DD日 HH:mm')}
                                </p>
                              </div>
                            ))
                          }
                        </div>
                      </React.Fragment>
                    ))
                  }
                  {
                    searchText && list !== null && list.length === 0 &&
                      <div className='empty-wrapper center'>
                        <Empty description="暂无数据" />
                      </div>
                  }
                </div>
              }
            </div>
          </div>
        </Overlay>
      }
    </div>
  );
};
