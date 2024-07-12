import {IconGameBriefView, IconGameDetailView} from '@views/kmg/desktop/components/Icon';
import DpCollapse from '@views/kmg/desktop/components/Collapse';
import DetailData from '../../DetailData';
import {TGameResultStatistic} from '@core/reducers/_reduxStore';
import {EGameResult} from '@core/constants/enum/sport/gamesResult';
import {IconProps} from '@core/constants/enum/sport/sportsCategory';

interface propTypes {
  dataId?: number,
  data: TGameResultStatistic,
  viewDetail: React.Key | null,
  toggleIcon: (key: React.Key) => void,
  tags: Record<EGameResult, IconProps>,
  sportId: number,
};

interface FilteredResult {
  key: string,
  val: Array<number | string>,
};

export default React.memo(({data, viewDetail, toggleIcon, tags, sportId}: propTypes) => {
  const filteredResultArr: FilteredResult[] = [];

  const filterFunc = (tags: Record<EGameResult, IconProps>, data: TGameResultStatistic, arr: FilteredResult[]) => {
    Object.entries(tags).map((tag) => {
      Object.entries(data.details).map(([key, val]) => {
        key === tag[0] && arr.push({key, val});
      });
    });
    return arr;
  };

  filterFunc(tags, data, filteredResultArr);

  const Header = ({resData}: {resData: FilteredResult[]}) => {
    return (
      <div className={`body-row ${viewDetail === data.mid? 'opened' : ''} sports-${sportId}`} onClick={() => toggleIcon(data.mid)}>
        <span className="wide-element contain-view-icon">
          <span>
            {viewDetail === data.mid? <IconGameDetailView /> : <IconGameBriefView />}
          </span>
          <span>{data.bt}</span>
        </span>
        <span className="wide-element league-title">
          {!!data.llogo && <img src={data.llogo} alt="League Logo" />}
          <span>{data.ln}</span>
        </span>
        <span className="wide-element match-title render-array">
          {data.mn.map((team, idx) => (
            <span key={idx}>
              {/* {!!team.logo && <img src={team.logo} alt="Team Logo" />} */}
              {team.title}
            </span>
          ))}
        </span>
        {resData.length ? resData.map((res, idx) => (
          <span key={data.mid + '_' + idx} className={`render-array ${res.key}`}>
            {res.val.map((score: number, idx: number) => (<p key={idx}>{score}</p>))}
          </span>
        )) : <span>loading...</span>}
      </div>
    );
  };
  return (
    <DpCollapse
      className={viewDetail === data.mid? 'collapse-opened' : ''}
      key={data.mid}
      allOpen={viewDetail === data.mid}
      header={<Header resData={filteredResultArr} />}
    >
      {viewDetail === data.mid && <DetailData mTeam={_.map(data.mn, (team) => team.title)} sevenData={data.details} scores={JSON.parse(data.scores)}/>}
    </DpCollapse>
  );
});
