import ConfirmModal from './confirmModal';
import AlertModal4 from './alert4';
import AlertModal5 from './alert5';
import {useDispatch, useSelector} from 'react-redux';
import ACTIONS from '@actions/index';
import {PopupTypeEnum} from '@core/constants/enum/common';
import AlertModal1 from './tipModalNotice/tipModalNotice1';
import AlertModal2 from './tipModalNotice/tipModalNotice2';
import AlertModal3 from './tipModalNotice/tipModalNotice3';

export interface PopupProps {
  loading?: boolean;
  onOk?: () => void;
  onCancel: () => void;
  title?: string;
  content?: string | object | Array<string>;
  actions: any[];
  open: boolean;
}
interface PopupModals {
  [key: number]: React.FunctionComponent<PopupProps>;
}

const popupModals: PopupModals = {
  [PopupTypeEnum.CONFIRM]: ConfirmModal,
  [PopupTypeEnum.ALERT1]: AlertModal1,
  [PopupTypeEnum.ALERT2]: AlertModal2,
  [PopupTypeEnum.ALERT3]: AlertModal3,
  [PopupTypeEnum.ALERT4]: AlertModal4,
  [PopupTypeEnum.ALERT5]: AlertModal5,
};

const PopupModal = () => {
  const {display, title, content, actions, type} = useSelector((state: any) => state.base.modal);
  const dispatch = useDispatch();
  const close = () => dispatch(ACTIONS.BASE.closeModal());
  const actionsClone = _.chain(actions).cloneDeep().value();
  const Component = popupModals[type];
  const [open, setOpen] = React.useState(false);
  const handleCancel = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    if (!open) {
      close();
    }
  }, [open]);
  React.useEffect(() => {
    if (display) {
      setOpen(true);
    }
  }, [display]);
  return display ? (
    <Component onCancel={handleCancel} actions={actionsClone} title={title} content={content} open={open} />
  ) : (
    <></>
  );
};

export default PopupModal;
