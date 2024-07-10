/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 14:09:17
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/OptionBar/index.tsx
 * @Description:
 */
import useSettings from '@core/hooks/sports/useSettings';
import SwitchButton from '@core/templates/mobile/components/SwitchButton';
import {ALL_SORTBY, EGameBettingType} from '@constants/enum/sport';
import css from './style.scss';
import useTheme from '@core/hooks/useTheme';
import {ETHEME} from '@views/kmg/mobile/configs';
import {useMemo} from 'react';
import SearchInput from './SearchInput';
import classnames from 'classnames';

export default () => {
  const {switchSortByType, switchGameBettingByType, sortBy, gameBettingType, sportId} = useSettings();
  const {theme, switchTheme} = useTheme();
  const isEsports = useMemo(() => {
    return sportId > 33;
  }, [sportId]);

  return (
    <div className={classnames(css.wrapper, {'dp-hidden': isEsports})}>
      <SwitchButton
        className='switch-btn'
        options={[
          {
            label: '专业版',
            value: EGameBettingType.ADVANCED,
          },
          {
            label: '新手版',
            value: EGameBettingType.BEGINNER,
          },
        ]}
        checked={gameBettingType}
        width={55}
        onChange={(value: any) => switchGameBettingByType(value)}
      />
      <SwitchButton
        className='switch-btn'
        options={ALL_SORTBY.map((i) => ({label: i.name, value: i.code, icon: i.code === sortBy ? <img className='sort-by-icon' src={require(`@my/assets/images/common/icon_filter_sel${theme === ETHEME.DARK ? '_1' : ''}.png`)} /> : <img className='sort-by-icon' src={require('@my/assets/images/common/icon_filter_nor.png')} />}))}
        checked={sortBy}
        width={55}
        onChange={(value: any) => switchSortByType(value)}
      />
      <SwitchButton
        className='switch-btn'
        options={[
          {label: '日间', value: ETHEME.LIGHT},
          {label: '夜间', value: ETHEME.DARK},
        ]}
        checked={theme}
        width={55}
        onChange={(value: any) => switchTheme(value)}
      />
      <div className="dp-hidden">
        <SearchInput />
      </div>
    </div>
  );
};
