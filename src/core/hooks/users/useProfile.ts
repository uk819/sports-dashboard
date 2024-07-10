/*
 * @Author: Passion.KMG
 * @Date: 2023-12-18 16:01:31
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/users/useRegister.ts
 * @Description: 用户个人信息
 */
import usePublicState from '../usePublicState';

export default () => {
  const {dispatch, ACTIONS, token} = usePublicState();
  const [loadingProfile, setLoadingProfile] = React.useState(false);

  const getProfile = React.useCallback((callback?: Function, isRecord = false) => {
    if (loadingProfile) {
      return;
    }
    if (!token) {
      dispatch(ACTIONS.BASE.openToast({text: '当前游客模式，请先登录', types: 'error'}));
      return;
    }
    const startTime = Date.now();
    if (!isRecord) setLoadingProfile(true);
    dispatch(ACTIONS.USER.setBetLimit({}));
    dispatch(ACTIONS.USER.getUserInfo({
      cb: () => {
        const requestEndTime = Date.now();
        setTimeout(() => {
          if (!isRecord) setLoadingProfile(false);
        }, 2000 - (requestEndTime - startTime));
        callback && callback();
      },
    }));
  }, [token, loadingProfile]);

  return {
    loadingProfile,
    getProfile,
  };
};
