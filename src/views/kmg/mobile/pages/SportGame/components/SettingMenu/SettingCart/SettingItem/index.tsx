import SwitchButton from '@core/templates/mobile/components/SwitchButton';
import {SettingItemType} from '..';
import {useHistory} from 'react-router-dom';
import style from './style.scss';

export default ({setting}: {setting: SettingItemType}) => {
  const {text, options, value, set, url=null} = setting;
  const history = useHistory();
  const HandleJump =()=> {
    url&&history.push(url);
  };
  return (
    <div className={style.wrapper} onClick={HandleJump}>
      <span>{text}</span>
      {options && set ? (
          <SwitchButton
            className='switch-btn'
            options={options}
            checked={value || options[0].value}
            onChange={set}
          />
      ) : (
          <img src={require('../../i/arrow-right.png')} alt="" />
          // <div className='link-ietm'>
          //   <img src={require('../../i/icon-earth.png')} alt="" />
          //   <span className='link-text'>前往网页版</span>
          // </div>
      )}
    </div>
  );
};
