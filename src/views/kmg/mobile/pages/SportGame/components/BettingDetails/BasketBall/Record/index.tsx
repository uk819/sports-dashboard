import useTheme from '@core/hooks/useTheme';
import css from './style.scss';

const data = [{
  date: '24-08-20',
  league: 'CBA',
  home: '福建...',
  away: '南充...',
  score: '128-120',
  result: 1,
}, {
  date: '24-08-20',
  league: 'CBA',
  home: '福建...',
  away: '南充...',
  score: '128-120',
  result: 0,
}, {
  date: '24-08-20',
  league: 'CBA',
  home: '福建...',
  away: '南充...',
  score: '128-120',
  result: 1,
}, {
  date: '24-08-20',
  league: 'CBA',
  home: '福建...',
  away: '南充...',
  score: '128-120',
  result: 0,
}];

const rankdata = [{
  rank: 1,
  team: '福建浔兴股份后 备队',
  win: 32,
  defeat: 32,
  rate: 72.54,
}, {
  rank: 1,
  team: '福建浔兴股份后 备队',
  win: 32,
  defeat: 32,
  rate: 72.54,
}];

export default (() => {
  return (
    <div className={css.wrapper}>
      <div className='detail-panel'>
        <div className='panel-header'>
          <p>战绩统计</p>
        </div>
        <div className='panel-content'>
          <div className='content-title'>
            <img src={require('./i/team1.webp')} />
            <p className='team-name'>福建浔兴股份后 备队</p>
            <p className='score'>4胜 0平 1负</p>
          </div>
          <div className='content-header'>
            <div className='date'>日期</div>
            <div className='league'>联赛</div>
            <div className='team-home'></div>
            <div className='score'>比分</div>
            <div className='team-away'></div>
            <div className='result'>赛果</div>
            <SortButton sort={true}/>
          </div>
          {data.map((value, index)=>
            <div className='content' key={`match-detail-score-${index}`}>
              <div className='date'>
                {value.date}
              </div>
              <div className='league'>{value.league}</div>
              <div className={value.result>0?'team-home win':'team-home defeat'}>
                {value.home}
              </div>
              <div className='score'>{value.score}</div>
              <div className={value.result>0?'team-away defeat':'team-home win'}>
                {value.away}
              </div>
              <div className={value.result>0?'result win':'result defeat'}>{value.result>0?'胜':'负'}</div>
            </div>,
          )}
        </div>
        <div className='panel-content'>
          <div className='content-title'>
            <img src={require('./i/team2.webp')} />
            <p className='team-name'>浙江东阳光药后 备队</p>
            <p className='score'>4胜 0平 1负</p>
          </div>
          <div className='content-header'>
            <div className='date'>日期</div>
            <div className='league'>联赛</div>
            <div className='team-home'></div>
            <div className='score'>比分</div>
            <div className='team-away'></div>
            <div className='result'>赛果</div>
            <SortButton sort={false}/>
          </div>
          {data.map((value, index)=>
            <div className='content' key={`match-detail-score-${index}`}>
              <div className='date'>
                {value.date}
              </div>
              <div className='league'>{value.league}</div>
              <div className={value.result>0?'team-home win':'team-home defeat'}>
                {value.home}
              </div>
              <div className='score'>{value.score}</div>
              <div className={value.result>0?'team-away defeat':'team-home win'}>
                {value.away}
              </div>
              <div className={value.result>0?'result win':'result defeat'}>{value.result>0?'胜':'负'}</div>
            </div>,
          )}
        </div>
      </div>
      <div className='detail-panel ranking'>
        <div className='panel-header'>
          <p>联赛积分-中国篮球发展联赛</p>
        </div>
        <div className='panel-content'>
          <div className='content-header'>
            <div className='rank'>排名</div>
            <div className='team'>球队</div>
            <div className='win-status'>胜</div>
            <div className='defeat-status'>负</div>
            <div className='rate'>赛果</div>
          </div>
          {rankdata.map((value, index)=>
            <div className='content' key={`match-detail-score-${index}`}>
              <div className='rank'>
                <div className='circle'>{value.rank}</div>
              </div>
              <div className='team'>{value.team}</div>
              <div className='win-status'>
                {value.win}
              </div>
              <div className='defeat-status'>{value.defeat}</div>
              <div className='rate'>{value.rate}%</div>
            </div>,
          )}
        </div>
        <div className='panel-footer'>
          <div className='footer'>展开</div>
          <div className='down'>
            <DownButton/>
          </div>
        </div>
      </div>
      <div className='detail-panel ranking'>
        <div className='panel-header'>
          <p>历史交战</p>
        </div>
        <div className='panel-tool'>
          <div className='same'>
            <div>同赛事</div>
            <div>同主客</div>
          </div>
          <div className='near'>
            <div className='active'>近5</div>
            <div>近10</div>
            <div>近15</div>
          </div>
        </div>
        <div className='panel-content'>
          <div className='content-header'>
            <div className='rank'>排名</div>
            <div className='team'>球队</div>
            <div className='win-status'>胜</div>
            <div className='defeat-status'>负</div>
            <div className='rate'>赛果</div>
          </div>
          {rankdata.map((value, index)=>
            <div className='content' key={`match-detail-score-${index}`}>
              <div className='rank'>
                <div className='circle'>{value.rank}</div>
              </div>
              <div className='team'>{value.team}</div>
              <div className='win-status'>
                {value.win}
              </div>
              <div className='defeat-status'>{value.defeat}</div>
              <div className='rate'>{value.rate}%</div>
            </div>,
          )}
        </div>
        <div className='panel-footer'>
          <div className='footer'>展开</div>
          <div className='down'>
            <DownButton/>
          </div>
        </div>
      </div>
    </div>
  );
});

