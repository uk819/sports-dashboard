import React, {useState} from 'react';
import styles from './style.scss';
import {PieChart} from 'react-minimal-pie-chart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import TeamMatchDetail from '../../BettingExpect/components/TeamMatchDetail';
import GoalDistributionDetail from '../../BettingExpect/components/GoalDistributionDetail';
import MarketTrend from '../../BettingExpect/components/NewMarketTrend';
import LineChart from '../../BettingExpect/components/LineChart';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
);

export type TabProps = 'TEAMMATCH' | 'BLANK' | 'GOAL' | 'TREND' | 'ODDS';

export default React.memo(() => {
  const [detailTab, setDetailTab] = useState<TabProps>('BLANK');
  return (
    <div className={styles.wrapper}>
      <div className='detail-panel'>
        <div className='panel-header'>
          <p>统计</p>
        </div>
        <div className='panel-content'>
          <div className='teams'>
            <div className='team home'>
              <div className='team-circle'></div>
              <p>福建浔兴股份后 备队</p>
            </div>
            <div className='team away'>
              <div className='team-circle'></div>
              <p>浙江东阳光药后 备队</p>
            </div>
          </div>
          <div className='match-status-rate'>
            <div className='status-rate'>
              <p>三分命中率</p>
              <div className='pie-chart'>
                <PieChart
                  radius={30}
                  lineWidth={5}
                  segmentsStyle={(index : any) => {
                    return {strokeWidth: 6 + index*2};
                  }}
                  startAngle={-90}
                  lengthAngle={360}
                  data={[
                    {title: 'yellow', value: 2, color: '#F6B73D'},
                    {title: 'red', value: 3, color: '#ED4949'},
                  ]}
                />
              </div>
              <div className='label'>
                <span className='home'>43%</span>
                <span className='away'>57%</span>
              </div>
            </div>
            <div className='status-rate'>
              <p>投篮命中率</p>
              <div className='pie-chart'>
                <PieChart
                  radius={30}
                  lineWidth={5}
                  segmentsStyle={(index : any) => {
                    return {strokeWidth: 6 + index*2};
                  }}
                  startAngle={-90}
                  lengthAngle={360}
                  data={[
                    {title: 'yellow', value: 0, color: '#F6B73D'},
                    {title: 'red', value: 1, color: '#ED4949'},
                  ]}
                />
              </div>
              <div className='label'>
                <span className='home'>0</span>
                <span className='away'>0</span>
              </div>
            </div>
            <div className='status-rate'>
              <p>罚球命中率</p>
              <div className='pie-chart'>
                <PieChart
                  radius={30}
                  lineWidth={5}
                  segmentsStyle={(index : any) => {
                    return {strokeWidth: 6 + index*2};
                  }}
                  startAngle={-90}
                  lengthAngle={360}
                  data={[
                    {title: 'yellow', value: 0, color: '#F6B73D'},
                    {title: 'red', value: 1, color: '#ED4949'},
                  ]}
                />
              </div>
              <div className='label'>
                <span className='home'>100%</span>
                <span className='away'>0</span>
              </div>
            </div>
          </div>
          <div className='match-fouls'>
            <div className='match-foul'>
              <p>犯规数</p>
              <div className='status'>
                <p className='home'>2</p>
                <img src={require('./i/foul.webp')} />
                <p className='away'>2</p>
              </div>
            </div>
            <div className='match-foul'>
              <p>剩余暂停</p>
              <div className='status'>
                <p className='home'>0</p>
                <img src={require('./i/timer.webp')} />
                <p className='away'>2</p>
              </div>
            </div>
          </div>
          <div className='match-score'>
            <div className='time-goal-detail'>
              <div className='time-goal'>
                <span className='goal'>2</span>
                <span className='text-normal time'>三分球得分</span>
                <span className='goal'>4</span>
              </div>
              <div className='time-detail'>
                <LineChart type='home' value={10}/>
                <LineChart type='away' value={22}/>
              </div>
            </div>
            <div className='time-goal-detail'>
              <div className='time-goal'>
                <span className='goal'>2</span>
                <span className='text-normal time'>两分球得分</span>
                <span className='goal'>4</span>
              </div>
              <div className='time-detail'>
                <LineChart type='home' value={2}/>
                <LineChart type='away' value={4}/>
              </div>
            </div>
            <div className='time-goal-detail'>
              <div className='time-goal'>
                <span className='goal'>7</span>
                <span className='text-normal time'>罚球得分</span>
                <span className='goal'>1</span>
              </div>
              <div className='time-detail'>
                <LineChart type='home' value={7}/>
                <LineChart type='away' value={1}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      {detailTab === 'TEAMMATCH' ? <TeamMatchDetail back={(e: TabProps)=>setDetailTab(e)}/> :''}
      {detailTab === 'GOAL' ? <GoalDistributionDetail back={(e: TabProps)=>setDetailTab(e)}/> :''}
      {detailTab === 'TREND' ? <MarketTrend back={(e: TabProps)=>setDetailTab(e)}/> :''}

    </div>
  );
});
