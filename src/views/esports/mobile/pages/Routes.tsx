/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/Routes.tsx
 * @Description:
 */
import {HashRouter, Route, Switch} from 'react-router-dom';
import Framework from '@core/templates/mobile/Framework';
import {ConfigProvider} from 'antd';
import Home from './Home';
import usePublicState from '@core/hooks/usePublicState';

function Routers() {
  const {dispatch, ACTIONS} = usePublicState();
  React.useEffect(() => {
    dispatch(ACTIONS.BASE.getConfig());
  }, []);
  React.useEffect(() => {
    document.documentElement.setAttribute('data-client', 'mobile');
  }, []);

  return (
    <ConfigProvider>
      <HashRouter>
        <Framework>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </Framework>
      </HashRouter>
    </ConfigProvider>
  );
}

export default Routers;
