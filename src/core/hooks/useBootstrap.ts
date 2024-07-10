/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/useBootstrap.ts
 * @Description:
 */
import {useMount} from 'react-use';
import remReset from '@helpers/remReset';
import {ETHEME} from '@this/configs';
import G from '@constants/global';
import store from '@helpers/storage';
import usePublicState from './usePublicState';
import useTheme from './useTheme';
import {isMobile} from '@core/utils';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const {switchTheme} = useTheme();

  useMount(() => {
    if (isMobile()) {
      remReset();
    }
    // 初始化全局变量
    G.INIT();
    // 初始化主题
    switchTheme(store.get('CUR_THEME') || ETHEME.LIGHT);
    // 从URI上获取token
    const urlParams = new URLSearchParams(new URL(window.location.href).search);
    const token = urlParams.get('token') || window.sessionStorage.getItem('token');
    if (token) {
      dispatch(ACTIONS.USER.setToken({data: token}));
      // todo 隐藏token信息
      // if (urlParams.get('token')) {
      //   window.location.href = window.location.origin;
      // }
    } else {
      // dispatch(ACTIONS.BASE.openToast({ text: 'URL 没有传入 TOKEN，请确认' }))
      // 默认使用试玩用户
      // todo 隐藏试玩用户
      // dispatch(ACTIONS.USER.userAutoLogin({
      //   cb: (data: {data: {token: string}}) => {
      //     dispatch(ACTIONS.USER.setToken({data: data.data.token}));
      //   },
      // }));
    }
  });

  return {

  };
};
