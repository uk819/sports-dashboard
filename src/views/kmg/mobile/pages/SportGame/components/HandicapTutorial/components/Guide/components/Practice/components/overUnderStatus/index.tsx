import DpIcon from '@views/kmg/mobile/components/Icon';
import css from './style.scss';
import classnames from 'classnames';
import {useEffect, useState} from 'react';

export default ({type, setSelectItem, selectItem, next}: {type: '大' | '小', setSelectItem: (v: string)=> void, selectItem: string, next: string}) => {
  const [overUnder, setOverUnder] = useState<string[]>([]);
  const handleSelected = ()=> {
    setSelectItem(type);
    if (type === '大') {
      setOverUnder([...overUnder, 'over']);
    } else {
      setOverUnder([...overUnder, 'under']);
    }
  };

  useEffect(()=> {
    setOverUnder([]);
  }, [next]);

  return (
    <div className={classnames(css.wrapper, selectItem === '大'? (type === '大' &&'over-border') : (selectItem === '小'&& type === '小' &&'under-border' ), overUnder.includes('over') && type === '大' && 'over-bg', overUnder.includes('under') && type === '小' && 'under-bg')} onClick={handleSelected}>
      {overUnder.includes('over') && type === '大' && <img src={require(`./i/cancel-icon.webp`)} alt="over-under-icon" />}
      {overUnder.includes('under') && type === '小' && <img src={require(`./i/ok-icon.webp`)} alt="over-under-icon" />}
      <div className='text'>{type} {!next ? '2.5' : '2/2.5'}</div>
      <div className='value'>
        <DpIcon className={classnames({'rotate': type === '大'})} type='arrowDown' fill={`${type === '大' ? '#F53F3F' : '#00B42A'}`} />
        <span className={classnames(type !== '大' && 'under')}>{type === '大' ? '1.99' : '1.25'}</span>
      </div>
    </div>
  );
};
