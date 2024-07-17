/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: jspassion@itcom888.com
 * @FilePath: /KMG/src/views/mc/desktop/index.tsx
 * @Description:
 */
// @ts-nocheck
import App from '@core/templates/desktop/app';
import Routes from './pages/Routes';
import initSentry from '@core/utils/initSentry';

initSentry('pc');

App(Routes);
