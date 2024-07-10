import TStore from '@core/reducers/_reduxStore';
import {useSelector} from 'react-redux';
import useProfile from './useProfile';
import {useRef} from 'react';

export default () => {
  const token = useSelector((state: TStore) => state.user.token);
  const {getProfile} = useProfile();
  const timer = useRef<any>(null);
  React.useEffect(() => {
    clearInterval(timer.current);
    if (token) {
      getProfile();
      timer.current = setInterval(() => {
        getProfile();
      }, 10 * 60 * 1000);
    }
    return () => {
      clearInterval(timer.current);
    };
  }, [token]);
};
