import css from './style.scss';

export default ({result, next}: {result: string; next: string}) => {
  return (
    <div className={css.wrapper}>
      <div className='logo-title'>
        <img src={require(`./i/result-${result === '大' ? 'cancel' : 'ok'}-icon.webp`)} alt='' />
        <div className='statement'>{result === '大' ? '很遗憾，您还未完全掌握' : '恭喜红单'}</div>
      </div>
      <div className='describe'>
        <div>{!next ?'进球数2，小于2.5' : '进球数2，小于2/2.5'}</div>
        {next === null ? (
          result === '小' ? (
            <div>
              故投注<span>小2.5</span>能全赢
            </div>
          ) : (
            <div>
              故投注<span>小2.5</span>能全赢，投注<span>大2.5</span>全输
            </div>
          )
        ) : (result === '小' ? (
          <div>
            基于对分原理，投注<span>小2/2.5</span>能赢一半
          </div>
        ) : (
          <div>
            基于对分原理，故投注<span>小2/2.5</span>能赢一半，投注<span>大2/2.5</span>则输一半
          </div>
        ))}
      </div>
    </div>
  );
};
