import {BET_RESULT_TYPE_MAP} from '@core/constants/enum/sport';
import style from '../style.module.scss';
import classnames from 'classnames';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import IStore from '@core/reducers/_reduxStore.d';
import usePublicState from '@core/hooks/usePublicState';

interface Props {
  data?: any[];
  title?: string;
  showAll?: boolean;
  itemRef?: any
}
const ResultItem = React.memo(({data, title, showAll, itemRef}: Props) => {
  const {pins} = useSelector((state: IStore) => state.sport.display);
  const {dispatch, ACTIONS} = usePublicState();
  const [showBet, setShowBet] = useState(true);
  const getClassName = (key: string) => {
    if (key === BET_RESULT_TYPE_MAP[4] || key === BET_RESULT_TYPE_MAP[5]) {
      return style.win;
    } else if (key === BET_RESULT_TYPE_MAP[3] || key === BET_RESULT_TYPE_MAP[6]) {
      return style.lose;
    } else {
      return style.widthraw;
    }
  };
  const handleAddPin = () => {
    const tmp = [...pins];
    tmp.push(title);
    dispatch(ACTIONS.SPORT.updatePins({data: tmp}));
  };
  const handleDelPin = () => {
    dispatch(ACTIONS.SPORT.updatePins({data: pins.filter((x) => x !== title)}));
  };
  useEffect(() => {
    setShowBet(showAll);
  }, [showAll]);
  return (
    <div ref={itemRef} className={classnames(style.resultItem, pins.includes(title) ? style.pins : '')}>
      <div className={style.title}>
        {title}
        <div className={style.control}>
          <div>
            {pins.includes(title) ? (
              <img onClick={handleDelPin} src={require('../i/pin_active.png')} alt="" />
            ) : (
              <img onClick={handleAddPin} src={require('../i/pin.png')} alt="" />
            )}
          </div>
          <div onClick={() => setShowBet(!showBet)}>
            {!showBet ? (
              <img src={require('../i/down1.png')} alt="" />
            ) : (
              <img src={require('../i/top.png')} alt="" />
            )}
          </div>
        </div>
      </div>
      {showBet&& (
        <div className={classnames(style.content, data.length === 1 ? style.col1 : data.length === 2 ? style.col2 : style.col3)}>
          {data.map((item, index) => (
            <div className={style.item} key={index}>
              <p>{item.hoa + item.h}</p>
              <p className={getClassName(item.r)}>{item.r}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default ResultItem;
