import React, {useCallback} from 'react';
import {getPlayNameByKc, transferBoDan} from '@core/utils';
import {TMatch} from '@core/services/Table';
import DpIcon from '@views/kmg/mobile/components/Icon';
import useTheme from '@core/hooks/useTheme';
import {EmptyOddItem, OddItem} from '../../MatchMethods/Odds/OddsItem';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import style from './style.scss';
import classnames from 'classnames';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import {EStaticsType} from '@core/constants/enum/sport';
import DpCollapse from '@this/components/Collapse';

interface IProps {
  play: TMatch['playTypes'][0];
  match: TMatch;
  allOpen?: boolean;
  isChampion?: boolean;
}

export default React.memo(({play, match, allOpen, isChampion}: IProps) => {
  const {mobileTheme} = useTheme();
  const currentOddType = useSelector((state: TStore) => state.user.currentOddType);
  const {getScoreByTypeId} = useMatchStatistics();
  const corner = getScoreByTypeId(EStaticsType.cornerKicks, match);
  const render = useCallback(() => {
    switch (play.code) {
      case 'HT_CS':
      case 'FT_CS':
        return (
          <div className="play-content">
            <div className="bd-list">
              {
                transferBoDan(play.mks[0].ops.filter((bil) => bil.name !== 'AOS')).map((bil, idx) => bil ? <OddItem key={bil.id} op={bil} oddType={currentOddType} methodCode={play.code} /> : <EmptyOddItem key={idx} />)
              }
            </div>
            <div className="other mt-6">
              {
                play.mks[0].ops.filter((bil) => bil.name === 'AOS').map((bil, bidx) =>
                bil ? (
                  <OddItem key={bil.id} op={{...bil, name: '其他'}} oddType={currentOddType} methodCode={play.code} />
                ) : (
                  <div className='odd-item empty' key={bidx} />
                ),
                )}
            </div>
          </div>
        );
      default:
        return (
          <div className="play-content">
            {
              play.code === 'FT_TTS' &&
              <div className="other-title">
                <div>首个进球</div>
                <div>最后进球</div>
              </div>
            }
            <div className="play-list">
              {
                play.mks.map((market) => (
                  <div className={classnames('market-item', `col-${market.ops.length > 3 ? '2' : market.ops.length}`, {'col-3': play.code === 'FT_HF'})} key={market.mkId}>
                    {
                      market.ops.sort((a, b) => a.sortIndex - b.sortIndex).map((bil) => (
                        <OddItem key={bil.id} op={bil} oddType={currentOddType} methodCode={play.code} />
                      ))
                    }
                  </div>
                ))
              }
            </div>
          </div>
        );
    }
  }, [play]);
  return (
    <div className={style.wrapper}>
      {
        isChampion ?
        <div className="bet-group-item">
          <div className="collapse-header">
            <div className='play-name'>
              {getPlayNameByKc({code: play.code, name: play.name, ctid: play.ctid, sportId: match.sportId})}
              {
                match.isLive && play.code.endsWith('_AH') && match.sportId === 1 &&
                <>
                  {
                    play.ctid === 0 &&
                    <span className='ml-3'>
                      ({match.score.home ?? ''}-{match.score.away ?? ''})
                    </span>
                  }
                  {
                    play.ctid === 1 &&
                    <span className='ml-3'>
                      ({corner[0]}-{corner[1]})
                    </span>
                  }
                </>
              }
              <div className="actions">
                <DpIcon className="icon" width={12} height={12} type="arrow" fill={mobileTheme.dpAncillary} />
              </div>
            </div>
          </div>
          <div className="play-content">
            {
              render()
            }
          </div>
        </div> :
        <DpCollapse
          allOpen={allOpen}
          className="bet-group-item"
          header={
            <div className='play-name'>
              {getPlayNameByKc({code: play.code, name: play.name, ctid: play.ctid, sportId: match.sportId})}
              {
                match.isLive && play.code.endsWith('_AH') && match.sportId === 1 &&
                <>
                  {
                    play.ctid === 0 &&
                    <span className='ml-3'>
                      ({match.score.home ?? ''}-{match.score.away ?? ''})
                    </span>
                  }
                  {
                    play.ctid === 1 &&
                    <span className='ml-3'>
                      ({corner[0]}-{corner[1]})
                    </span>
                  }
                </>
              }
              <div className="actions">
                <DpIcon className="icon" width={12} height={12} type="arrow" fill={mobileTheme.dpAncillary} />
              </div>
            </div>
          }
        >
          <div className="play-content">
            {
              render()
            }
          </div>
        </DpCollapse>
      }
    </div>
  );
});
