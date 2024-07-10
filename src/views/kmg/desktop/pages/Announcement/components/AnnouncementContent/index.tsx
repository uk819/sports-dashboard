import styles from './style.scss';
import ContentItem from './ContentItem';
import {AnnouncementDetail} from '@core/apis/models/announcement';
import {isUndefined} from 'lodash';
import {ESportType} from '@core/constants/enum/sport';
import Blank from './Blank';
type IProps = {
  contents: Array<AnnouncementDetail>
  title: number,
}

export default function Sidebar({contents, title} : IProps) {
  const categories: {[key: number]: string;} = {
    0: '所有公告',
    [ESportType.FOOTBALL]: '足球',
    [ESportType.BASKETBALL]: '篮球',
    [ESportType.TENNIS]: '网球',
    [ESportType.VOLLEYBALL]: '排球',
    [ESportType.DOTA]: 'DOTA 2',
    [ESportType.CSGO]: 'CS2',
    [ESportType.LOL]: '英雄联盟',
    [ESportType.KING]: '王者荣耀',
  };
  return (
    <div className={styles.wrapper} >
      <div className='announce-title'>
        {title === 0 ? categories[title] : categories[title]+'赛事'}
      </div>
      <ul className='announce-content'>
        {!isUndefined(contents) && contents.length>0 ? title === 0 ? contents.map((value, index) => (
          <ContentItem key={`content-item-${index}`} title={value.billClassify === 0 ? value.billboardTitleCn : categories[value.billClassify] ?? ''+'赛事'} type={value.billboardTypeCn} content={value.billboardContentCn} created={value.updatedAt} istitle={true}/>
        )): contents.map((value, index) => (
          <ContentItem key={`content-item-${index}`} title={value.billClassify === 0 ? value.billboardTitleCn : categories[value.billClassify] ?? ''+'赛事'} type={value.billboardTypeCn} content={value.billboardContentCn} created={value.updatedAt} istitle={false}/>
        )) : <Blank/>}
      </ul>
    </div>
  );
}

