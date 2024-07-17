// 状态枚举
export enum EOrderStatus {
  PENDING = 0,
  SETTLED = 1,
  CANCELLED = 2,
  CONFIRMING = 3,
  RISK_REJECTED = 4,
  CANCELLED_BY_MATCH = 5,
}

// 枚举对应值
export const ORDER_STATUS_MAP: { [key in EOrderStatus]: string } = {
  [EOrderStatus.PENDING]: '未结算',
  [EOrderStatus.SETTLED]: '已结算',
  [EOrderStatus.CANCELLED]: '取消',
  [EOrderStatus.CONFIRMING]: '待确认',
  [EOrderStatus.RISK_REJECTED]: '投注失败',
  [EOrderStatus.CANCELLED_BY_MATCH]: '撤单(赛事取消)',
};
