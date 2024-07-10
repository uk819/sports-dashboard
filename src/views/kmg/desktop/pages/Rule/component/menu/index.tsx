import classNames from 'classnames';
import styles from './style.scss';
import {IData} from '../detail/data';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import {useMemo} from 'react';
import usePublicState from '@core/hooks/usePublicState';
import {useMount} from 'react-use';
import {menuList} from './data';
import {isESports} from '@core/utils';

export interface IProps {
  title: string;
  onClick?: () => void;
  tdata?: IData;
}

interface IDpMenuItemProps extends IProps {
  isSelected: boolean;
  className?: string;
}

interface IDpMenuProps{
  selectedItem: number;
  selectItem: (index: number) => void;
}

const DpMenuItem = ({title, isSelected, onClick, className}: IDpMenuItemProps) => {
  return (
    <div
      className={classNames(styles.DpMenu, 'menu-item', {'selected': isSelected}, className)}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

const DpMenu = ({selectedItem, selectItem}:IDpMenuProps) => {
  const sportList = useSelector((state: TStore) => state.sport.display.matchStatistics);
  const list = useMemo(() => sportList, [sportList]);
  const {dispatch, ACTIONS} = usePublicState();
  useMount(()=> {
    dispatch(ACTIONS.SPORT.getMatchStatistics({
      params: {querys: undefined},
    }));
    if (isESports()) {
      selectItem(menuList.findIndex((item) => item.title === '电子竞技'));
    }
  });

  return (
    <div className={classNames(styles.menuWrapper)}>
      {menuList.map((item, idx) => (
        ((list?.filter((list) => list.count > 0).find((list)=> list.sportName === item.title) || ['一般体育说明', '连串过关/复式过关/组合过关', '预约投注', '电子竞技'].includes(item.title)) && item.tdata) || item.title === '投注教程' ? (
          <DpMenuItem
            className={classNames({'dp-hidden': isESports() && !['预约投注', '电子竞技'].includes(item.title)})}
            {...item}
            key={idx}
            isSelected={selectedItem === idx}
            onClick={() => selectItem(idx)}
          />
        ) : null
      ))}
    </div>
  );
};

export default DpMenu;

