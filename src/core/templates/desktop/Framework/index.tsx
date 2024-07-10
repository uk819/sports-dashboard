/*
 * @Description: 整体框架，包含全局组件等
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2023-12-14 11:01:07
 * @LastEditors: Passion.KMG
 */
// import Modal from '@core/templates/desktop/components/Modal';
import Loading from '@core/templates/desktop/components/Loading';
import Toast from '@core/templates/desktop/components/Toast';
import 'react-toastify/dist/ReactToastify.css';
import useBootstrap from '@hooks/useBootstrap';
import css from './style.scss';
import PopupModal from '@core/templates/desktop/components/PopupModal';
import {useEffect} from 'react';

function Framework({children}: any) {
  useBootstrap();
  const onFocus = (e: any) => {
    const target = e.target;
    // 检查目标元素是否为 div 或 span
    if (target.tagName === 'DIV' || target.tagName === 'SPAN') {
      target.blur();
      // 阻止事件传播
      e.stopPropagation();
      // 阻止默认行为
      e.preventDefault();
    }
  };
  useEffect(() => {
    document.documentElement.addEventListener('focus', onFocus, true);
    return () => document.documentElement.removeEventListener('focus', onFocus, true);
  }, []);
  return (
    <div className={css.wrapper}>
      <Toast />
      <Loading />
      {/* <Modal /> */}
      <PopupModal />
      {children}
    </div>
  );
}

export default Framework;
