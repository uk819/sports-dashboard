/*
 * @Author: Spectrum.KMG
 * @Date: 2024-01-09 17:02:07
 * @LastEditors: Spectrum.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/Announcement/index.tsx
 * @Description:
 */

import Sidebar from './components/Sidebar';
import Content from './components/AnnouncementContent';
import styles from './style.scss';
import useAnnouncementHooks from '@core/hooks/dashboard/useAnnouncementHooks';
import {useEffect, useState} from 'react';
import {AnnouncementDetail} from '@core/apis/models/announcement';
import {isUndefined} from 'lodash';

export default () => {
  const announcement = useAnnouncementHooks(true);
  const [category, setCategory] = useState<number>(0);
  const [contents, setContent] = useState<Array<AnnouncementDetail>>();
  useEffect(()=>{
    if (!isUndefined(announcement)) {
      if (category === 0) {
        setContent(announcement.filter((item)=> item.status === 1));
      } else {
        setContent(announcement.filter((item)=> item.status === 1 && category === item.billClassify));
      }
    }
  }, [category, announcement]);
  return (
    <div className={styles.wrapper}>
      <div className='container'>
        <Sidebar selected={category} onClick={(id)=>{
          setCategory(id);
        }}/>
        <Content contents={contents} title={category}/>
      </div>
    </div>
  );
};
