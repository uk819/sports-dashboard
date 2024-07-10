import {PlayType, TMatch} from '@core/services/Table';
import style from './style.scss';
import classnames from 'classnames';
import {OddItem} from '../MatchDetail';

interface IProps {
  match: TMatch;
}

export default React.memo(({match}: IProps) => {
  return (
    <div className={style.champion_item}>
      {
        match.playTypes.map((item: PlayType, idx) => (
          <div className="play-item" key={idx}>
            <div className='play-name'>
              {item.name}
            </div>
            <div className="paly-content">
              <div className="play-default">
                {
                  item.mks.map((market) => (
                    <div className={classnames('market-item r-2c')} key={market.mkId}>
                      {
                        market.ops.sort((a, b) => a.sortIndex - b.sortIndex).map((bil, idx) => <OddItem bil={bil} kc={item.code} key={bil?.id || idx} showTeam />)
                      }
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
});
