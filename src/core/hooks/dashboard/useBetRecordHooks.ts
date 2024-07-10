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
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    dispatch(ACTIONS.DASHBOARD.getSportBetRecord({
      data: params,
      cb: (res: any) => {
        setLoading(false);
        if (!res) {
          return;
        }
        const {data} = res;
        const {count, pageData, pageNum, pageSize} = data;
        setHasMore(pageSize * pageNum < count);
        setTotal(count);
        setList(!add ? pageData : [...list, ...pageData]);
      },
    }));
  }, [params]);
  return {getList, list, loading, hasMore, total, params};
};
