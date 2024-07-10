import {Modal, Button} from 'antd';
import classnames from 'classnames';
import styles from './style.scss';
export interface PopupProps {
  open: boolean;
  loading?: boolean;
  onOk?: () => void;
  onCancel: () => void;
  onSelect: (mode: number) => void;
  mode: number;
}
const BettingModeModalPopup = (props: PopupProps) => {
  const {open, loading, onSelect} = props;
  const [selectedMode, setSelectedMode] = React.useState<number>(null);
  const handleModeChange = (type: number) => {
    setSelectedMode(type);
    setTimeout(() => {
      onSelect(type);
    }, 100);
  };

  return (
    <>
      <Modal centered open={open} className={classnames(styles.modal)} footer={null}>
        <div
          className={'mode mode-professional ' + (selectedMode === 0 ? 'mode-selected' : '')}
          onClick={() => handleModeChange(0)}

        >
          <div className='description'>
            <h4>专业版</h4>
            <p>功能完善,实用性强</p>
          </div>
          <div className="back-img"></div>
          <Button type='primary' onClick={()=> handleModeChange(0)} loading={loading}>
            使用
          </Button>
        </div>
        <div
          className={'mode mode-new ' + (selectedMode === 1 ? 'mode-selected' : '')}
          onClick={() => handleModeChange(1)}>
          <div className='description'>
            <h4>新手版</h4>
            <p>页面简洁,操作简单</p>
          </div>
          <div className="back-img"></div>
          <Button type='primary' onClick={()=>handleModeChange(1)} loading={loading}>
          使用
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default BettingModeModalPopup;
