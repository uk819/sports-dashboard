
import {transrRealTimeResult} from '@core/utils';
import useWebSocket from 'react-use-websocket';
import usePublicState from '../usePublicState';
export enum EReqType {
  LIVE_TEXT = 3,
}
interface WS_MSG_IP {
  reqType: number,
  code: number,
  data: any,
}
let id = 0;
export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const {sendMessage, lastMessage, readyState} = useWebSocket(`${window.location.protocol.startsWith('https') ? 'wss://' : 'ws://'}${__DEV__ ? 'www.dpfat.com' : window.location.host}/ws/v1/msg`, {
    heartbeat: {
      message: JSON.stringify({reqType: 0}),
      timeout: 60000,
      interval: 10000,
    },
  });
  // 发送消息
  const send = React.useCallback((message: any) => {
    sendMessage(JSON.stringify(message));
  }, [sendMessage]);

  React.useEffect(() => {
    if (_.isEmpty(lastMessage)) return;
    const msg = transfJsonResult(lastMessage.data);
    if (msg && msg.code === 200) {
      switch (msg.reqType) {
        case EReqType.LIVE_TEXT: {
          const result = transrRealTimeResult(JSON.parse(msg.data));
          dispatch(ACTIONS.SPORT.addMsgLiveList(result));
          break;
        }
      }
    }
  }, [lastMessage]);
  const transfJsonResult = (msgStr: string): WS_MSG_IP=> {
    return JSON.parse(msgStr);
  };
  // 订阅
  const initConnect = (matchID: number)=>{
    id = matchID;
    send({reqType: 1, matchID: id});
  };
  React.useEffect(() => {
    // 退订
    return () => {
      send({reqType: 2, matchID: id});
    };
  }, []);
  return {
    initConnect,
    send,
    lastMessage,
    readyState,
  };
};
