/*
 * @Author: Galen.GE
 * @Date: 2024-01-18 18:47:00
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/MatchMethods/Odds/OddsItem.tsx
 * @Description:
 */
import {mapBetItemName} from '@constants/enum/sport/betItemName';
import {TMatch, TOrder} from '@core/services/Table';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import style from './style.scss';
import DpIcon from '@views/kmg/mobile/components/Icon';
import {useOddTransfer} from '@core/hooks/sports/useOddTransfer';
import classnames from 'classnames';
import {LockOutlined} from '@ant-design/icons';
import {getNameByhoa} from '@core/utils';

export const LockItem = ({col = 3}: {col?: number}) => {
  return (
    <>
      {
        new Array(col).fill(0).map((_, index: number) => (<div key={index} className={classnames(style.item, 'disabled')}>-</div>))
      }
    </>
  );
};

interface IOddItemProps {
  op: TOrder;
  oddType: number;
  methodCode: string;
  isInList?: boolean;
  isNoob?: boolean;
  // 0 主队 1和 2客
  isHome?: number;
  match?: TMatch;
  len?: number;
  inMainList?: boolean;
}
export const OddItem = ({op, isNoob, isHome, match, len, isInList, methodCode, inMainList}: IOddItemProps) => {
  const {addAndRemoveOrder, orderTags} = useOrderCart();
  const {getViewOdd} = useOddTransfer();
  const odd = getViewOdd(op.od, op.oddBetType);
  if (op.ended) {
    return (
      <div className={style.item}>
        <span className='name'>{mapBetItemName[op?.name] || op.name}</span>
        <span className="result">
          <DpIcon type="result" active={op.win === 1} />
        </span>
      </div>
    );
  }

  if (!op.available) {
    return (
      <div className={classnames(style.item, 'disabled')}>
        <LockOutlined />
      </div>
    );
  }

  return (
    <>
      <div className={classnames(style.item, 'odd-item', {'is-home': isHome === 0, 'is-draw': len === 3 && isHome === 1, 'active': _.includes(orderTags, op.tag)})} onClick={() => addAndRemoveOrder(op)}>
        <div className={classnames('name')}>
          <span className={classnames({'text-theme': !methodCode.endsWith('_AH') && /^[+-]?[\d]+(?:\.\d+)?(?:[+\-*/]\d+(?:\.\d+)?)?$/.test(mapBetItemName[op?.name] || op.name)})}>
            {!isInList && methodCode.endsWith('_AH') && (op.betTeam?.toUpperCase() === 'HOME' ? op.teams.home.name : op.teams.away.name)} {(getNameByhoa(op.name, methodCode, op, inMainList)).split(' ').map((_: string, midx: number) => (<span className={classnames({'text-theme': /^[+-]?[\d]+(?:\.\d+)?(?:[+\-*/]\d+(?:\.\d+)?)?$/.test(_), 'ml-2': midx === 1})} key={midx}>{_}</span>))}
          </span>
        </div>
        <span className={op.change}>{odd}</span>
      </div>
    </>
  );
};

export const EmptyOddItem = () => {
  return (
    <div className={classnames(style.item, 'disabled')}>
      <span>-</span>
    </div>
  );
};
