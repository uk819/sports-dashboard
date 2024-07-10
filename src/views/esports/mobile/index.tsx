import App from '@core/templates/mobile/app';
import Routes from './pages/Routes';
import initReactFastclick from 'react-fastclick';
import initSentry from '@core/utils/initSentry';

initReactFastclick();
initSentry('h5');

App(Routes);
