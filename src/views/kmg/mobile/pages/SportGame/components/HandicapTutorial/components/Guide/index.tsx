import {guideData} from './data';
import GuideDetail from './components/GuideDetail';
import {useState, useEffect, useRef} from 'react';
import css from './style.scss';
import usePublicState from '@core/hooks/usePublicState';
import {ETHEME} from '@this/configs';
import useHandicapTutorial from '@core/hooks/sports/useHandicapTutorial';
import Practice from './components/Practice';

interface IList {
    target: string;
    status: string;
}

interface ITems {
    big:IList;
    small: IList;
}

export interface IGuideData {
    id: number;
    content: string;
    title: string;
    subtitle: string;
    sumGoal: number;
    items: ITems;
}

export default ({setBallStatus, itemRefs}: {setBallStatus: (v: number) => void, itemRefs: any}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLDivElement | null>(null);
  const [spaceHeight, setSpaceHeight] = useState<number>(0);
  const {user} = usePublicState();
  const {handlePractice} = useHandicapTutorial();

  const handleScroll = () => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();

      const inViewItems = guideData
          .filter((item) => {
            const itemRect = itemRefs[item.id]?.current?.getBoundingClientRect();
            return itemRect && itemRect.top + 10 >= containerRect.top;
          })
          .map((item) => {
            const itemRect = itemRefs[item.id]?.current?.getBoundingClientRect();
            const diff = itemRect.top - containerRect.top;
            return {id: item.id, distance: Math.abs(diff)};
          });

      if (inViewItems.length > 0) {
        inViewItems.sort((a, b) => a.distance - b.distance);
        const closestItem = inViewItems[0];
        const viewIndex = closestItem.id;
        setBallStatus(viewIndex);
      }
    }
  };

  useEffect(() => {
    containerRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(()=> {
    const containerHeight = containerRef.current.offsetHeight;
    const btnHeight = btnRef.current.offsetHeight;
    const itemHeight = itemRefs[3].current.offsetHeight;
    const heighDiff = containerHeight - itemHeight - btnHeight;
    heighDiff && heighDiff > 0 ? setSpaceHeight(heighDiff) : 0;
  });

  return (
    <div className={css.wrapper} ref={containerRef}>
      <div className='statement'>全场90分钟（含伤停补时）两队进球数的总和即为大小球</div>
      <div>
        <div className='container'>
          <div className="detail">
            {guideData.map((guide, idx)=> (
              <div ref={itemRefs[idx]}key={idx}>
                <GuideDetail guide={guide} />
              </div>
            ))}
          </div>
          <div className='btns' ref={btnRef} >
            <div className="practice" onClick={handlePractice}>
              <span>模拟练习</span>
              <img src={require(`./i/practice-arrow-${ user.theme === ETHEME.LIGHT ? 'light' : 'dark'}.webp`)} alt="prev-icon" />
            </div>
          </div>
          <div className='spacer' style={{height: `${spaceHeight}px`}}></div>
        </div>
      </div>
      <Practice />
    </div>
  );
};
