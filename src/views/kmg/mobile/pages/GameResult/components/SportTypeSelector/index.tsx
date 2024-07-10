/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/SportTypeSelector/index.tsx
 * @Description:
 */
import {useCallback, useState} from 'react';
import classnames from 'classnames';
import {DatePickerProps} from './../../type';
import useGamesResultInit from '@core/hooks/sports/useGamesResultInit';
import dayjs from 'dayjs';
import {GamesType} from './../../type';
import styles from './style.scss';

const gameResultPageInfo = {
  sportId: 1,
  beginTime: dayjs().format('YYYY/MM/DD'),
  endTime: dayjs().format('YYYY/MM/DD'),
  pageNum: 1,
  pageSize: 1000,
};

export default function({handleSportId, handelGetTime}:DatePickerProps) {
  const {gameResultOpts}= useGamesResultInit(gameResultPageInfo, 'saiguo');
  const [index, setIndex] = useState(0);
  const onClick = useCallback((idx:number, item: GamesType) => {
    handleSportId(item.value);
    handelGetTime(dayjs().format('YYYY/MM/DD'));
    setIndex(idx);
  }, []);
  return (
    <div className={styles.wrapper}>
      {gameResultOpts.map((item, idx) => (
        item &&
        <div
          className={'sport-type-item'}
          onClick={() => onClick(idx, item)}
          key={item.value}>
          <div className={classnames('sport-logo', `sid-${item?.value}`, {active: idx === index})}>
          </div>
          <p className={`${idx === index ? 'active' : ''}`}>{item.label}</p>
        </div>
      ))}
    </div>
  );
}
