import classnames from 'classnames';
import {IGuideData} from '../..';
import css from './style.scss';

const GuideDetail = ({guide}: {guide: IGuideData}) => {
//
  return (
    <div className={css.wrapper} >
      <div className='title'>{guide.title}</div>
      <div className='subtitle'>{guide.subtitle}</div>
      <div className='items'>
        <div className='item'>
          <p className='target'>{guide.items.big.target}</p>
          <div className={classnames('status', {'win': (guide.items.big.status === '全赢' || guide.items.big.status === '赢一半'), 'lose': (guide.items.big.status === '全输' || guide.items.big.status === '输一半')})}>{guide.items.big.status}</div>
        </div>
        <div className='display'>
          <p className='sum'>{guide.sumGoal}</p>
          <p className='describe'>进球之和</p>
        </div>
        <div className='item'>
          <p className='target'>{guide.items.small.target}</p>
          <div className={classnames('status', {'win': (guide.items.small.status === '全赢' || guide.items.small.status === '赢一半'), 'lose': (guide.items.small.status === '全输' || guide.items.small.status === '输一半')})}>{guide.items.small.status}</div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;
