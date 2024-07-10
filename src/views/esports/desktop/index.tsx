import App from '@core/templates/desktop/app';
import Routes from './pages/Routes';
import initSentry from '@core/utils/initSentry';

initSentry('pc');

App(Routes);
