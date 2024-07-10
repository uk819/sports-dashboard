/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/templates/desktop/components/Loading/index.tsx
 * @Description:
*/
import {useSelector} from 'react-redux';
import Overlay from '../Overlay';
import classnames from 'classnames';

import css from './loading.scss';
import usePublicState from '@core/hooks/usePublicState';
interface IProps {
  show?: boolean;
  type?: 'progress';
}

export default function({show, type}: IProps) {
  const loading = useSelector((state: any) => state.base.loading);
  const {base} = usePublicState();
  React.useEffect(() => {
    const other = document.createElement('div');
    for (let i = 0; i < 94; i++) {
      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', require(`./i/tz_${i}.png`));
      imgEl.style.display = 'none';
      other.appendChild(imgEl);
    }
    document.body.appendChild(other);
  }, []);

  return (
    <>
      {
        loading.display || show &&
        (
          <Overlay zIndex={300} display>
            <div className={css.wrapper}>
              {
                !type &&
                <div className="text">
                  <div className="lds-roller">
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                  </div>
                  {loading.text}
                </div>
              }
              {
                type === 'progress' &&
                <div className="progress-wrapper">
                  <div className={classnames('submit-loading', `time-${base.config.orderCheckMaxTime}`)}></div>
                </div>
              }
            </div>
          </Overlay>
        )
      }
    </>
  );
}
