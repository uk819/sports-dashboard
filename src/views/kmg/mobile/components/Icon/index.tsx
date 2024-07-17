import useTheme from '@core/hooks/useTheme';
import classnames from 'classnames';
import styles from './style.scss';

interface SvgIconProps {
  width?: number;
  height?: number;
  fill?: string;
  bg?: string;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  active?: boolean;
  theme?: any;
  direction?: 'left' | 'right' | 'top' | 'bottom';
}

interface IDpIcon extends SvgIconProps {
  type:
    | 'animate'
    | 'live'
    | 'arrow'
    | 'collect'
    | 'checked'
    | 'unchecked'
    | 'checkOnAmount'
    | 'remove'
    | 'keyboard'
    | 'team'
    | 'league'
    | 'result'
    | 'exclamation'
    | 'arrowNext'
    | 'copy'
    | 'close'
    | 'arrow2'
    | 'up'
    | 'down'
    | 'groupBet'
    | 'del'
    | 'add'
    | 'removeSeries'
    | 'removeSeries2'
    | 'more'
    | 'expand'
    | 'arrowDown'
}

function DpIcon(props: IDpIcon) {
  const {mobileTheme} = useTheme();

  const getIcon = () => {
    switch (props.type) {
      case 'arrow':
        return <IconArrow {...props} theme={mobileTheme} />;
      case 'collect':
        return <IconCollect {...props} theme={mobileTheme} />;
      case 'checked':
        return <IconChecked {...props} theme={mobileTheme} />;
      case 'unchecked':
        return <IconUnchecked {...props} theme={mobileTheme} />;
      case 'checkOnAmount':
        return <IconCheckedOnAmount {...props} theme={mobileTheme} />;
      case 'remove':
        return <IconRemove {...props} theme={mobileTheme} />;
      case 'keyboard':
        return <Iconkeyboard {...props} theme={mobileTheme} />;
      case 'live':
        return <IconLive {...props} theme={mobileTheme} />;
      case 'animate':
        return <IconAnimate {...props} theme={mobileTheme} />;
      case 'league':
        return <IconLeague {...props} theme={mobileTheme} />;
      case 'team':
        return <IconTeam {...props} theme={mobileTheme} />;
      case 'result':
        return <IconResult {...props} theme={mobileTheme} />;
      case 'exclamation':
        return <IconExclamation {...props} theme={mobileTheme} />;
      case 'arrowNext':
        return <IconArrowNext {...props} theme={mobileTheme} />;
      case 'copy':
        return <IconCopy {...props} theme={mobileTheme} />;
      case 'close':
        return <IconClose {...props} theme={mobileTheme} />;
      case 'arrow2':
        return <IconArrow2 {...props} theme={mobileTheme} />;
      case 'up':
        return <IconUp {...props} theme={mobileTheme} />;
      case 'down':
        return <IconDown {...props} theme={mobileTheme} />;
      case 'groupBet':
        return <IconGroupBet {...props} theme={mobileTheme} />;
      case 'del':
        return <IconDel {...props} theme={mobileTheme} />;
      case 'add':
        return <IconAdd {...props} theme={mobileTheme} />;
      case 'removeSeries2':
        return <IconRemoveSeries2 {...props} theme={mobileTheme} />;
      case 'removeSeries':
        return <IconRemoveSeries {...props} theme={mobileTheme} />;
      case 'more':
        return <IconMore {...props} theme={mobileTheme} />;
      case 'arrowDown':
        return <IconArrowDown {...props} theme={mobileTheme} />;
      case 'expand':
        return <IconExpand {...props} theme={mobileTheme} />;
    };
  };

  return (
    <div className={classnames(styles.dp_icon, props.className)} onClick={props.onClick}>
      {getIcon()}
    </div>
  );
}

function IconArrow({width = 8, height = 14, fill, active, theme, direction}: SvgIconProps) {
  const map = {
    left: {},
    right: {transform: 'rotate(180deg)'},
    top: {transform: 'rotate(90deg)'},
    bottom: {transform: 'rotate(-90deg)'},
  };
  return (
    <svg width={width} height={height} style={map[direction]} viewBox="0 0 9 16" fill="none">
      <path d="M2.27083 7.99999L8.39583 14.125C8.60417 14.3333 8.705 14.5764 8.69833 14.8542C8.69167 15.1319 8.58389 15.375 8.375 15.5833C8.16667 15.7917 7.92361 15.8958 7.64583 15.8958C7.36806 15.8958 7.125 15.7917 6.91667 15.5833L0.5 9.18749C0.333334 9.02083 0.208333 8.83333 0.125 8.62499C0.0416667 8.41666 0 8.20833 0 7.99999C0 7.79166 0.0416667 7.58333 0.125 7.37499C0.208333 7.16666 0.333334 6.97916 0.5 6.81249L6.91667 0.395828C7.125 0.187494 7.37167 0.086661 7.65667 0.0933277C7.94167 0.0999943 8.18806 0.207772 8.39583 0.416661C8.60417 0.624994 8.70833 0.86805 8.70833 1.14583C8.70833 1.42361 8.60417 1.66666 8.39583 1.87499L2.27083 7.99999Z" fill={fill || theme.dpStrong}/>
    </svg>
  );
}

