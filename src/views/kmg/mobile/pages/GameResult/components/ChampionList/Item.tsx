import {useInView} from 'react-intersection-observer';
import useTheme from '@core/hooks/useTheme';
import classnames from 'classnames';
import DpIcon from '@this/components/Icon';
import {TChampionResultItem} from '@core/apis/models/sport/get-game-result';
import dayjs from 'dayjs';
import style from './style.module.scss';

interface IProps {
  mn: string;
  match: TChampionResultItem[];
  toggleCollapseLeague?: (mn: string) => void;
  isCollapse?: Array<string>;
}
export default React.memo((props: IProps) => {
  const {mn, match, toggleCollapseLeague, isCollapse} = props;
  const {ref} = useInView();
  const {mobileTheme} = useTheme();

  return (
    <div ref={ref} className={classnames(style.item, {[style.is_closed]: isCollapse?.includes(mn)})}>
      <div className={style.match_wrapper} onClick={()=> {
        toggleCollapseLeague(mn);
      }}>
        <div className={style.match_name}>
          {mn}
        </div>
        <div className={style.actions}>
          <DpIcon className={classnames(style.icon, {[style.icon_right]: isCollapse?.includes(mn)})} width={12} height={12} type="arrow" fill={mobileTheme.dpAncillary} />
        </div>
      </div>
      <div className={classnames(style.item_content)}>
        {
          match.map((data, key)=>{
            return <div className={style.item_bet} key={key}>
              <div className={style.league}>
                {data.leagueLogo && <img src={data.leagueLogo} alt={''} />}
                <span>{data.leagueName}</span>
              </div>
              <div className={style.detail} >
                <div className={style.item_name}>{data.betItemsName}
                </div>
                <div className={style.handicap}>{data.handicap}</div>
              </div>
              <div className={style.time}>
                {dayjs(data.beginTime).format('MM-DD hh:mm')}
              </div>
            </div>;
          })
        }
      </div>
    </div>
  );
});
