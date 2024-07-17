import css from './style.scss';

const data = [{
  rank: 1,
  team: '费内巴切',
  matchNumber: 18,
  matchWin: 15,
  matchDraw: 2,
  matchDefeat: 1,
  GF: 49,
  GA: 9,
  score: 47,
  winRate: 83,
}, {
  rank: 2,
  team: '费内巴切',
  matchNumber: 18,
  matchWin: 15,
  matchDraw: 2,
  matchDefeat: 1,
  GF: 35,
  GA: 9,
  score: 47,
  winRate: 83,
}, {
  rank: 3,
  team: '费内巴切',
  matchNumber: 18,
  matchWin: 10,
  matchDraw: 3,
  matchDefeat: 5,
  GF: 32,
  GA: 20,
  score: 33,
  winRate: 55,
}, {
  rank: 4,
  team: '费内巴切',
  matchNumber: 18,
  matchWin: 8,
  matchDraw: 5,
  matchDefeat: 5,
  GF: 25,
  GA: 23,
  score: 29,
  winRate: 44,
}, {
  rank: 5,
  team: '费内巴切',
  matchNumber: 18,
  matchWin: 8,
  matchDraw: 5,
  matchDefeat: 5,
  GF: 24,
  GA: 23,
  score: 29,
  winRate: 44,
}, {
  rank: 6,
  team: '费内巴切',
  matchNumber: 18,
  matchWin: 9,
  matchDraw: 2,
  matchDefeat: 7,
  GF: 26,
  GA: 26,
  score: 29,
  winRate: 50,
}, {
  rank: 7,
  team: '费内巴切',
  matchNumber: 18,
  matchWin: 7,
  matchDraw: 7,
  matchDefeat: 4,
  GF: 31,
  GA: 22,
  score: 28,
  winRate: 38,
}, {
  rank: 8,
  team: '费内巴切',
  matchNumber: 18,
  matchWin: 7,
  matchDraw: 7,
  matchDefeat: 4,
  GF: 31,
  GA: 22,
  score: 28,
  winRate: 38,
}, {
  rank: 9,
  team: '费内巴切',
  matchNumber: 18,
  matchWin: 7,
  matchDraw: 7,
  matchDefeat: 4,
  GF: 31,
  GA: 22,
  score: 28,
  winRate: 38,
}];

export default (() => {
  return (
    <div className={css.wrapper}>
      <div className='detail-panel'>
        <div className='content-header'>
          <div className='rank'>排名</div>
          <div className='match'>赛</div>
          <div className='win-detail'>胜/平/负</div>
          <div className='goal'>进/失</div>
          <div className='score'>积分</div>
          <div className='win-rate'>胜率</div>
        </div>
        {data.map((value, index)=>
          <div className='content' key={`match-detail-score-${index}`}>
            <div className='rank'>
              <div className='rank-number'>{value.rank}</div>
              <div className='team-img'></div>
              <div className='team-name'>{value.team}</div>
            </div>
            <div className='match'>{value.matchNumber}</div>
            <div className='win-detail'>
              <span className='win'>{value.matchWin}</span>
              <span className='draw'>/{value.matchDraw}/</span>
              <span className='defeat'>{value.matchDefeat}</span>
            </div>
            <div className='goal'>{value.GF}/{value.GA}</div>
            <div className='score'>{value.score}</div>
            <div className='win-rate'>{value.winRate}%</div>
          </div>,
        )}
      </div>
    </div>
  );
});

