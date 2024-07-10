import usePublicState from '../usePublicState';
import {useCallback, useEffect, useState} from 'react';
type TParams = {
  [any: string]: any
  isAdd?: boolean
}
export default (initialParams: TParams) => {
  const {dispatch, ACTIONS} = usePublicState();
  const [params, setParams] = useState(initialParams);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [add, setAdd] = useState(false);
  const getList = useCallback(
      (param: TParams, option?: TParams) => {
        if (option && option.isAdd) {
          setAdd(true);
        } else {
          setAdd(false);
        }
        setParams({...params, ...param});
      },
      [params],
  );
  const cancelOrder = useCallback((orderId: string) => {
    setAdd(false);
    dispatch(ACTIONS.SPORT.cancelOrder({
      data: [orderId],
      cb: () => {
        dispatch(ACTIONS.BASE.openToast({text: '预约取消', types: 'success'}));
        setParams({...params, pageNum: 1});
      },
    }));
  }, [params]);
  const showConfirm = (orderId: string) => {
    dispatch(
        ACTIONS.BASE.openConfirm({
          title: '温馨提示',
          content: '确定取消本场比赛预约',
          actions: [
            {
              text: '确定',
              cb: () => cancelOrder(orderId),
            },
          ],
        }),
    );
  };
  useEffect(() => {
    if (params.init) return;
    dispatch(ACTIONS.DASHBOARD.getSportBetHistory({
      data: params,
      cb: (res: any) => {
        setLoading(true);
        dispatch(ACTIONS.BASE.closeModal());
        if (!res) {
          setLoading(false);
          return;
        }
        const {data} = res;
        const {count, pageData, pageNum, pageSize} = data.pager;
        setHasMore(pageSize * pageNum < count);
        setTotal(count);
        setList(!add ? pageData : [...list, ...pageData]);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
    }));
  }, [params]);
  return {getList, list, loading, hasMore, total, params, showConfirm};
};