function IconCollect({width = 15, height = 14, fill, active, theme}: SvgIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 15 14" fill="none">
      <path d="M7.2929 10.4588L7.04132 10.3123L6.78973 10.4588L3.37636 12.4462L3.37629 12.4461L3.366 12.4524C3.29869 12.4938 3.24594 12.5032 3.19515 12.4991C3.11818 12.4929 3.06604 12.4707 3.02364 12.4389C2.96306 12.3933 2.91767 12.3387 2.88367 12.2698C2.8742 12.2506 2.86233 12.2166 2.88049 12.14C2.88053 12.1398 2.88056 12.1396 2.8806 12.1395L3.78504 8.38462L3.85775 8.08276L3.61942 7.88374L0.601203 5.36349C0.533815 5.30399 0.514715 5.25863 0.507678 5.22704C0.494573 5.1682 0.498324 5.11802 0.518252 5.06449C0.545622 4.99198 0.580657 4.94603 0.61969 4.91302C0.635378 4.89976 0.684595 4.86765 0.805901 4.84937L4.78051 4.51274L5.07754 4.48758L5.19666 4.21434L6.73884 0.676785L6.73885 0.676787L6.73965 0.674915C6.76667 0.612236 6.79924 0.580146 6.84101 0.557122C6.91857 0.514368 6.98342 0.5 7.04132 0.5C7.10002 0.5 7.16459 0.514498 7.24092 0.556732C7.28252 0.579754 7.31577 0.612314 7.34355 0.676248L7.34379 0.676785L8.88597 4.21434L9.0051 4.48758L9.30212 4.51274L13.2767 4.84937C13.398 4.86765 13.4473 4.89976 13.4629 4.91302L13.7858 4.53124L13.4629 4.91302C13.5021 4.94612 13.5372 4.99221 13.5646 5.06504C13.585 5.11942 13.5887 5.16963 13.5758 5.22783C13.5689 5.25867 13.5502 5.30353 13.4824 5.36272L10.4632 7.88374L10.2249 8.08276L10.2976 8.38462L11.2021 12.1398C11.2021 12.14 11.2022 12.1401 11.2022 12.1403C11.2202 12.2158 11.2087 12.2501 11.1986 12.2705C11.1647 12.3396 11.1196 12.3935 11.0601 12.438L11.059 12.4389C11.0166 12.4707 10.9644 12.4929 10.8875 12.4991C10.8367 12.5032 10.7839 12.4938 10.7166 12.4524L10.7167 12.4523L10.7063 12.4462L7.2929 10.4588Z" stroke={active ? theme.dpTheme : (fill || theme.dpNormal)} fill={active ? theme.dpTheme : undefined}/>
    </svg>
  );
}

