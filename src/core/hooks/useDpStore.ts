import {store as pcStore} from '@core/templates/desktop/app';
import {store as h5Store} from '@core/templates/mobile/app';
import {isMobile} from '@core/utils';

const getDpStore = () => {
  return isMobile() ? h5Store : pcStore;
};

export default getDpStore;
