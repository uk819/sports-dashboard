/*
 * @Description: 遮罩
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2023-12-13
 * @LastEditors: jspassion@itcom888.com
 */

import {createPortal} from 'react-dom';
import css from './overlay.scss';
import DpIcon from '@views/kmg/desktop/components/Icon';

interface IProps {
  children: any,
  display: boolean,
  hasMask?: boolean,
  zIndex?: number,
  close?: Function,
  closeOnClickBlank?: boolean;
  containerStyle?: React.CSSProperties;
  containerClassname?: string
  maskClickClose?: boolean;
  className?: string;
}

const Overlay = ({
  children, display, zIndex, close, closeOnClickBlank = true, containerStyle, containerClassname, hasMask = false, maskClickClose = false, className,
}: IProps) => {
  const thisNode = React.useRef<any>(document.createElement('div'));
  thisNode.current.className = `${css.wrapper} ${className} ${display ? 'block' : 'hidden'} global-overlay ${hasMask ? 'hasMask' : ''}`;
  if (zIndex === 0) {
    thisNode.current.style.zIndex = 0;
  } else {
    thisNode.current.style.zIndex = zIndex || 10;
  }

  // 使用Portal脱离文档流
  React.useEffect(() => {
    document.body.appendChild(thisNode.current);
    return () => {
      window.document.body.removeChild(thisNode.current);
    };
  }, []);

  return (
    createPortal(
        <div style={containerStyle} className={containerClassname} onClick={() => maskClickClose && close()}>
          { hasMask && close && display && closeOnClickBlank && <DpIcon className='back' fill="#fff" type="arrow" onClick={() => close()} /> }
          { display && children }
        </div>,
        thisNode.current,
    )
  );
};

export default Overlay;
