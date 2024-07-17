import TStore from '@core/reducers/_reduxStore';
import Overlay from '@template/components/Overlay';
import {useSelector} from 'react-redux';
import SettingCart from './SettingCart';
import useSettings from '@core/hooks/sports/useSettings';
import {useEffect, useState} from 'react';
import style from './style.scss';
import {SportPopup} from '@core/constants/enum/common';


export default () => {
  const isOpen = useSelector((state: TStore) => state.sport.popUp) === SportPopup.SETTING;
  const {handlePopUp} = useSettings();
  const [open, setOpen] = useState(isOpen);
  let timer: any = null;

  useEffect(()=>{
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    if (isOpen) {
      clearTimeout(timer);
      timer = setTimeout(()=>{
        handlePopUp(SportPopup.CLOSE);
      }, 100);
    }
  };
  return (
    <>
      {open ?
      <Overlay display maskClickClose={true} zIndex={10} close={() => handleClose()} className={style.overlaywrapper}>
        <div className={`${style.wrapper} ${open ?' active' : 'hidden'}`}>
          <div className='close' onClick={handleClose} />
          <SettingCart onClose = {handleClose} />
        </div>
      </Overlay> :
      null}
    </>
  );
};
