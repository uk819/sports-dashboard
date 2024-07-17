/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/SportTypeSelector/index.tsx
 * @Description:
 */
import {useCallback, useState, useEffect} from 'react';
import classnames from 'classnames';
import {GamesType, DatePickerProps} from './../../type';
import style from './style.module.scss';
import {TGameResultCounts} from '@core/reducers/_reduxStore';

export default function({sportId, handleSportId, opts, counts}: DatePickerProps) {
  const [index, setIndex] = useState(0);
  const onClick = useCallback((idx: number, item: GamesType) => {
    handleSportId(item.value);
    setIndex(idx);
  }, []);

  useEffect(() => {
    const inSportTypeRange = opts.findIndex((item) => item.value === sportId);
    if (inSportTypeRange > -1) {
      setIndex(inSportTypeRange);
    } else {
      setIndex(-1);
    }
  }, [sportId, opts]);

  return (
    <div className={style.wrapper}>
      {opts.map(
          (item, idx) =>
            item && (
              <div
                className={classnames(style.type_item, {[style.active]: idx === index})}
                onClick={() => onClick(idx, item)}
                key={item.value}>
                <p className={style.count}>{counts[item.value as keyof TGameResultCounts] || 0}</p>
                <div className={classnames(style.sport_logo, style[`sid_${item?.value}`])}></div>
                <p className={style.label}>{item.label}</p>
              </div>
            ),
      )}
    </div>
  );
}
