import {Skeleton} from 'antd';
import classnames from 'classnames';
import styles from './style.scss';

const GameResultDetailSkeleton: React.FC = () => (
  <div className={classnames(styles.gameResultDetail)}>
    <Skeleton.Input active block />
  </div>
);

export default GameResultDetailSkeleton;
