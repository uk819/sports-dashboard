import {AnnouncementDetail} from '@core/apis/models/announcement';
import usePublicState from '../usePublicState';
import {useEffect, useRef, useState} from 'react';
import {isESports} from '@core/utils';

export default (news : boolean = false) => {
  const {dispatch, ACTIONS} = usePublicState();
  const [pageNum, setPageNum] = useState<number>(1);
  const [datas, setData] = useState<Array<AnnouncementDetail>>([]);
  const timer = useRef<any>(null);
  useEffect(() => {
    clearInterval(timer.current);
    if (news) {
      const payload = {
        category: isESports() ? 1 : null,
        pageNum: pageNum ?? 1,
        pageSize: 20,
      };
      const fn = () => {
        dispatch(ACTIONS.DASHBOARD.getAnnouncement({
          data: payload,
          cb: (res: any) => {
            if (!res || _.isEmpty(res.data)) {
              return;
            }
            const {data} = res;
            const list = data?.list ?? [];
            setData(list);
          },
        }));
      };
      fn();
      timer.current = setInterval(() => {
        fn();
      }, 10 * 60 * 1000);
    } else {
      const payload = {
        pageNum: pageNum ?? 1,
        pageSize: 10,
      };
      dispatch(ACTIONS.DASHBOARD.getAnnouncement({
        data: payload,
        cb: (res: any) => {
          if (!res || _.isEmpty(res.data)) {
            return;
          }
          const {data} = res;
          const total = data?.total ?? 0;
          const list = data?.list ?? [];
          if (total > pageNum * 20) {
            setTimeout(() => {
              setPageNum(pageNum+1);
            }, 1000);
          }
          setData([...datas, ...list]);
        },
      }));
    };
  }, [pageNum]);
  useEffect(() => {
    return () => clearInterval(timer.current);
  }, []);
  return datas;
};
