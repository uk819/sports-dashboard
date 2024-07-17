import {ETHEME} from '@this/configs';
import {IStrategyData, ITems} from '../..';
import classnames from 'classnames';
import usePublicState from '@core/hooks/usePublicState';
import css from './style.scss';
interface Props {
    strategy :IStrategyData;
    items: ITems;
    id: number;
}
const Detail = (props: Props) => {
  const {strategy, items, id} = props;
  const {user} = usePublicState();

  return (
    <div className={classnames(css.wrapper, id === 0 && 'border')}>
      <div className='subtitle'>{items.subtitle}</div>
      <div className='team'>
        <div className='team-item'>
          <img src={require(`${ user.theme === ETHEME.LIGHT ? './i/uniform-light.webp' : './i/uniform-dark.webp'}`)} width={26} alt="home" />
          <p>投注主队</p>
          <div className={classnames('status', {'win': (items.teamDetail.home.status === '全赢' || items.teamDetail.home.status === '赢一半'), 'lose': (items.teamDetail.home.status === '全输' || items.teamDetail.home.status === '输一半')})}>{items.teamDetail.home.status}</div>
        </div>
        <div className='display'>
          <div className='score'>
            <span>{items.teamDetail.home.score}</span>
            <span>-</span>
            <span>{items.teamDetail.away.score}</span>
          </div>
          <div className='describe'>{strategy.describe}</div>
        </div>
        <div className='team-item'>
          <img src={require(`${ user.theme === ETHEME.LIGHT ? './i/uniform-light.webp' : './i/uniform-dark.webp'}`)} alt="away" />
          <p>投注客队</p>
          <div className={classnames('status', {'win': (items.teamDetail.away.status === '全赢' || items.teamDetail.away.status === '赢一半'), 'lose': (items.teamDetail.away.status === '全输' || items.teamDetail.away.status === '输一半')})}>{items.teamDetail.away.status}</div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
