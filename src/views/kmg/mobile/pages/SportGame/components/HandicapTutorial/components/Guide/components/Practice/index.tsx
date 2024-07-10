import Overlay from '@core/templates/mobile/components/Overlay';
import css from './style.scss';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import usePublicState from '@core/hooks/usePublicState';
import {ETHEME} from '@views/kmg/mobile/configs';
import useHandicapTutorial from '@core/hooks/sports/useHandicapTutorial';
import MatchDetail from './components/matchDetail';
import OverUnderStatus from './components/overUnderStatus';
import BetResult from './components/betResult';
import {useState} from 'react';

export default () => {
  const [selectItem, setSelectItem] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const isClicked = useSelector((state: TStore) => state.sport.handicapPractice.isClicked);
  const {user} = usePublicState();
  const {handlePractice} = useHandicapTutorial();
  const handleNext = () => {
    setNext('next');
    setSelectItem(null);
  };

  const handleGoBack = () => {
    handlePractice();
    setNext(null);
    setSelectItem(null);
  };

  return (
    <Overlay display={isClicked} zIndex={100}>
      <div className={css.wrapper}>
        <div className='header'>
          <div className='prev' onClick={handleGoBack}>
            <img
              src={require(`${user.theme === ETHEME.LIGHT ? './i/prev-light.webp' : './i/prev-dark.webp'}`)}
              alt='prev-icon'
            />
          </div>
          <div className='title'>大小球模拟训练</div>
        </div>
        <div className='main'>
          <div className='container'>
            <div className='question'>
              <div className='single'>单选</div>
              <div className='text'>
                {!next ? '1、当出现这样的赛果哪个选项能全赢？' : '2、当出现这样的赛果哪个选项能赢一半？'}
              </div>
            </div>
            <MatchDetail />
            <div className='over-under'>
              <OverUnderStatus type='大' setSelectItem={setSelectItem} selectItem={selectItem} next={next} />
              <OverUnderStatus type='小' setSelectItem={setSelectItem} selectItem={selectItem} next={next} />
            </div>
            {selectItem && <BetResult result={selectItem} next={next} />}
          </div>
          {!next && (
            <div className='next-question' onClick={handleNext}>
              下一题
            </div>
          )}
        </div>
      </div>
    </Overlay>
  );
};
