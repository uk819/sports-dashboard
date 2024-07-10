/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/index.tsx
 * @Description:
 */
// @ts-nocheck
import App from '@core/templates/mobile/app';
import Routes from './pages/Routes';
import initReactFastclick from 'react-fastclick';
import initSentry from '@core/utils/initSentry';

initReactFastclick();
initSentry('h5');

App(Routes);
