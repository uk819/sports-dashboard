import styles from './style.scss';
import classNames from 'classnames';

interface IProps {
  text: string,
  className?:string,
  onClick?:()=>void,
}

export const shortenString = (text : string) => {
  return text.length > 10 ? text.substring(0, 10)+'...' : text;
};

const MenuItem: React.FC<IProps> = (props: IProps) => (
  <div className={classNames(styles.wrapper, props.className )} onClick={props.onClick}>
    <span className='category-item'>{shortenString(props.text)}</span>
  </div>
);

export default MenuItem;
