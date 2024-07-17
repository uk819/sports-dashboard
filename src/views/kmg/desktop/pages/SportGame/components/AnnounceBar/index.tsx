/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG jspassion@itcom888.com
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MenuSidePanel/index.tsx
 * @Description:
 */
import Marquee from 'react-fast-marquee';
import DpSwitchButton from '@views/kmg/desktop/components/SwitchButton';
import usePublicState from '@core/hooks/usePublicState';
import useTheme from '@core/hooks/useTheme';
import styles from './style.scss';
import LanguageDropdown from './components/LanguageDropdown';
import {useHistory} from 'react-router';
import useAnnouncementHooks from '@core/hooks/dashboard/useAnnouncementHooks';
import {ALL_SPORTS_MAP} from '@core/constants/enum/sport';
// import SettingsDropdown from './components/SettingsDropdown';

export default React.memo(() => {
  const {user, ACTIONS, dispatch} = usePublicState();
  const announcement = useAnnouncementHooks(true);
  const history = useHistory();
  const {switchTheme} = useTheme();
  const newsCategories: { [key : number]: string} = {
    0: '公告',
    ...ALL_SPORTS_MAP,
  };

  return (
    <div className={styles.wrapper}>
      <div className="flex items-center">
        <div className="btn" onClick={()=> history.push('/announcement')}>
          公告
        </div>
        <div className="marquee_wrap" onClick={()=>history.push('/announcement')}>
          <Marquee pauseOnHover speed={60} loop={0}>
            {
              announcement?.filter((item) => item.status === 1).map((item) => (
                item &&
                <span key={item.id} className={styles.marquee_text}>{`${item.billClassify == 0 ? item.billboardTitleCn : newsCategories[item.billClassify] + '赛事'}: ${item?.billboardContentCn ?? ''}`}</span>
              ))
            }
            {
              announcement && announcement.filter((item) => item.status === 1).length <= 0 &&
              <span className={styles.marquee_text}>暂无公告</span>
            }
          </Marquee>
        </div>
      </div>
      <div className="r-actions">
        <DpSwitchButton
          value={user.currentOddType}
          type="button"
          items={[{label: '欧盘', value: 1}, {label: '亚盘', value: 2}]}
          onChange={(val) => dispatch(ACTIONS.USER.setOddType({data: val}))}
        />
        <DpSwitchButton
          value={user.theme}
          type="button"
          onChange={(value: any) => switchTheme(value)}
          items={[{label: '日间', value: 'light'}, {label: '夜间', value: 'dark'}]}
        />
        <LanguageDropdown />
        {/* <SettingsDropdown /> */}
      </div>
    </div>
  );
});
