import {useEffect} from 'react';

interface IProps {
  ref: React.MutableRefObject<HTMLElement>;
  rootMargin?: string;
}

export default ({ref, rootMargin}: IProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
        ([el]) => {
          console.log(el.intersectionRatio);
          el.target.classList.toggle('is-pinned', el.intersectionRatio > 0.9 && el.intersectionRatio < 1);
        },
        {
          threshold: [1],
          rootMargin,
        },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);
};
