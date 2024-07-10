import EachTeam from './components/eachTeam';
import css from './style.scss';

export default () => {
  return <div className={css.wrapper}>
    <EachTeam team='home' name='曼联' />
    <div className="vs-score">
      <span>1</span>
      <span className='dash'></span>
      <span>1</span>
    </div>
    <EachTeam team='away' name='切尔西'/>
  </div>;
};
