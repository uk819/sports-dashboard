import styles from './style.scss';
import MenuItem from './MenuItem';
import {ESportType} from '@core/constants/enum/sport';
import {isESports} from '@core/utils';

type IProps = {
  selected: number,
  onClick: (id: number)=>void,
}

export default function Sidebar({selected, onClick}: IProps) {
  const categories: {[key: number]: string;} = React.useMemo(() => {
    return isESports() ? {
      0: '所有公告',
      [ESportType.DOTA]: 'DOTA 2',
      [ESportType.CSGO]: 'CS2',
      [ESportType.LOL]: '英雄联盟',
      [ESportType.KING]: '王者荣耀',
    } : {
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
  }, []);
  return (
    <div className={styles.wrapper}>
      <ul>
        {Object.entries(categories).map(([index, value]) => (
          parseInt(index) === selected?
          <MenuItem key={`menu-item-${index}`} text={value} className='active' onClick={()=> onClick(parseInt(index))} />:
          <MenuItem key={`menu-item-${index }`} text={value} onClick={()=> onClick(parseInt(index))} />
        ))}
      </ul>
    </div>
  );
}
