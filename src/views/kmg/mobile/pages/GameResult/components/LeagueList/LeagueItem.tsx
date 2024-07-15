import {useInView} from 'react-intersection-observer';
import LeagueItemSwiper from './LeagueItemSwiper';
import useTheme from '@core/hooks/useTheme';
import classnames from 'classnames';
import DpIcon from '@this/components/Icon';
import {LeagueItemPrps} from './../../type';
import style from './style.module.scss';
import {useGameResultListData} from '@core/hooks/sports/useRenderData';
import dayjs from 'dayjs';

export default React.memo((props: LeagueItemPrps) => {
  const {gotoDetail} = useGameResultListData();
  const {itemData, sportId} = props;
  const {ref} = useInView();
  const {mobileTheme} = useTheme();

  const _itemContent = (item: any[]) => {
    return (
      <>
        <div
          className={style.league_wrapper}
          onClick={() => {
            props.toggleCollapseLeague(item[0].leagueId);
          }}>
          <div className={style.league_info}>
            <span className={style.league_name}>{item[0].ln}</span>
          </div>
          <div className={style.actions}>
            <DpIcon
              className={classnames(style.icon, {
                [style.icon_right]: props.isCollapse.includes(String(item[0].leagueId)),
              })}
              width={12}
              height={12}
              type='arrow'
              fill={mobileTheme.dpAncillary}
            />
          </div>
        </div>
        <div className={style.item_content}>
          {item.map((data: any) => {
            return (
              <div className={style.item_bet} key={data.mid}>
                <div className={style.item_time}>
                  <span>{dayjs(data.bt).format('MM-DD hh:mm')}</span>
                  <span>{_.includes([3, 5, 23], sportId) ? data?.pt : ''}</span>
                </div>
                <div className={style.item_detail}>
                  <div className={style.item_left}>
                    <div className={style.team_name}>
                      <div className={style.item_team}>{data.mn[0].title}</div>
                      <div className={style.item_team}>{data.mn[1].title}</div>
                    </div>
                    <LeagueItemSwiper sportId={sportId} data={data} />
                  </div>
                  <div className={style.item_right} onClick={() => gotoDetail(data.mid)}>
                    <span>详情&nbsp;&nbsp; &gt;</span>
                  </div>
                </div>
                {_.includes([1, 11, 12], sportId) && data?.hd?.length ? (
                  <div className={style.item_extra}>
                    {data?.hd.map((d: string, idx: number) => (
                      <span key={idx}>{d}</span>
                    ))}
                  </div>
                ) : (
                  ''
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return <div ref={ref}>{_itemContent(itemData)}</div>;
});
