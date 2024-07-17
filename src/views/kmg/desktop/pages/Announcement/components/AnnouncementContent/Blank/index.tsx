import styles from './style.scss';

const ContentItem: React.FC = () => (
  <div className={styles.wrapper}>
    <img width={160} height={136} src={require('./i/blank.webp')} />
    <p>暂无消息记录</p>
  </div>
);

export default ContentItem;
