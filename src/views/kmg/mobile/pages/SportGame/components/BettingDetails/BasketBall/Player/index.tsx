import React, {useState} from 'react';
import styles from './style.scss';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';

const players =[1, 2, 3, 4];

export default React.memo(() => {
  const {matchDetail} = useMatchDetail();
  const [team, setTeam] = useState(0);
  return (
    <div className={styles.wrapper}>
      <div className='teams'>
        <div className={team === 0 ?'team active' : 'team'} onClick={()=>setTeam(0)}>{matchDetail?.teams.home.name}</div>
        <div className={team === 1 ?'team active' : 'team'} onClick={()=>setTeam(1)}>{matchDetail?.teams.away.name}</div>
      </div>
      <div className='match-video'>
      </div>
      <div className='panel-wrapper'>
        <div className='panel-header'>
          <span>首发名单</span>
        </div>
        <div className='panel-content'>
          <div className='panel-players'>
            <div className='panel-team home'>
              {players.map((element, index)=>{
                return (<div className='panel-player' key={'home-player-'+index}>
                  <div className='player-img'></div>
                  <div className='player-detail'>
                    <p className='name'>埃姆雷比尔金</p>
                    <p className='role'>门将</p>
                  </div>
                  <div className='player-number'>
                    <span>23</span>
                  </div>
                </div>);
              })}
            </div>
            <div className='panel-team away'>
              {players.map((element, index)=>{
                return (<div className='panel-player' key={'home-player-'+index}>
                  <div className='player-img'></div>
                  <div className='player-detail'>
                    <p className='name'>埃姆雷比尔金</p>
                    <p className='role'>门将</p>
                  </div>
                  <div className='player-number'>
                    <span>23</span>
                  </div>
                </div>);
              })}
            </div>
          </div>
        </div>
      </div>
      <div className='panel-wrapper'>
        <div className='panel-header'>
          <span>替补名单</span>
        </div>
        <div className='panel-content'>
          <div className='panel-players'>
            <div className='panel-team home'>
              {players.map((element, index)=>{
                return (<div className='panel-player' key={'home-player-'+index}>
                  <div className='player-img'></div>
                  <div className='player-detail'>
                    <p className='name'>埃姆雷比尔金</p>
                    <p className='role'>门将</p>
                  </div>
                  <div className='player-number'>
                    <span>23</span>
                  </div>
                </div>);
              })}
            </div>
            <div className='panel-team away'>
              {players.map((element, index)=>{
                return (<div className='panel-player' key={'home-player-'+index}>
                  <div className='player-img'></div>
                  <div className='player-detail'>
                    <p className='name'>埃姆雷比尔金</p>
                    <p className='role'>门将</p>
                  </div>
                  <div className='player-number'>
                    <span>23</span>
                  </div>
                </div>);
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