const SortButton = ({sort}:{sort:boolean})=>{
  const {jsTheme} = useTheme();
  return (
    <div className='sort'>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 5 8" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M0.338168 4.63972C0.271281 4.63974 0.2059 4.66476 0.15029 4.71163C0.0946798 4.75849 0.0513379 4.82509 0.0257432 4.903C0.000148529 4.98092 -0.00654973 5.06666 0.00649537 5.14937C0.0195405 5.23209 0.0517433 5.30807 0.0990325 5.36771L1.79023 7.50007C1.85366 7.58002 1.93968 7.62494 2.02937 7.62494C2.11906 7.62494 2.20508 7.58002 2.26851 7.50007L3.95971 5.36771C4.007 5.30807 4.0392 5.23209 4.05224 5.14937C4.06529 5.06666 4.05859 4.98092 4.033 4.903C4.0074 4.82509 3.96406 4.75849 3.90845 4.71163C3.85284 4.66476 3.78746 4.63974 3.72057 4.63972H0.338168Z" fill={sort?jsTheme.dpTheme:jsTheme.dpNormal}/>
        <path fillRule="evenodd" clipRule="evenodd" d="M0.338168 3.36022C0.271281 3.3602 0.2059 3.33518 0.15029 3.28831C0.0946798 3.24145 0.0513379 3.17485 0.0257432 3.09693C0.000148529 3.01902 -0.00654973 2.93328 0.00649537 2.85057C0.0195405 2.76785 0.0517433 2.69187 0.0990325 2.63223L1.79023 0.499865C1.85366 0.419914 1.93968 0.375 2.02937 0.375C2.11906 0.375 2.20508 0.419914 2.26851 0.499865L3.95971 2.63223C4.007 2.69187 4.0392 2.76785 4.05224 2.85057C4.06529 2.93328 4.05859 3.01902 4.033 3.09693C4.0074 3.17485 3.96406 3.24145 3.90845 3.28831C3.85284 3.33518 3.78746 3.3602 3.72057 3.36022L0.338168 3.36022Z" fill={sort?jsTheme.dpNormal:jsTheme.dpTheme}/>
      </svg>
    </div>
  );
};

const DownButton = ()=>{
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none">
      <path d="M12 9L8 13L4 9" stroke="#3586FF" strokeLinecap="round" strokeLinejoin="round"/>
      <path opacity="0.6" d="M12 4L8 8L4 4" stroke="#3586FF" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

