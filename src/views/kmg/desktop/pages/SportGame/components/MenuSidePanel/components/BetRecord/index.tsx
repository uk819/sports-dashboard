import {EOrderTypeStatus} from '@core/constants/enum/sport';
import style from './style.scss';
import DpIcon from '@views/kmg/desktop/components/Icon';
import BetRecord from './betRecord';
import ReserverRecord from './reserverRecord';
import {Radio} from 'antd';
interface IProps {
  hideBetRecord: () => void;
}
const betTypes :any = [
  {label: '未结算', key: EOrderTypeStatus.UNSETTLED, value: EOrderTypeStatus.UNSETTLED},
  {label: '已结算', key: EOrderTypeStatus.SETTLED, value: EOrderTypeStatus.SETTLED},
  {label: '预约', key: EOrderTypeStatus.RESERVER, value: EOrderTypeStatus.RESERVER},
];
export default React.memo(({hideBetRecord}: IProps) => {
  const [betType, setBetType] = React.useState(EOrderTypeStatus.UNSETTLED);
  return (
    <div className={style.wrapper}>
      <div className='menu-item'>
        <img src={require('../../i/icon-bet-record.png')} />
        <span className='name'>投注记录</span>
      </div>
      <div className='go-back' onClick={hideBetRecord}>
        <DpIcon type='goback' />
        <span>返回联赛导航</span>
      </div>
      <div className='switch-type'>
        <Radio.Group
          options={betTypes}
          onChange={(e)=>setBetType(e.target.value)}
          value={betType}
          optionType='button'
          buttonStyle="solid"
        />
      </div>
      {betType!== EOrderTypeStatus.RESERVER && <BetRecord betType={betType}/>}
      {betType=== EOrderTypeStatus.RESERVER && <ReserverRecord betType={betType}/>}
    </div>
  );
});
