/**
 * @Author: Weima.KMG
 * @Date: 2024-01-09
 * @LastEditors: Weima.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/GamesResult/components/OptionBar/index.tsx
 * @Description:
 */
import {ReactNode} from 'react';
import {DpDateRangePicker, DpIcon, DpSelect} from '@this/components';
import styles from './style.scss';
import {Button, Checkbox, CheckboxProps, Input, Space, Select, Radio} from 'antd';
import useSettings from '@core/hooks/sports/useSettings';
import dayjs, {Dayjs} from 'dayjs';
import {dateFormat} from '@views/kmg/desktop/components/DateRangePicker';
import useGamesResultInit from '@core/hooks/sports/useGamesResultInit';
import {isESports} from '@core/utils';
import {EESportType} from '@core/constants/enum/sport';
import {useGameResultListData} from '@core/hooks/sports/useRenderData';
import {SearchOutlined} from '@ant-design/icons';
import classnames from 'classnames';
import TStore, {TGameResultPageInfo} from '@core/reducers/_reduxStore';
import {useSelector} from 'react-redux';
export const ActionTag = ({title, children}: {title: string, children: ReactNode}) => {
  return (
    <div className="action-tag">
      <span>{title}</span>
      {children}
    </div>
  );
};

const {Option} = Select;
interface Option {
  value: string;
  label: string;
  id: number;
}

interface IProps {
  options: Option[];
  className: string;
  pageInfo: TGameResultPageInfo;
  setPageInfo: (value: TGameResultPageInfo)=> void;
  switchGameResultPageInfo: (pageInfo: TGameResultPageInfo) => void;
  getChampionResult: any;
}

