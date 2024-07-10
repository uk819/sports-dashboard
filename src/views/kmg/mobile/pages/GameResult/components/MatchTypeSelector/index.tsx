/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 12:40:58
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/TypeSelector/index.tsx
 * @Description:
 */

import DpIcon from '@views/kmg/mobile/components/Icon';
import css from './style.scss';
import classnames from 'classnames';
import {useCallback, useEffect, useMemo, useState} from 'react';
import dayjs from 'dayjs';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import {DatePickerProps, WeekArr} from './../../type';
export default React.memo((props:DatePickerProps) => {
  const [selectIndex] = useState(0);
  const {emit: showDateEmit} = useEventEmitter<TMitt['showDatePick']>({mittName: 'showDatePick'});

  useEffect(() => {
    showDateEmit({display: selectIndex === 2});
  }, [selectIndex]);

  const onBack = () => {
    window.history.go(-1);
  };

  return (
    <>
      <div className={css.wrapper}>
        <div className="go-back" onClick={onBack}>
          <DpIcon type="arrow" />
        </div>
        <div className='navbar'>
          <div className={classnames('text-wrapper')} >赛果</div>
        </div>
      </div>
    </>
  );
});

export const DatePicker = React.memo((props: DatePickerProps) => {
  const [index, setIndex] = useState(0);
  const week = useMemo(()=> {
    return _.times(8).splice(1).map((i) => ({
      name: dayjs().subtract(i, 'day').format('MM/DD'),
      time: dayjs().subtract(i, 'day').format('YYYY/MM/DD'),
    }));
  }, []);
  const dates:WeekArr[] = useMemo(()=> {
    return [{name: '今日', time: dayjs().format('YYYY/MM/DD')}, ...week];
  }, []);
  const handleClick = useCallback((idx: number) => {
    props.handelGetTime(dates[idx].time);
    setIndex(idx);
  }, []);
  useEffect(() => {
    setIndex(0);
  }, [props.sportId]);
  return (
    <div className="date-list">
      {
        dates.map((item, idx) => (
          <div className={classnames('option-item', {active: idx === index})} onClick={() => handleClick(idx)} key={item.name}>{item.name}</div>
        ))
      }
    </div>
  );
});
