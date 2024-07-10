import {europeanIndexes} from '../data';
import style from './style.scss';
import classnames from 'classnames';

export default () => {
  return (
    <div className={style.wrapper}>
      <div className='types'>
        <span className='type'>类型</span>
        <span className='home'>主</span>
        <span className='draw'>和</span>
        <span className='away'>客</span>
        <span className='home-win-rate'>主胜率</span>
        <span className='draw-rate'>和率</span>
        <span className='away-win-rate'>客胜率</span>
        <span className='return-rate'>返还率</span>
      </div>
      <div className='detail'>
        {europeanIndexes.map((europeanIndex) => (
          <div className='index' key={europeanIndex.id}>
            <div className='name'>
              <p>{europeanIndex.name}</p>
            </div>
            <div className='items'>
              {europeanIndex.items.map((item, idx) => (
                <div className={classnames('item', {'border': idx === 0})} key={idx}>
                  <span className='type'>{item.type}</span>
                  <span className='home'>{item.home}</span>
                  <span className='draw'>{item.draw}</span>
                  <span className='away'>{item.away}</span>
                  <span className='home-win-rate'>{item.homeWinRate}</span>
                  <span className='draw-rate'>{item.drawRate}</span>
                  <span className='away-win-rate'>{item.awayWinRate}</span>
                  <span className='return-rate'>{item.returnRate}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