export const CustomSelect = ({options, className, pageInfo, setPageInfo, switchGameResultPageInfo, getChampionResult}: IProps) => {
  const [value, setValue] = React.useState<string[]>(null);
  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);
  const [selectAll, setSelectAll] = React.useState(false);
  const [invertSelection, setInvertSelection] = React.useState(false);
  const [selectPopular, setSelectPopular] = React.useState(false);
  const [leagueIds, setLeagueIds] = React.useState<number[]>(null);

  React.useEffect(() => {
    const initialValues = options.map((option) => option.value);
    const initialIds = options.map((option) => option.id);
    if (selectAll) {
      setValue(initialValues);
      setLeagueIds(initialIds);
      setSelectAll(true);
    }
  }, [dropdownOpen]);

  React.useEffect(() => {
    setPageInfo({...pageInfo, leagueNameIds: leagueIds, popularType: selectPopular ? 1: 0, pageNum: 1});
  }, [value, selectPopular, leagueIds, selectPopular, dropdownOpen]);

  React.useEffect(()=> {
    setSelectAll(true);
    setInvertSelection(false);
    setSelectPopular(false);
  }, [dropdownOpen]);

  const handleSelectAll = () => {
    setValue(options.map((option) => option.value));
    setLeagueIds(options.map((option)=> option.id));
    setSelectAll(true);
    setInvertSelection(false);
    setSelectPopular(false);
  };
  const handleSelectPopular = () => {
    setValue(null);
    setLeagueIds(null);
    setSelectPopular(true);
    setSelectAll(false);
    setInvertSelection(false);
  };

  const handleInvertSelection = () => {
    const newValue = options.filter((option) => !value?.includes(option.value)).map((option) => option.value);
    setValue(newValue);
    const newIds = options.filter((option) => newValue?.includes(option.value)).map((option) => option.id);
    setLeagueIds(newIds);
    setSelectAll(false);
    setInvertSelection(true);
    setSelectPopular(false);
  };

  const handleChange = (selectedValues: string[]) => {
    setValue(selectedValues);
    const ids = options?.filter((option)=> selectedValues.includes(option.value)).map((opt)=> opt.id);
    setLeagueIds(ids);
  };

  const handleOk = () => {
    if (pageInfo.sportId !== 999) {
      switchGameResultPageInfo(pageInfo);
    } else {
      const {sportId: _, ...pageInfoWithoutSportId} = pageInfo;
      getChampionResult(pageInfoWithoutSportId);
    }
    setDropdownOpen(false);
  };
  const handleCancel = () => {
    setDropdownOpen(false);
    setValue(null);
    setLeagueIds(null);
    setSelectAll(false);
  };

  return (
    <div className={className}>
      <Select
        mode="multiple"
        value={value}
        onChange={handleChange}
        placeholder={!dropdownOpen ? '选择联赛' : '请输入查询'}
        suffixIcon={!dropdownOpen && <span className={classnames('icon-group', {'selected': value?.length > 0})} onClick={() => setDropdownOpen(!dropdownOpen)}>{value?.length > 0 ? '已筛选': '全部'} <DpIcon className='arrow-icon' type='arrow'/></span>}
        maxTagCount={1}
        // maxTagPlaceholder={()=> null}
        open={dropdownOpen}
        onDropdownVisibleChange={(open) => setDropdownOpen(open)}
        dropdownRender={(menu) => (
          <>
            <div className='select-header'>
              <Radio checked={selectAll} onClick={handleSelectAll}>全选</Radio>
              <Radio checked={selectPopular} onClick={handleSelectPopular}>热门</Radio>
              <Radio checked={invertSelection} onClick={handleInvertSelection}>反选</Radio>
            </div>
            {menu}
            <div className='select-footer'>
              <div className='count'>已选<span className='selected'>{value?.length || 0}</span>/{options?.length}场</div>
              <div className='btn-group'>
                <Button onClick={handleCancel}>取消</Button>
                <Button onClick={handleOk}>确认</Button>
              </div>
            </div>
          </>
        )}
      >
        {options.map((option) => (
          <Option key={option.id} value={option.value}>
            <Checkbox checked={value?.includes(option.value)} style={{marginRight: 8}} />
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};


export default React.memo(() => {
  const {switchGameResultPageInfo, getChampionResult} = useSettings();
  const {loading, pageInfo, setPageInfo, gameResultOpts}= useGamesResultInit();
  const {gameResultLeagues} = useGameResultListData();
  const {sportId} = useSelector((state: TStore) =>state.sport.userSettings.gameResultPageInfo);
  const handleSearch = () => {
    if (sportId !== 999) {
      switchGameResultPageInfo(pageInfo);
    } else {
      const {sportId: _, ...pageInfoWithoutSportId} = pageInfo;
      getChampionResult(pageInfoWithoutSportId);
    }
  };
  const handleRolling: CheckboxProps['onChange'] = (e) => {
    if (e.target.checked) {
      switchGameResultPageInfo({...pageInfo, ip: 1, pageNum: 1});
    } else {
      switchGameResultPageInfo({...pageInfo, ip: 0, pageNum: 1});
    }
  };
  const handleChangeSportId = (sportId: number) => {
    if (sportId !==999) {
      if (sportId !== pageInfo.sportId) {
        switchGameResultPageInfo({...pageInfo, ip: 0, pageNum: 1, sportId});
      }
    } else {
      const {sportId: _, ...pageInfoWithoutSportId} = pageInfo;
      getChampionResult({...pageInfoWithoutSportId, ip: 0, pageNum: 1});
    }
  };
  React.useEffect(() => {
    if (isESports()) {
      switchGameResultPageInfo({...pageInfo, ip: 0, pageNum: 1, sportId: EESportType.LOL});
    }
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className="action-bar">
        {/* 体育类型选择 */}
        <ActionTag title={isESports() ? '电竞' : '体育'}>
          <DpSelect
            className='game-select'
            value={pageInfo.sportId || gameResultOpts[0].value}
            options={gameResultOpts}
            onChange={handleChangeSportId}
          />
        </ActionTag>

        {/* 日期选择 */}
        <ActionTag title='日期'>
          <DpDateRangePicker
            value={[dayjs(pageInfo.beginTime), dayjs(pageInfo.endTime)]}
            handleChange={(dates: Array<Dayjs>) => {
              let [beginTime, endTime] = dates;
              if (beginTime.valueOf() - endTime.valueOf() > 0) {
                [beginTime, endTime] = [endTime, beginTime];
              }
              setPageInfo({
                ...pageInfo,
                beginTime: beginTime?.format(dateFormat),
                endTime: endTime?.format(dateFormat),
                pageNum: 1,
              });
            }}
          />
        </ActionTag>

        {/* 联赛搜索 */}
        <ActionTag title=''>
          {/* <DpSelect
            className='game-select'
            value={pageInfo.sportId || gameResultOpts[0].value}
            options={gameResultLeagues}
            onChange={handleChangeSportId}
          /> */}
          {/* <DpSearchInput
            placeholder='请输入关键字搜索'
            value={pageInfo.leagueName?.trim() || ''}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => setPageInfo({ ...pageInfo, leagueName: e.target.value, pageNum: 1 })}
          /> */}
          <CustomSelect className='league-select' options={gameResultLeagues} pageInfo={pageInfo} setPageInfo={setPageInfo} switchGameResultPageInfo={switchGameResultPageInfo} getChampionResult={getChampionResult}/>
        </ActionTag>

        {/* 赛事 */}
        {sportId !== 999 &&<ActionTag title=''>
          {/* <DpInput
            className='game-event'
            placeholder='请输入'
            value={pageInfo.matchName?.trim() || ''}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => setPageInfo({...pageInfo, matchName: e.target.value, pageNum: 1})}
          /> */}
          <Space.Compact >
            <Input
              className={classnames('game-event', {'is-button': pageInfo.matchName?.trim()})}
              placeholder='请输入关键字'
              value={pageInfo.matchName?.trim() || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPageInfo({...pageInfo, matchName: e.target.value, pageNum: 1})}
              prefix={pageInfo.matchName?.trim() ? null : <><SearchOutlined /><span>搜比赛</span></>}
            />
            {pageInfo.matchName?.trim() ? <Button onClick={handleSearch}>搜索</Button> : null}
          </Space.Compact>
        </ActionTag>}

        {/* 滚球 */}
        {sportId !== 999 &&<Checkbox checked={!!pageInfo.ip} onChange={handleRolling}>滚球</Checkbox>}

        {/* 精彩回放 */}
        {/* <Checkbox onChange={() => console.log('精彩回放')}>精彩回放</Checkbox> */}
      </div>
      <div className="helper-bar">
        {/* <button type='button' className='helper-btn' onClick={handleHelp}><IconHelper /></button> */}
        <Button className='search-btn' onClick={handleSearch} loading={loading}>搜索</Button>
      </div>
    </div>
  );
});
