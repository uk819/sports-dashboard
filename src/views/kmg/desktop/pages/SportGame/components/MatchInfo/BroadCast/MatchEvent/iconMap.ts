import penaltyKickDark from '../../i/37_dark.png';
import penaltyKickLight from '../../i/37_dark.png';
import penaltyKickMissedDark from '../../i/27_dark.png';
import yellowCard from '../../i/14.webp';
import redYellowCard from '../../i/16.webp';
import goalLight from '../../i/12.webp';
import redCard from '../../i/15.webp';
import substitutedDark from '../../i/38_dark.webp';
import substitutedLight from '../../i/38.webp';
import jwq from '../../i/jie-wai-qiu.svg';
import qmq from '../../i/qiu-meng-qiu.svg';
import req from '../../i/ren-yi-qiu.svg';
import stbs from '../../i/shang-ting-bu-shi.svg';
import sz2 from '../../i/shao-zi-2.svg';
import sz from '../../i/shao-zi.svg';
import sp from '../../i/she-pian.svg';
import shezheng from '../../i/she-zheng.svg';
import yw from '../../i/yue-wei.svg';
import jq from '../../i/jiao-qiu.svg';
import zhanting from '../../i/zhan-ting.svg';
import faqiu from '../../i/fa-qiu.svg';
import faqiudefen from '../../i/er-fen-de-fen.svg';
import faqiuweizhong from '../../i/fa-qiu-wei-zhong.svg';
import fangui from '../../i/fan-gui-b.svg';
import weizhong from '../../i/fa-qiu-wei-zhong.svg';

export const iconType = (theme: string, type: string)=>{
  switch (type) {
    case '1': // 比赛开始
      return theme ==='light' ? sz : sz;
    case '3': // 比赛结束
      return theme ==='light' ? sz2 : sz2;
    case '8': // 点球
      return theme ==='light' ? penaltyKickLight : penaltyKickDark;
    case '9': // 进球
      return theme ==='light' ? goalLight : goalLight;
    case '40': // 点球未进
      return theme ==='light' ? penaltyKickMissedDark : penaltyKickMissedDark;
    case '18': // 黄牌
      return theme ==='light' ? yellowCard : yellowCard;
    case '21': // 红黄牌
      return theme ==='light' ? redYellowCard : redYellowCard;
    case '22': // 红牌
      return theme ==='light' ? redCard : redCard;
    case '23': // 换人
      return theme ==='light' ? substitutedLight : substitutedDark;
    case '30': // 角球
      return theme ==='light' ? jq : jq;
    case '32': // 射偏
      return theme ==='light' ? sp : sp;
    case '29': // 越位
      return theme ==='light' ? yw : yw;
    case '28': // 界外球
      return theme ==='light' ? jwq : jwq;
    case '27': // 球门球
      return theme ==='light' ? qmq : qmq;
    case '26': // 任意球
      return theme ==='light' ? req : req;
    case '24': // 伤停补时显示
      return theme ==='light' ? stbs : stbs;
    case '31': // 射正不进
      return theme ==='light' ? shezheng : shezheng;
    // 暂停
    case '50':
      return zhanting;
    // 罚球
    case '83':
      return faqiu;
    // 罚球得分
    case '85':
      return faqiudefen;
    // 罚球未中
    case '86':
      return faqiuweizhong;
    // 犯规
    case '94':
      return fangui;
    // 投篮未中
    case '117':
      return weizhong;
    // 篮球进球得分
    case '124':
      return faqiudefen;
    default:
      return undefined;
  };
};