function IconChecked({width = 15, height = 14, fill, active, theme}: SvgIconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
      <g clipPath="url(#clip0_521_47282)">
        <path d="M9 16.5C11.071 16.5 12.9461 15.6605 14.3033 14.3033C15.6605 12.9461 16.5 11.071 16.5 9C16.5 6.92895 15.6605 5.05395 14.3033 3.6967C12.9461 2.33947 11.071 1.5 9 1.5C6.92895 1.5 5.05395 2.33947 3.6967 3.6967C2.33947 5.05395 1.5 6.92895 1.5 9C1.5 11.071 2.33947 12.9461 3.6967 14.3033C5.05395 15.6605 6.92895 16.5 9 16.5Z" fill="#3D8AF7" stroke="#3D8AF7" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M8.09063 12.8806C8.35171 12.8806 8.55527 12.7788 8.69688 12.5664L12.8388 6.15878C12.945 5.99947 12.9849 5.85787 12.9849 5.72069C12.9849 5.3711 12.7282 5.11887 12.3698 5.11887C12.122 5.11887 11.9715 5.20737 11.821 5.44633L8.07293 11.3849L6.1524 8.95106C6.00637 8.76963 5.85592 8.68998 5.63909 8.68998C5.27622 8.68998 5.01514 8.94664 5.01514 9.30065C5.01514 9.45553 5.06824 9.60156 5.19657 9.75644L7.48881 12.5797C7.65696 12.7877 7.84282 12.8806 8.09063 12.8806Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_521_47282">
          <rect width="18" height="18" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
function IconCheckedOnAmount({width = 15, height = 14, fill, active, theme}: SvgIconProps) {
  return (
    <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
      <path d="M24 0L0 18H20C22.2091 18 24 16.2091 24 14V0Z" fill={theme.dpTheme}/>
      <path d="M13 12L15.5 14L19 10" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconRemove({width = 15, height = 14, fill, active, theme}: SvgIconProps) {
  return (
    <svg width="19" height="18" viewBox="0 0 19 18" fill="none">
      <path d="M5.75 4.125L2 9L5.75 13.875H17V4.125H5.75Z" stroke={fill || theme.dpStrong} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.375 7.125L12.125 10.875" stroke={fill || theme.dpStrong} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.125 7.125L8.375 10.875" stroke={fill || theme.dpStrong} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function Iconkeyboard({width = 15, height = 14, fill, active, theme}: SvgIconProps) {
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
      <g clipPath="url(#clip0_1511_6200)">
        <path d="M12.5909 0H2.40909C1.33745 0 0.506364 0.956455 0.506364 2.09077L0.5 9.36314C0.5 10.4975 1.33745 11.4545 2.40909 11.4545H12.5909C13.6625 11.4545 14.5 10.4975 14.5 9.36377V2.09045C14.5 0.957091 13.6625 0 12.5909 0ZM12.5909 1.27273C12.9193 1.27273 13.2273 1.62495 13.2273 2.09077V9.36409C13.2273 9.82959 12.9193 10.1818 12.5909 10.1818H2.40909C2.08073 10.1818 1.77273 9.82959 1.77273 9.36377L1.77909 2.09141C1.77909 1.62273 2.08327 1.27273 2.40909 1.27273H12.5909ZM6.86364 3.18182H8.13636V4.45455H6.86364V3.18182ZM6.86364 5.09091H8.13636V6.36364H6.86364V5.09091ZM4.95455 3.18182H6.22727V4.45455H4.95455V3.18182ZM4.95455 5.09091H6.22727V6.36364H4.95455V5.09091ZM4.31818 6.36364H3.04545V5.09091H4.31818V6.36364ZM4.31818 4.45455H3.04545V3.18182H4.31818V4.45455ZM10.0455 6.36364H8.77273V5.09091H10.0455V6.36364ZM10.0455 4.45455H8.77273V3.18182H10.0455V4.45455ZM11.9545 6.36364H10.6818V5.09091H11.9545V6.36364ZM11.9545 4.45455H10.6818V3.18182H11.9545V4.45455ZM10.0455 8.27273H4.95455V7H10.0455V8.27273ZM7.19391 13.8807L5.9005 13.0801C5.58773 12.8867 5.62973 12.7273 5.99914 12.7273H9.00182C9.37186 12.7273 9.41514 12.8851 9.10014 13.0801L7.80673 13.8807C7.63618 13.9863 7.36318 13.9854 7.19391 13.8807Z" fill={fill || theme.dpStrong}/>
      </g>
      <defs>
        <clipPath id="clip0_1511_6200">
          <rect width="14" height="14" fill="white" transform="translate(0.5)"/>
        </clipPath>
      </defs>
    </svg>
  );
}
function IconUnchecked({width = 15, height = 14, fill, active, theme}: SvgIconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
      <g clipPath="url(#clip0_521_47280)">
        <path d="M9 16.5C11.071 16.5 12.9461 15.6605 14.3033 14.3033C15.6605 12.9461 16.5 11.071 16.5 9C16.5 6.92895 15.6605 5.05395 14.3033 3.6967C12.9461 2.33947 11.071 1.5 9 1.5C6.92895 1.5 5.05395 2.33947 3.6967 3.6967C2.33947 5.05395 1.5 6.92895 1.5 9C1.5 11.071 2.33947 12.9461 3.6967 14.3033C5.05395 15.6605 6.92895 16.5 9 16.5Z" stroke="#BFC5CE" strokeWidth="2" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_521_47280">
          <rect width="18" height="18" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
function IconLive({width = 18, height = 18, fill, active, theme}: SvgIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M4 2.5C2.067 2.5 0.5 4.067 0.5 6V12C0.5 13.933 2.067 15.5 4 15.5H14C15.933 15.5 17.5 13.933 17.5 12V6C17.5 4.067 15.933 2.5 14 2.5H4ZM1.5 6C1.5 4.61929 2.61929 3.5 4 3.5H14V14.5H4C2.61929 14.5 1.5 13.3807 1.5 12V6ZM15 5.5C15 5.22386 15.2239 5 15.5 5C15.7761 5 16 5.22386 16 5.5V6.5C16 6.77614 15.7761 7 15.5 7C15.2239 7 15 6.77614 15 6.5V5.5ZM15.5 8C15.2239 8 15 8.22386 15 8.5V12.5C15 12.7761 15.2239 13 15.5 13C15.7761 13 16 12.7761 16 12.5V8.5C16 8.22386 15.7761 8 15.5 8ZM10.8 8.30718C11.3333 8.6151 11.3333 9.3849 10.8 9.69282L7.2 11.7713C6.66667 12.0792 6 11.6943 6 11.0785L6 6.92154C6 6.3057 6.66667 5.9208 7.2 6.22872L10.8 8.30718Z" fill={fill || (active && theme.dpTheme) || theme.dpNormal} />
    </svg>
  );
}
function IconAnimate({width = 18, height = 18, fill, active, theme}: SvgIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none">
      <path d="M1 12V6M1 12C1 13.6569 2.34315 15 4 15H14C15.6569 15 17 13.6569 17 12M1 12H3C3.55228 12 4 11.5523 4 11V7C4 6.44772 3.55228 6 3 6H1M17 12V6M17 12H15C14.4477 12 14 11.5523 14 11V7C14 6.44772 14.4477 6 15 6H17M17 6C17 4.34315 15.6569 3 14 3H4C2.34315 3 1 4.34315 1 6M9 3V15M12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9C6 7.34315 7.34315 6 9 6C10.6569 6 12 7.34315 12 9Z" stroke={fill || (active && theme.dpYellow) || theme.dpNormal} />
    </svg>
  );
}
export function IconLeague({width = 16, height = 16, fill, active, theme}: SvgIconProps) {
  return (
    <svg width={width} height={height} viewBox='0 0 18 18' fill='none'>
      <path
        d='M14.34 3.78H12.96V3.13C12.96 3.0585 12.906 3 12.84 3H5.16C5.094 3 5.04 3.0585 5.04 3.13V3.78H3.66C3.2955 3.78 3 4.10012 3 4.495V6.9C3 8.22762 3.9 9.331 5.073 9.5325C5.3055 11.4207 6.705 12.9076 8.46 13.1156V14.8251H5.52C5.2545 14.8251 5.04 15.0575 5.04 15.3451V15.87C5.04 15.9415 5.094 16 5.16 16H12.84C12.906 16 12.96 15.9415 12.96 15.87V15.3451C12.96 15.0575 12.7455 14.8251 12.48 14.8251H9.54V13.1156C11.295 12.9076 12.6945 11.4207 12.927 9.5325C14.1 9.331 15 8.22762 15 6.9V4.495C15 4.10012 14.7045 3.78 14.34 3.78ZM4.08 6.9V4.95H5.04V8.3235C4.4835 8.13175 4.08 7.56625 4.08 6.9ZM11.88 8.98C11.88 9.77787 11.5935 10.5302 11.0715 11.0941C10.5495 11.6596 9.8565 11.97 9.12 11.97H8.88C8.1435 11.97 7.449 11.6596 6.9285 11.0941C6.4065 10.5286 6.12 9.77787 6.12 8.98V4.17H11.88V8.98ZM13.92 6.9C13.92 7.56625 13.5165 8.13175 12.96 8.3235V4.95H13.92V6.9Z'
        fill={fill || (active && theme.dpTheme) || theme.dpAncillary}
      />
    </svg>
  );
}

export function IconTeam({width = 16, height = 16, fill, active, theme}: SvgIconProps) {
  return (
    <svg width={width} height={height} viewBox='0 0 41 40' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M30.764 5.74838L37.2184 12.2026C38.1272 13.1116 38.1272 14.591 37.2188 15.5L32.5568 20.1614C32.1681 20.5523 31.6525 20.7916 31.103 20.836V32.5804C31.103 33.8784 30.0468 34.9346 28.7488 34.9346H12.2354C10.9374 34.9346 9.88138 33.8784 9.88138 32.5804V21.3148C9.33804 21.2671 8.82905 21.0288 8.44438 20.6422L3.78298 15.9808C3.34258 15.5404 3.09998 14.9548 3.09998 14.332C3.09998 13.7092 3.34258 13.1238 3.78298 12.6832L10.1628 6.30318C10.3634 5.92823 10.6622 5.61493 11.0273 5.39688C11.3924 5.17883 11.8099 5.06423 12.2352 5.06538H15.674L15.9152 5.19958C17.189 5.90818 18.8144 6.29838 20.492 6.29838C22.1696 6.29838 23.7952 5.90818 25.069 5.19958L25.31 5.06538H28.7488C28.8114 5.06555 28.874 5.06835 28.9364 5.07378C29.2717 5.04718 29.6088 5.09372 29.9243 5.2102C30.2399 5.32668 30.5264 5.5103 30.764 5.74838ZM31.052 18.657L35.7136 13.9954C35.7518 13.9572 35.7733 13.9053 35.7734 13.8512C35.7734 13.7971 35.752 13.7453 35.7138 13.707L29.2594 7.25278C29.198 7.19138 29.1338 7.18998 29.0854 7.19678L28.9336 7.21878L28.7814 7.19698L28.7784 7.19654C28.7683 7.19507 28.7579 7.19354 28.7474 7.19318H25.8536C24.2962 8.00078 22.4494 8.42598 20.492 8.42598C18.5348 8.42598 16.688 8.00078 15.1308 7.19318H12.2354C12.1903 7.19326 12.1463 7.2068 12.1089 7.23206C12.0716 7.25732 12.0426 7.29316 12.0258 7.33498L11.9338 7.56278L11.728 7.74738L5.28758 14.1878C5.23838 14.2372 5.22798 14.2934 5.22798 14.332C5.22798 14.3706 5.23818 14.4268 5.28758 14.476L9.94898 19.1376C9.96755 19.1564 9.9897 19.1713 10.0141 19.1814C10.0385 19.1915 10.0647 19.1966 10.0912 19.1964C10.1272 19.1964 10.1806 19.1872 10.2288 19.1432L12.0092 17.522V27.2308H28.9746V16.9666L30.769 18.6604C30.8178 18.7064 30.8724 18.716 30.9094 18.716C30.9359 18.7162 30.9622 18.7111 30.9867 18.701C31.0112 18.6909 31.0334 18.6759 31.052 18.657ZM28.9746 29.2308H12.0092V32.5806C12.0092 32.6103 12.015 32.6397 12.0263 32.6671C12.0377 32.6946 12.0543 32.7195 12.0753 32.7405C12.0963 32.7615 12.1212 32.7782 12.1486 32.7896C12.1761 32.8009 12.2055 32.8068 12.2352 32.8068H28.7484C28.8732 32.8068 28.9746 32.7056 28.9746 32.5806V29.2308Z'
        fill={fill || (active && theme.dpBasicWhite) || theme.dpAncillary}
      />
    </svg>
  );
}
export function IconArrowProcess({width = 16, height = 16, fill, active, theme}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
      <path opacity="1" d="M1 1.5L6 6L1 10.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconResult({width = 12, height = 12, fill, active, theme}: SvgIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 12 12" fill="none">
      <g clipPath="url(#clip0_1717_51276)">
        <path d="M0.687737 0.74699H2.11309V0.416309C2.11309 0.276625 2.32831 0.162598 2.46942 0.162598H9.54057C9.68026 0.162598 9.89691 0.276625 9.89691 0.416309V0.745565H11.3223C11.6187 0.745565 11.8439 1.11758 11.8439 1.41405V3.00902C11.8439 4.35312 10.9061 5.48057 9.66173 5.797C9.21987 7.0399 8.14801 7.99346 6.78537 8.2771V9.30905H7.00488C7.15169 9.30905 7.36834 9.34469 7.36834 9.49292V10.2826H8.53143C8.67824 10.2826 8.72812 10.3496 8.72812 10.4465V11.5525C8.72812 11.6495 8.67824 11.8376 8.53143 11.8376H3.47714C3.33033 11.8376 3.28044 11.6509 3.28044 11.5525V10.4436C3.28044 10.3467 3.33033 10.2797 3.47714 10.2797H4.64165V9.49007C4.64165 9.34326 4.85688 9.3062 5.00512 9.3062H5.22462V8.27425C3.86484 7.98918 2.79298 7.03847 2.34969 5.79272C1.10394 5.47772 0.167486 4.35027 0.167486 3.00759V1.4112C0.167486 1.11758 0.392691 0.74699 0.687737 0.74699ZM9.89691 4.44292V4.86482C10.6452 4.53129 11.2581 3.78155 11.2581 2.91209V1.32996H9.89691V4.44292ZM4.46348 3.47653L5.08921 4.088C5.11914 4.11794 5.1334 4.15927 5.12627 4.20203L4.97946 5.06437C4.96093 5.16984 5.07353 5.24966 5.16903 5.19978L6.00428 4.76219L6.83954 5.2012C6.8823 5.22401 6.93504 5.21973 6.97495 5.19122C7.01486 5.16272 7.03481 5.11425 7.02626 5.06579L6.87945 4.20346C6.87232 4.16212 6.88515 4.11936 6.91651 4.08943L7.54508 3.47796C7.58072 3.44375 7.59355 3.39243 7.57787 3.34397C7.56219 3.29694 7.52228 3.2613 7.47239 3.2556L6.60721 3.13017C6.56587 3.12447 6.52881 3.09739 6.51028 3.0589L6.12259 2.27496C6.10121 2.23078 6.0556 2.20227 6.00571 2.20227C5.95582 2.20227 5.91164 2.23078 5.88883 2.27496L5.50114 3.0589C5.48261 3.09739 5.44555 3.12304 5.40421 3.13017L4.53903 3.2556C4.42927 3.27128 4.38794 3.40384 4.46348 3.47653ZM0.751879 2.91352C0.751879 3.78298 1.36478 4.53271 2.11309 4.86624V1.32996H0.751879V2.91352Z" fill={fill || (active && theme.dpTheme) || theme.dpAncillary}/>
      </g>
      <defs>
        <clipPath id="clip0_1717_51276">
          <rect width={width} height={height} fill="white" transform="matrix(-1 0 0 1 12 0)"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function IconArrowNext({width = 12, height = 12, fill, active, theme}: SvgIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 12 12" fill="none">
      <path d="M6 10L10 6L6 2" stroke={theme.dpAncillary}/>
    </svg>
  );
}

function IconExclamation({width = 12, height = 12, fill, active, theme}: SvgIconProps) {
  return (<svg width={width} height={height} fill='none' viewBox="0 0 191.812 191.812" >
    <g>
      <path d="M95.906,121.003c6.903,0,12.5-5.597,12.5-12.5V51.511c0-6.904-5.597-12.5-12.5-12.5
        s-12.5,5.596-12.5,12.5v56.993C83.406,115.407,89.003,121.003,95.906,121.003z" fill={theme.dpAncillary} stroke={theme.dpAncillary}/>
      <path d="M95.909,127.807c-3.29,0-6.521,1.33-8.841,3.66c-2.329,2.32-3.659,5.54-3.659,8.83
        s1.33,6.52,3.659,8.84c2.32,2.33,5.551,3.66,8.841,3.66s6.51-1.33,8.84-3.66c2.319-2.32,3.66-5.55,3.66-8.84s-1.341-6.51-3.66-8.83
        C102.419,129.137,99.199,127.807,95.909,127.807z" fill={fill ? theme.dpAncillary :theme.dpAncillary} stroke={theme.dpAncillary}/>
      <path d="M95.906,0C43.024,0,0,43.023,0,95.906s43.023,95.906,95.906,95.906s95.905-43.023,95.905-95.906
        S148.789,0,95.906,0z M95.906,176.812C51.294,176.812,15,140.518,15,95.906S51.294,15,95.906,15
        c44.611,0,80.905,36.294,80.905,80.906S140.518,176.812,95.906,176.812z" stroke={active ? theme.dpAncillary : theme.dpAncillary} fill={theme.dpAncillary}/>
    </g>
  </svg>);
}

export function IconCopy({width = 12, height = 12, fill, active, theme}: SvgIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path id="Vector" d="M11.0833 1.66663C11.3928 1.66663 11.6895 1.78954 11.9083 2.00833C12.1271 2.22713 12.25 2.52387 12.25 2.83329V9.83329C12.25 10.1427 12.1271 10.4395 11.9083 10.6583C11.6895 10.877 11.3928 11 11.0833 11H9.91667V12.1666C9.91667 12.476 9.79375 12.7728 9.57496 12.9916C9.35616 13.2104 9.05942 13.3333 8.75 13.3333H2.91667C2.60725 13.3333 2.3105 13.2104 2.09171 12.9916C1.87292 12.7728 1.75 12.476 1.75 12.1666V5.16663C1.75 4.85721 1.87292 4.56046 2.09171 4.34167C2.3105 4.12288 2.60725 3.99996 2.91667 3.99996H4.08333V2.83329C4.08333 2.52387 4.20625 2.22713 4.42504 2.00833C4.64383 1.78954 4.94058 1.66663 5.25 1.66663H11.0833ZM5.83333 9.24996H4.66667C4.51799 9.25012 4.37498 9.30706 4.26687 9.40912C4.15876 9.51119 4.0937 9.65068 4.08498 9.79911C4.07627 9.94753 4.12456 10.0937 4.21999 10.2077C4.31542 10.3217 4.45078 10.395 4.59842 10.4125L4.66667 10.4166H5.83333C5.98201 10.4165 6.12502 10.3595 6.23313 10.2575C6.34124 10.1554 6.4063 10.0159 6.41502 9.86748C6.42373 9.71906 6.37544 9.57291 6.28001 9.45889C6.18458 9.34488 6.04922 9.2716 5.90158 9.25404L5.83333 9.24996ZM11.0833 2.83329H5.25V3.99996H8.75C9.05942 3.99996 9.35616 4.12288 9.57496 4.34167C9.79375 4.56046 9.91667 4.85721 9.91667 5.16663V9.83329H11.0833V2.83329ZM7 6.91663H4.66667C4.51196 6.91663 4.36358 6.97808 4.25419 7.08748C4.14479 7.19688 4.08333 7.34525 4.08333 7.49996C4.08333 7.65467 4.14479 7.80304 4.25419 7.91244C4.36358 8.02183 4.51196 8.08329 4.66667 8.08329H7C7.15471 8.08329 7.30308 8.02183 7.41248 7.91244C7.52187 7.80304 7.58333 7.65467 7.58333 7.49996C7.58333 7.34525 7.52187 7.19688 7.41248 7.08748C7.30308 6.97808 7.15471 6.91663 7 6.91663Z" fill="#BFBFC0"/>
    </svg>
  );
}

export function IconClose({width = 24, height = 24, fill, active, theme}: SvgIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11.5" fill={theme.dpBackground} stroke={theme.iconBorderColor}/>
      <path d="M8.3999 8.3999L15.6 15.6" stroke={theme.dpTheme} strokeWidth="1.2" strokeMiterlimit="4.13357" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.3999 15.6001L15.6 8.40001" stroke={theme.dpTheme} strokeWidth="1.2" strokeMiterlimit="4.13357" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconArrow2({width = 8, height = 7, fill, active, theme}: SvgIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 8 7" fill="none">
      <path d="M5.23299 6.22033C4.63647 7.08134 3.36353 7.08134 2.76701 6.22033L0.434915 2.85424C-0.254305 1.85944 0.457678 0.5 1.66791 0.5L6.33209 0.5C7.54232 0.5 8.25431 1.85944 7.56509 2.85424L5.23299 6.22033Z" fill={fill || theme.dpTheme} />
    </svg>
  );
}
export function IconDown({width = 8, height = 7, fill, active, theme}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 5 5" fill="none">
      <path d="M3.36603 4.5C2.98112 5.16667 2.01887 5.16667 1.63397 4.5L0.334936 2.25C-0.0499643 1.58333 0.431161 0.75 1.20096 0.75L3.79904 0.75C4.56884 0.75 5.04996 1.58333 4.66506 2.25L3.36603 4.5Z" fill="#24C23D"/>
    </svg>
  );
}
export function IconUp({width = 8, height = 7, fill, active, theme}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 5 5" fill="none">
      <path d="M1.63397 0.5C2.01888 -0.166667 2.98113 -0.166667 3.36603 0.5L4.66506 2.75C5.04996 3.41667 4.56884 4.25 3.79904 4.25H1.20096C0.431161 4.25 -0.0499637 3.41667 0.334936 2.75L1.63397 0.5Z" fill="#ED4949"/>
    </svg>
  );
}
export function IconAdd({width = 8, height = 7, fill, active, theme}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8H13" stroke="#3586FF"/>
      <path d="M8 3L8 13" stroke="#3586FF"/>
    </svg>
  );
}
export function IconMore({width = 8, height = 7, fill, active, theme}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="5" height="8" viewBox="0 0 5 8" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M0.338168 4.63978C0.271281 4.6398 0.2059 4.66482 0.15029 4.71169C0.0946798 4.75855 0.0513379 4.82515 0.0257432 4.90307C0.000148529 4.98098 -0.00654973 5.06672 0.00649537 5.14943C0.0195405 5.23215 0.0517433 5.30813 0.0990325 5.36777L1.79023 7.50013C1.85366 7.58009 1.93968 7.625 2.02937 7.625C2.11906 7.625 2.20508 7.58009 2.26851 7.50013L3.95971 5.36777C4.007 5.30813 4.0392 5.23215 4.05224 5.14943C4.06529 5.06672 4.05859 4.98098 4.033 4.90307C4.0074 4.82515 3.96406 4.75855 3.90845 4.71169C3.85284 4.66482 3.78746 4.6398 3.72057 4.63978H0.338168Z" fill="#3586FF"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.338168 0.374892C0.271281 0.37491 0.2059 0.399932 0.15029 0.446795C0.0946798 0.493657 0.0513379 0.560256 0.0257432 0.638173C0.000148529 0.716089 -0.00654973 0.801824 0.00649537 0.88454C0.0195405 0.967255 0.0517433 1.04324 0.0990325 1.10288L1.79023 3.23524C1.85366 3.31519 1.93968 3.36011 2.02937 3.36011C2.11906 3.36011 2.20508 3.31519 2.26851 3.23524L3.95971 1.10288C4.007 1.04324 4.0392 0.967255 4.05224 0.88454C4.06529 0.801824 4.05859 0.716089 4.033 0.638173C4.0074 0.560256 3.96406 0.493657 3.90845 0.446795C3.85284 0.399932 3.78746 0.37491 3.72057 0.374892L0.338168 0.374892Z" fill="#3586FF"/>
    </svg>
  );
}
export function IconRemoveSeries({width = 8, height = 7, fill, active, theme}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="14" viewBox="0 0 24 14" fill="none">
      <path opacity="0.3" d="M0 10C0 4.47715 4.47715 0 10 0H24V8C24 11.3137 21.3137 14 18 14H0V10Z" fill="#74767C"/>
    </svg>
  );
}
export function IconRemoveSeries2({width = 8, height = 7, fill, active, theme}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
      <g clipPath="url(#clip0_1313_51386)">
        <path d="M1.33337 1.33325L6.66671 6.66659" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1.33337 6.66659L6.66671 1.33325" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_1313_51386">
          <rect width="8" height="8" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
export function IconDel({width = 8, height = 7, fill, active, theme}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g clipPath="url(#clip0_1313_50785)">
        <path d="M3 3.33325V14.6666H13V3.33325H3Z" stroke="#3586FF" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M6.66663 6.66675V11.0001" stroke="#3586FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.33337 6.66675V11.0001" stroke="#3586FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1.33337 3.33325H14.6667" stroke="#3586FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.33337 3.33325L6.42971 1.33325H9.59241L10.6667 3.33325H5.33337Z" stroke="#3586FF" strokeWidth="1.2" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_1313_50785">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function IconGroupBet({width = 14, height = 14, fill, active, theme}: SvgIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.05999 1.68018C4.52665 1.68018 4.75999 1.91351 4.75999 2.38018V11.6202C4.75999 12.0868 4.52665 12.3202 4.05999 12.3202C3.59332 12.3202 3.35999 12.0868 3.35999 11.6202V2.38018C3.35999 1.91351 3.59332 1.68018 4.05999 1.68018Z" fill={fill || theme.dpTheme}/>
      <path d="M2.80005 9.38012C2.80005 9.71429 2.9328 10.0348 3.16909 10.2711C3.40539 10.5074 3.72588 10.6401 4.06005 10.6401C4.39422 10.6401 4.71471 10.5074 4.951 10.2711C5.1873 10.0348 5.32005 9.71429 5.32005 9.38012C5.32005 9.04594 5.1873 8.72546 4.951 8.48916C4.71471 8.25287 4.39422 8.12012 4.06005 8.12012C3.72588 8.12012 3.40539 8.25287 3.16909 8.48916C2.9328 8.72546 2.80005 9.04594 2.80005 9.38012Z" fill={fill || theme.dpTheme}/>
      <path d="M7.13994 1.68018C7.60661 1.68018 7.83994 1.91351 7.83994 2.38018V11.6202C7.83994 12.0868 7.60661 12.3202 7.13994 12.3202C6.67327 12.3202 6.43994 12.0868 6.43994 11.6202V2.38018C6.43994 1.91351 6.67327 1.68018 7.13994 1.68018Z" fill={fill || theme.dpTheme}/>
      <path d="M5.88 4.34008C5.88 4.67425 6.01275 4.99474 6.24905 5.23103C6.48535 5.46733 6.80583 5.60008 7.14 5.60008C7.47418 5.60008 7.79466 5.46733 8.03096 5.23103C8.26726 4.99474 8.40001 4.67425 8.40001 4.34008C8.40001 4.00591 8.26726 3.68542 8.03096 3.44912C7.79466 3.21283 7.47418 3.08008 7.14 3.08008C6.80583 3.08008 6.48535 3.21283 6.24905 3.44912C6.01275 3.68542 5.88 4.00591 5.88 4.34008Z" fill={fill || theme.dpTheme}/>
      <path d="M8.95996 9.38012C8.95996 9.71429 9.09271 10.0348 9.32901 10.2711C9.5653 10.5074 9.88579 10.6401 10.22 10.6401C10.5541 10.6401 10.8746 10.5074 11.1109 10.2711C11.3472 10.0348 11.48 9.71429 11.48 9.38012C11.48 9.21465 11.4474 9.05081 11.384 8.89794C11.3207 8.74507 11.2279 8.60616 11.1109 8.48916C10.9939 8.37216 10.855 8.27935 10.7021 8.21603C10.5493 8.15271 10.3854 8.12012 10.22 8.12012C10.0545 8.12012 9.89065 8.15271 9.73778 8.21603C9.58491 8.27935 9.44601 8.37216 9.32901 8.48916C9.212 8.60616 9.11919 8.74507 9.05587 8.89794C8.99255 9.05081 8.95996 9.21465 8.95996 9.38012Z" fill={fill || theme.dpTheme}/>
      <path d="M10.22 1.68018C10.6867 1.68018 10.92 1.91351 10.92 2.38018V11.6202C10.92 12.0868 10.6867 12.3202 10.22 12.3202C9.75335 12.3202 9.52002 12.0868 9.52002 11.6202V2.38018C9.52002 1.91351 9.75335 1.68018 10.22 1.68018Z" fill={fill || theme.dpTheme}/>
    </svg>
  );
}

