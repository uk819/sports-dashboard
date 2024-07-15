/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 12:40:58
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/TypeSelector/index.tsx
 * @Description:
 */

import DpIcon from '@views/kmg/mobile/components/Icon';
import classnames from 'classnames';
import {useCallback, useEffect, useMemo, useState} from 'react';
import dayjs from 'dayjs';
import {DatePickerProps, MatchTypeProps, WeekArr} from './../../type.d';
import style from './style.module.scss';

export default React.memo(({matchType, setMatchType}: MatchTypeProps) => {
  const displayTypes = ['体育赛果', '电子竞技', '冠军赛果'];
  const onBack = () => {
    window.history.go(-1);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.go_back} onClick={onBack}>
        <DpIcon type='arrow' />
      </div>
      <div className={style.navbar}>
        {displayTypes.map((val, key) => (
          <div
            key={key}
            className={classnames(style.text_wrapper, {[style.active]: matchType === key})}
            onClick={() => setMatchType(key)}>
            {val}
          </div>
        ))}
      </div>
    </div>
  );
});

export const DatePicker = React.memo((props: DatePickerProps) => {
  const [index, setIndex] = useState(0);
  const week = useMemo(() => {
    return _.times(8)
        .splice(1)
        .map((i) => ({
          name: dayjs().subtract(i, 'day').format('MM-DD'),
          time: dayjs().subtract(i, 'day').format('YYYY/MM/DD'),
        }));
  }, []);
  const dates: WeekArr[] = useMemo(() => {
    return [{name: '今日', time: dayjs().format('YYYY/MM/DD')}, ...week];
  }, []);
  const handleClick = useCallback((idx: number) => {
    props.handelGetTime(dates[idx].time);
    setIndex(idx);
  }, []);
  useEffect(() => {
    const inDateRange = dates.findIndex((date) => date.time === props.currentTime);
    if (inDateRange > -1) {
      setIndex(inDateRange);
    } else {
      setIndex(-1);
    }
  }, [props.currentTime]);
  return (
    <div className={style.date_list}>
      {dates.map((item, idx) => (
        <div
          className={classnames(style.option_item, {[style.active]: idx === index})}
          onClick={() => handleClick(idx)}
          key={item.name}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
