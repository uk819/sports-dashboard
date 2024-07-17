import usePublicState from '@core/hooks/usePublicState';
import {ConfigProvider} from 'antd';
import Framework from '@core/templates/desktop/Framework';
import {HashRouter, Switch, Route} from 'react-router-dom';
import Header from '@this/components/Header';
import Home from './Home';

function Routers() {
  const {dispatch, ACTIONS} = usePublicState();
  React.useEffect(() => {
    dispatch(ACTIONS.BASE.getConfig());
  }, []);
  return (
    <ConfigProvider>
      <HashRouter>
        <Framework>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </Framework>
      </HashRouter>
    </ConfigProvider>
  );
}

export default Routers;