function IconArrowDown({width = 12, height = 12, fill}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 13 12" fill="none">
      <path d="M1.93433 2.96892L2.89433 2.96892L4.40633 2.96892L6.24233 2.96892L8.11433 2.96892C8.71433 2.96892 9.26633 2.96692 9.77033 2.96292C10.2743 2.95892 10.6663 2.95692 10.9463 2.95692C11.1383 2.95692 11.2983 3.00292 11.4263 3.09492C11.5543 3.18692 11.6403 3.30292 11.6843 3.44292C11.7283 3.58292 11.7283 3.73692 11.6843 3.90492C11.6403 4.07292 11.5463 4.22892 11.4023 4.37292C11.0983 4.66892 10.7803 4.98892 10.4483 5.33292C10.1163 5.67692 9.78233 6.03092 9.44633 6.39492C9.11033 6.75892 8.77433 7.12692 8.43833 7.49892C8.10233 7.87092 7.77833 8.22892 7.46633 8.57292C7.33033 8.72492 7.16233 8.83892 6.96233 8.91492C6.76233 8.99092 6.55433 9.02492 6.33833 9.01692C6.12233 9.00892 5.91033 8.96292 5.70233 8.87892C5.49433 8.79492 5.31833 8.66892 5.17433 8.50092C4.90233 8.18892 4.62833 7.87892 4.35233 7.57092C4.07633 7.26292 3.79233 6.94692 3.50033 6.62292C3.20833 6.29892 2.90233 5.95892 2.58233 5.60292C2.26233 5.24692 1.92233 4.86892 1.56233 4.46892C1.40233 4.29292 1.29633 4.11492 1.24433 3.93492C1.19233 3.75492 1.18433 3.59292 1.22033 3.44892C1.25633 3.30492 1.33633 3.18892 1.46033 3.10092C1.58433 3.01292 1.74233 2.96892 1.93433 2.96892Z" fill={fill}/>
    </svg>
  );
}

export function IconExpand({width = 24, height = 24, fill, active, theme}: SvgIconProps) {
  return (
    <svg className='icon-expand' width={width} height={height} viewBox='0 0 24 24' fill='none'>
      <path
        d='M12 0C5.38329 0 0 5.3833 0 12C0 18.6167 5.38329 24 12 24C18.6167 24 24 18.6167 24 12C24 5.38327 18.6167 0 12 0Z'
        fill={fill || (active && theme.dpTheme) || theme.dpButton}
      />
      <path opacity='0.8' d='M8 8L12 11L16 8' stroke={theme.dpNormal} strokeLinecap='round' strokeLinejoin='round' />
      <path opacity='0.8' d='M8 13L12 16L16 13' stroke={theme.dpNormal} strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

export default DpIcon;
