// 处理赔率显示相关逻辑

import {EOddType, HANDICAP_TYPE_MAP} from '@core/constants/enum/sport';
import TStore from '@core/reducers/_reduxStore';
import {addDecimals, truncateDecimals} from '@core/utils/math';
import {useSelector} from 'react-redux';

// 赔率相关的逻辑
export const getViewOddFn = (od: number, type: EOddType, currentOddType: number) => {
  if (type === EOddType.ML) {
    od = Number(truncateDecimals(-(1 / od), 2));
  }
  if (type !== EOddType.EUROPE) {
    return truncateDecimals(Number(currentOddType === EOddType.EUROPE ? addDecimals(od, 1) : od), 2);
  }
  return truncateDecimals(od, 2);
};

// 获取当前有效显示赔率
export const getViewOddType = (oddType: EOddType, finalType: EOddType, isMultiple: boolean) => {
  if (isMultiple) return EOddType.EUROPE;
  return oddType === EOddType.EUROPE ? oddType : finalType;
};
// 获取当前有效显示赔率名称
export const getViewOddTypeName = (oddType: EOddType, finalType: EOddType, isMultiple: boolean) => {
  const typeName = HANDICAP_TYPE_MAP[getViewOddType(oddType, finalType, isMultiple)];
  return typeName ? `[${typeName}]` : '';
};

export const useOddTransfer = () => {
  const currentOddType = useSelector((state: TStore) => state.user.currentOddType);
  // 需要修改赔率的玩法
  const getViewOdd = (od: number, type: EOddType, ct = currentOddType) => getViewOddFn(od, type, ct);
  return {
    getViewOdd,
  };
};
