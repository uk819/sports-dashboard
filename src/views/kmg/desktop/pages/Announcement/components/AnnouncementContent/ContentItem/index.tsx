import styles from './style.scss';

export interface IProps {
  title: string,
  content:string,
  created:string,
  type: string,
  istitle: boolean
}
const ContentItem: React.FC<IProps> = (props: IProps) => (
  <div className={styles.wrapper}>
    { props.istitle && <p className='content-title'>[{props.title ?? ''}]</p>}
    <p className='content-content'>{`${props.type ?? ''}: ${props.content ?? ''}`}</p>
    <p className='content-created'>{props.created ?? ''}</p>
  </div>
);

export default ContentItem;
