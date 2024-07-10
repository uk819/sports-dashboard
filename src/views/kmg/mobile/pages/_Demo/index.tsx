/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/_Demo/index.tsx
 * @Description: UI测试
 */
import {useState} from 'react';
// import pageWrapper from '@this/components/PageWrapper';
import Popup from '@core/templates/desktop/components/Popup';
import useDemo from '@core/hooks/useDemo';
import {$t, $T} from '@hooks/useI18n';
import {ETHEME} from '@this/configs';
import KeepAlive from '@template/components/KeepAlive';
import Counter from './Counter';
import style from './style.scss';
import {PopupTypeEnum} from '@core/constants/enum/common';

export function Demo() {
  const {
    handleLanguageChange,
    crash,
    setCrash,
    showPopup,
    setShowPopup,
    showToast,
    // showAlert,
    // showConfirm,
    showAlertHydra,
    showConfirm,
    showLoading,
    showI18nInfo,
    requestTest,
    switchTheme,
  } = useDemo();

  const [showCounter, setShowCounter] = useState(true);

  return (
    <div className={style.wrapper}>
      <br />
      <div className='row'>
        <button onClick={() => setShowCounter(!showCounter)}>显示/删除以下两个计数器（第一个withKeepLive）</button>
      </div>
      {showCounter && (
        <div className='row'>
          <KeepAlive cacheKey='count'>
            <Counter />
          </KeepAlive>
        </div>
      )}
      {showCounter && (
        <div className='row'>
          <Counter />
        </div>
      )}
      <$T params={{n: 8, money: 50}}>
        <div className='row'>
          <button onClick={() => showToast('long text longlonglonglonglonglonglognlognlongsuperlong', 'info')}>
            当前余额为：#money#
          </button>
        </div>
        <div className='row'>
          <button onClick={() => showToast(`这是一个Toast ${_.now()}`, 'success')}>弹出TOAST</button>
        </div>
        <div className='row'>
          <button onClick={() => showToast('token已过期', 'error')}>弹出TOAST2</button>
        </div>
        {/* <div className='row'>
          <button onClick={() => showAlert()}>弹出ALERT</button>
        </div> */}
        <div className='row'>
          <button onClick={() => showConfirm()}>弹出Confirm</button>
        </div>
        <div className='row'>
          <button onClick={() => showAlertHydra(PopupTypeEnum.ALERT1)}>弹出ALERT--1</button>
        </div>
        <div className='row'>
          <button onClick={() => showAlertHydra(PopupTypeEnum.ALERT2)}>弹出ALERT--2</button>
        </div>
        <div className='row'>
          <button onClick={() => showAlertHydra(PopupTypeEnum.ALERT3)}>弹出ALERT--3</button>
        </div>
        <div className='row'>
          <button onClick={() => showAlertHydra(PopupTypeEnum.ALERT4)}>弹出ALERT--4</button>
        </div>
        <div className='row'>
          <button onClick={() => showAlertHydra(PopupTypeEnum.ALERT5)}>弹出ALERT--5</button>
        </div>
        <div className='row'>
          <button onClick={() => showLoading()}>打开Loading #n#秒后关闭</button>
        </div>
        <div className='row'>
          <button onClick={() => setShowPopup(true)}>POPUP</button>
        </div>
        <div className='row'>
          <button onClick={showI18nInfo}>查看语言地区环境</button>
        </div>
        <div className='row'>
          <button onClick={() => handleLanguageChange('en-US')}>切换语言为英文</button>
        </div>
        <div className='row'>
          <button onClick={() => handleLanguageChange('zh-CN')}>切换语言为中文</button>
        </div>
        <div className='row'>
          <button onClick={() => setCrash(null)} data-ui={crash.test}>
            崩溃页测试
          </button>
        </div>
      </$T>
      <div className='row'>
        <h2>{$t('带参数#param#的翻译', {param: '【我是参数值】'})}</h2>
      </div>
      <div className='row'>
        <button onClick={() => requestTest({type: 'NORMAL'})}>正常请求</button>
      </div>
      <div className='row'>
        <button onClick={() => requestTest({type: 'LOADING'})}>带LOADING</button>
      </div>
      <div className='row'>
        <button onClick={() => requestTest({type: 'CACHE-WITHOUT_REQUEST'})}>带10秒缓存，且不重复请求</button>
      </div>
      <div className='row'>
        <button onClick={() => requestTest({type: 'CACHE-WITH_REQUEST'})}>带10秒缓存，且仍然请求更新缓存</button>
      </div>
      <div className='row'>
        <button onClick={() => requestTest({type: 'MOCK'})}>MOCK 错误数据，错误由框架处理</button>
      </div>
      <div className='row'>
        <button onClick={() => requestTest({type: 'MOCK-PASSERROR'})}>MOCK 错误数据，错误业务层处理</button>
      </div>
      <div className='row'>
        <button onClick={() => switchTheme(ETHEME.DARK)}>切换暗色主题</button>
      </div>
      <div className='row'>
        <button onClick={() => switchTheme(ETHEME.LIGHT)}>切换亮色主题</button>
      </div>
      <Popup title='---标题---' display={showPopup} close={() => setShowPopup(false)}>
        <div className='contents'>POPUP 内容</div>
      </Popup>
    </div>
  );
}

export default Demo;
