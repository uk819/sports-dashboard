import {TChampionResultItem} from '@core/apis/models/sport/get-game-result';

interface propTypes {
  data: TChampionResultItem,
};

export default React.memo(({data}: propTypes) => {
  return (
    <div className='body-row champion'>
      <span className="wide-element begin-time">
        <span>{data.beginTime}</span>
      </span>
      <span className="wide-element league">
        {!!data.leagueLogo && <img src={data.leagueLogo} alt="" />}
        <span>{data.leagueName}</span>
      </span>
      <span className="wide-element play-rule">
        {data.betItemsName}
      </span>
      <span className='result-content'>
        {data.handicap}
      </span>
    </div>
  );
},
);

