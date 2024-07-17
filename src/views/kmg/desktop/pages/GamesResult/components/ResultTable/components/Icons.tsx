import {EGameResult} from '@core/constants/enum/sport/gamesResult';

// 足球图标
export const football = {
  [EGameResult.H1YC]: {
    title: '上半场黄牌',
    element: <YellowCardFirstHalf />,
  },
  [EGameResult.H2YC]: {
    title: '下半场黄牌',
    element: <YellowCardSecondHalf/>,
  },
  [EGameResult.FTYC]: {
    title: '全场黄牌',
    element: <YellowCardFullTime/>,
  },
  [EGameResult.H1RC]: {
    title: '上半场红牌',
    element: <RedCardFirstHalf />,
  },
  [EGameResult.H2RC]: {
    title: '下半场红牌',
    element: <RedCardSecondHalf/>,
  },
  [EGameResult.FTRC]: {
    title: '全场红牌',
    element: <RedCardFullTime/>,
  },
  [EGameResult.H1CK]: {
    title: '上半场角球',
    element: <CornerKickFirstHalf />,
  },
  [EGameResult.H2CK]: {
    title: '下半场角球',
    element: <CornerKickSecondHalf/>,
  },
  [EGameResult.FTCK]: {
    title: '全场角球',
    element: <CornerKickFullTime/>,
  },
  [EGameResult.Q1G]: {
    title: '上半场进球',
    element: <GoalFirstHalf />,
  },
  [EGameResult.Q2G]: {
    title: '下半场进球',
    element: <GoalSecondHalf/>,
  },
  [EGameResult.FTG]: {
    title: '全场进球',
    element: <GoalFullTime/>,
  },
  [EGameResult.OTG]: {
    title: '加时赛',
    element: <GoalOvertime/>,
  },
  // not match currently, have to ask backend
  [EGameResult.PK]: {
    title: '点球大战',
    element: <PenaltyKick/>,
  },
};

// 篮球图标
export const basketball = {
  [EGameResult.Q1G]: {title: 'Q1'},
  [EGameResult.Q2G]: {title: 'Q2'},
  [EGameResult.Q3G]: {title: 'Q3'},
  [EGameResult.Q4G]: {title: 'Q4'},
  [EGameResult.OTG]: {title: '加时'},
  [EGameResult.FHG]: {title: '上'},
  [EGameResult.SHG]: {title: '下'},
  [EGameResult.OT_SECOND_HALF]: {title: '下&加时'},
  [EGameResult.FTG]: {title: '总分'},
};

// 网球（3）
export const tennis = {
  [EGameResult.Q1G]: {title: '1'},
  [EGameResult.Q2G]: {title: '2'},
  [EGameResult.Q3G]: {title: '3'},
  [EGameResult.Q4G]: {title: '4'},
  [EGameResult.Q5G]: {title: '5'},
  [EGameResult.TGAMES]: {title: '总局数'},
  [EGameResult.SET]: {title: '盘分'},
};

// 斯诺克（5）
export const snooker = {
  [EGameResult.FG]: {title: '总分'},
  [EGameResult.GSCORE]: {title: '局比分'},
};

// 排球（6）
export const volleyball = {
  [EGameResult.Q1G]: {title: '1'},
  [EGameResult.Q2G]: {title: '2'},
  [EGameResult.Q3G]: {title: '3'},
  [EGameResult.Q4G]: {title: '4'},
  [EGameResult.Q5G]: {title: '5'},
  [EGameResult.FG]: {title: '总分'},
  [EGameResult.GSCORE]: {title: '局比分'},
};

// 橄榄球（9）
export const rugby = {
  [EGameResult.FHG]: {title: '上半场'},
  [EGameResult.SHG]: {title: '下半场'},
  [EGameResult.OTG]: {title: '加时'},
  [EGameResult.PSO]: {title: '点球'},
  [EGameResult.FTG]: {title: '全场'},
};

// 手球 (11)
export const handball = {
  [EGameResult.FHG]: {title: '上半场'},
  [EGameResult.SHG]: {title: '下半场'},
  [EGameResult.FTG]: {title: '全场'},
  [EGameResult.OTG]: {title: '加时'},
  [EGameResult.PSO]: {title: '点球'},
};

// 冰球（12）
export const iceHockey = {
  [EGameResult.Q1G]: {title: '1'},
  [EGameResult.Q2G]: {title: '2'},
  [EGameResult.Q3G]: {title: '3'},
  [EGameResult.OTG]: {title: '加时'},
  [EGameResult.PSO]: {title: '点球'},
  [EGameResult.FG]: {title: '全场'},
};

// 美式足球（16）
export const americasoccer = {
  [EGameResult.Q1G]: {title: '1'},
  [EGameResult.Q2G]: {title: '2'},
  [EGameResult.Q3G]: {title: '3'},
  [EGameResult.Q4G]: {title: '4'},
  [EGameResult.OTG]: {title: '加时'},
  [EGameResult.FHG]: {title: '上半场'},
  [EGameResult.SHG]: {title: '下半场'},
  [EGameResult.OT_SECOND_HALF]: {title: '下&加时'},
  [EGameResult.FG]: {title: '总分'},
};

// 棒球图标（18）
export const baseball = {
  [EGameResult.Q1G]: {title: '1'},
  [EGameResult.Q2G]: {title: '2'},
  [EGameResult.Q3G]: {title: '3'},
  [EGameResult.Q4G]: {title: '4'},
  [EGameResult.Q5G]: {title: '5'},
  [EGameResult.Q6G]: {title: '6'},
  [EGameResult.Q7G]: {title: '7'},
  [EGameResult.Q8G]: {title: '8'},
  [EGameResult.Q9G]: {title: '9'},
  [EGameResult.EI]: {title: 'EI'},
  [EGameResult.FIVE_COUNT]: {title: '前五局'},
  [EGameResult.FG]: {title: '全场'},
  [EGameResult.ADA]: {title: '安打'},
  // [EGameResult.OTG]: {title: '加时'},
  // [EGameResult.PSO]: {title: '点球大战'},
};

// 羽毛球（19）
export const badminton = {
  [EGameResult.Q1G]: {title: '1'},
  [EGameResult.Q2G]: {title: '2'},
  [EGameResult.Q3G]: {title: '3'},
  [EGameResult.FG]: {title: '总分'},
  [EGameResult.GSCORE]: {title: '局分'},
};

// 乒乓球（23)
export const pingpong = {
  [EGameResult.Q1G]: {title: '1'},
  [EGameResult.Q2G]: {title: '2'},
  [EGameResult.Q3G]: {title: '3'},
  [EGameResult.Q4G]: {title: '4'},
  [EGameResult.Q5G]: {title: '5'},
  [EGameResult.Q6G]: {title: '6'},
  [EGameResult.Q7G]: {title: '7'},
  [EGameResult.FG]: {title: '总分'},
  [EGameResult.GSCORE]: {title: '局分'},
};

// 沙滩排球（26）
export const beachVolleyball = {
  [EGameResult.Q1G]: {title: '1'},
  [EGameResult.Q2G]: {title: '2'},
  [EGameResult.Q3G]: {title: '3'},
  [EGameResult.Q4G]: {title: '4'},
  [EGameResult.Q5G]: {title: '5'},
  [EGameResult.FG]: {title: '总分'},
  [EGameResult.GSCORE]: {title: '局分'},
};

// 曲棍球（28）
export const hockey = {
  [EGameResult.Q1G]: {title: '1'},
  [EGameResult.Q2G]: {title: '2'},
  [EGameResult.Q3G]: {title: '3'},
  [EGameResult.Q4G]: {title: '4'},
  [EGameResult.HTG]: {title: '半场'},
  [EGameResult.OTG]: {title: '加时'},
  [EGameResult.PSO]: {title: '点球大战'},
  [EGameResult.FTG]: {title: '全场'},
};

// 其他游戏
export const otherGames = {
  [EGameResult.FG]: {title: '比分'},
};

export function YellowCardFirstHalf() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" width="10.5" height="15" rx="2" fill="#FFBC3B"/>
    <circle cx="12.5" cy="12.5" r="3" fill="white" stroke="#44CF37"/>
    <path d="M14.2322 12.4998C14.2322 12.2723 14.1874 12.047 14.1003 11.8369C14.0133 11.6267 13.8857 11.4358 13.7248 11.2749C13.564 11.1141 13.373 10.9865 13.1629 10.8994C12.9527 10.8124 12.7275 10.7676 12.5 10.7676C12.2725 10.7676 12.0473 10.8124 11.8371 10.8994C11.627 10.9865 11.436 11.1141 11.2752 11.2749C11.1143 11.4358 10.9867 11.6267 10.8997 11.8369C10.8126 12.047 10.7678 12.2723 10.7678 12.4998L12.5 12.4998H14.2322Z" fill="#50BF88"/>
  </svg>);
}

export function YellowCardSecondHalf() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" width="10.5" height="15" rx="2" fill="#FFBC3B"/>
    <circle cx="12.5" cy="12.5" r="3" fill="white" stroke="#44CF37"/>
    <path d="M14.2322 12.4998C14.2322 12.7272 14.1874 12.9525 14.1003 13.1626C14.0133 13.3728 13.8857 13.5637 13.7248 13.7246C13.564 13.8854 13.373 14.013 13.1629 14.1001C12.9527 14.1871 12.7275 14.2319 12.5 14.2319C12.2725 14.2319 12.0473 14.1871 11.8371 14.1001C11.627 14.013 11.436 13.8854 11.2752 13.7246C11.1143 13.5637 10.9867 13.3728 10.8997 13.1626C10.8126 12.9525 10.7678 12.7272 10.7678 12.4998L12.5 12.4998H14.2322Z" fill="#50BF88"/>
  </svg>
  );
}

export function YellowCardFullTime() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" width="10.5" height="15" rx="2" fill="#FFBC3B"/>
  </svg>);
}

export function RedCardFirstHalf() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" width="10.5" height="15" rx="2" fill="#E94343"/>
    <circle cx="12.5" cy="12.5" r="3" fill="white" stroke="#44CF37"/>
    <path d="M14.2322 12.4998C14.2322 12.2723 14.1874 12.047 14.1003 11.8369C14.0133 11.6267 13.8857 11.4358 13.7248 11.2749C13.564 11.1141 13.373 10.9865 13.1629 10.8994C12.9527 10.8124 12.7275 10.7676 12.5 10.7676C12.2725 10.7676 12.0473 10.8124 11.8371 10.8994C11.627 10.9865 11.436 11.1141 11.2752 11.2749C11.1143 11.4358 10.9867 11.6267 10.8997 11.8369C10.8126 12.047 10.7678 12.2723 10.7678 12.4998L12.5 12.4998H14.2322Z" fill="#50BF88"/>
  </svg>);
}

export function RedCardSecondHalf() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" width="10.5" height="15" rx="2" fill="#E94343"/>
    <circle cx="12.5" cy="12.5" r="3" fill="white" stroke="#44CF37"/>
    <path d="M14.2322 12.4998C14.2322 12.7272 14.1874 12.9525 14.1003 13.1626C14.0133 13.3728 13.8857 13.5637 13.7248 13.7246C13.564 13.8854 13.373 14.013 13.1629 14.1001C12.9527 14.1871 12.7275 14.2319 12.5 14.2319C12.2725 14.2319 12.0473 14.1871 11.8371 14.1001C11.627 14.013 11.436 13.8854 11.2752 13.7246C11.1143 13.5637 10.9867 13.3728 10.8997 13.1626C10.8126 12.9525 10.7678 12.7272 10.7678 12.4998L12.5 12.4998H14.2322Z" fill="#50BF88"/>
  </svg>);
}

export function RedCardFullTime() {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" width="10.5" height="15" rx="2" fill="#E94343"/>
  </svg>);
}

export function CornerKickFirstHalf() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#clip0_1667_136927)">
      <path d="M15.0215 15.6833H1.03748V15.2033L7.40548 8.93131C7.40548 8.93131 13.8695 8.64491 15.0215 15.6833Z" fill="#44CF37"/>
      <path d="M13.1424 15.1616H2.14722L7.31042 9.91357L7.88162 10.4736L4.05762 14.3616H13.1424V15.1616Z" fill="#FCFCFC"/>
      <path d="M8.1736 14.9554L7.4744 14.5682C7.7096 14.1394 7.7144 13.7394 7.4872 13.3842C7.1592 12.8658 6.372 12.5362 5.6888 12.5602L5.6344 11.7634C6.6424 11.6994 7.6744 12.1858 8.1624 12.9522C8.5464 13.5602 8.5528 14.2706 8.1736 14.9554Z" fill="#FCFCFC"/>
      <path d="M1.83519 15.6832H0.799988V0.47998L1.83519 1.55998V15.6832Z" fill="#BFBFC0"/>
      <path d="M10.344 4.47198C10.344 4.47198 8.02879 6.61598 6.40319 6.66398C4.99839 6.70878 4.49119 6.18398 3.26079 5.96798C2.02879 5.75198 0.799988 6.74878 0.799988 6.74878V0.47998C0.799988 0.47998 4.47039 1.54398 5.97759 3.32318C7.48479 5.10238 10.344 4.47038 10.344 4.47038" fill="#DE4E52"/>
      <circle cx="12.5" cy="12.5" r="3" fill="white" stroke="#44CF37"/>
      <path d="M14.2322 12.4998C14.2322 12.2723 14.1874 12.047 14.1003 11.8369C14.0133 11.6267 13.8857 11.4358 13.7248 11.2749C13.564 11.1141 13.373 10.9865 13.1629 10.8994C12.9527 10.8124 12.7275 10.7676 12.5 10.7676C12.2725 10.7676 12.0473 10.8124 11.8371 10.8994C11.627 10.9865 11.436 11.1141 11.2752 11.2749C11.1143 11.4358 10.9867 11.6267 10.8997 11.8369C10.8126 12.047 10.7678 12.2723 10.7678 12.4998L12.5 12.4998H14.2322Z" fill="#44CF37"/>
    </g>
    <defs>
      <clipPath id="clip0_1667_136927">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>);
}

export function CornerKickSecondHalf() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#clip0_1667_136919)">
      <path d="M15.0215 15.6833H1.03748V15.2033L7.40548 8.93131C7.40548 8.93131 13.8695 8.64491 15.0215 15.6833Z" fill="#44CF37"/>
      <path d="M13.1424 15.1616H2.14722L7.31042 9.91357L7.88162 10.4736L4.05762 14.3616H13.1424V15.1616Z" fill="#FCFCFC"/>
      <path d="M8.1736 14.9554L7.4744 14.5682C7.7096 14.1394 7.7144 13.7394 7.4872 13.3842C7.1592 12.8658 6.372 12.5362 5.6888 12.5602L5.6344 11.7634C6.6424 11.6994 7.6744 12.1858 8.1624 12.9522C8.5464 13.5602 8.5528 14.2706 8.1736 14.9554Z" fill="#FCFCFC"/>
      <path d="M1.83519 15.6832H0.799988V0.47998L1.83519 1.55998V15.6832Z" fill="#BFBFC0"/>
      <path d="M10.344 4.47198C10.344 4.47198 8.02879 6.61598 6.40319 6.66398C4.99839 6.70878 4.49119 6.18398 3.26079 5.96798C2.02879 5.75198 0.799988 6.74878 0.799988 6.74878V0.47998C0.799988 0.47998 4.47039 1.54398 5.97759 3.32318C7.48479 5.10238 10.344 4.47038 10.344 4.47038" fill="#DE4E52"/>
      <circle cx="12.5" cy="12.5" r="3" fill="white" stroke="#44CF37"/>
      <path d="M14.2322 12.4998C14.2322 12.7272 14.1874 12.9525 14.1003 13.1626C14.0133 13.3728 13.8857 13.5637 13.7248 13.7246C13.564 13.8854 13.373 14.013 13.1629 14.1001C12.9527 14.1871 12.7275 14.2319 12.5 14.2319C12.2725 14.2319 12.0473 14.1871 11.8371 14.1001C11.627 14.013 11.436 13.8854 11.2752 13.7246C11.1143 13.5637 10.9867 13.3728 10.8997 13.1626C10.8126 12.9525 10.7678 12.7272 10.7678 12.4998L12.5 12.4998H14.2322Z" fill="#44CF37"/>
    </g>
    <defs>
      <clipPath id="clip0_1667_136919">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>);
}

export function CornerKickFullTime() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#clip0_1667_136897)">
      <path d="M15.0215 15.6833H1.03748V15.2033L7.40548 8.93131C7.40548 8.93131 13.8695 8.64491 15.0215 15.6833Z" fill="#44CF37"/>
      <path d="M13.1424 15.1616H2.14722L7.31042 9.91357L7.88162 10.4736L4.05762 14.3616H13.1424V15.1616Z" fill="#FCFCFC"/>
      <path d="M8.1736 14.9554L7.4744 14.5682C7.7096 14.1394 7.7144 13.7394 7.4872 13.3842C7.1592 12.8658 6.372 12.5362 5.6888 12.5602L5.6344 11.7634C6.6424 11.6994 7.6744 12.1858 8.1624 12.9522C8.5464 13.5602 8.5528 14.2706 8.1736 14.9554Z" fill="#FCFCFC"/>
      <path d="M1.83519 15.6832H0.799988V0.47998L1.83519 1.55998V15.6832Z" fill="#BFBFC0"/>
      <path d="M10.344 4.47198C10.344 4.47198 8.02879 6.61598 6.40319 6.66398C4.99839 6.70878 4.49119 6.18398 3.26079 5.96798C2.02879 5.75198 0.799988 6.74878 0.799988 6.74878V0.47998C0.799988 0.47998 4.47039 1.54398 5.97759 3.32318C7.48479 5.10238 10.344 4.47038 10.344 4.47038" fill="#DE4E52"/>
    </g>
    <defs>
      <clipPath id="clip0_1667_136897">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>);
}

export function GoalFirstHalf() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85651 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15C9.85651 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85651 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85651 1 8 1ZM5.4555 2.42625L7.56425 3.6565V5.144L5.14137 6.852L3.77637 6.35588L3.22862 4.15788C3.82664 3.41584 4.58901 2.82303 5.4555 2.42625ZM1.90475 8.6055L3.50338 7.188L4.85613 7.67888L5.7705 10.5576L5.14313 11.4965H2.9705C2.37331 10.6401 2.00632 9.64459 1.90475 8.6055ZM6.57637 13.9587L5.86325 11.9935L6.4845 11.0634H9.51812L10.1403 11.9935L9.42712 13.9579C8.49004 14.1816 7.51346 14.1825 6.57637 13.9587ZM13.0295 11.4956H10.8612L10.2312 10.555L11.1281 7.67888L12.4993 7.18538L14.0952 8.60462C13.9937 9.64371 13.6267 10.6392 13.0295 11.4956ZM12.7758 4.16312L12.228 6.35325L10.842 6.852L8.43838 5.144V3.6565L10.5462 2.42625C11.4142 2.82416 12.1776 3.41884 12.7758 4.16312Z" fill="#44CF37"/>
    <circle cx="12.5" cy="11.5" r="3" fill="white" stroke="#44CF37"/>
    <path d="M14.2322 11.4998C14.2322 11.2723 14.1874 11.047 14.1003 10.8369C14.0133 10.6267 13.8857 10.4358 13.7248 10.2749C13.564 10.1141 13.373 9.98648 13.1629 9.89943C12.9527 9.81238 12.7275 9.76758 12.5 9.76758C12.2725 9.76758 12.0473 9.81238 11.8371 9.89943C11.627 9.98648 11.436 10.1141 11.2752 10.2749C11.1143 10.4358 10.9867 10.6267 10.8997 10.8369C10.8126 11.047 10.7678 11.2723 10.7678 11.4998L12.5 11.4998H14.2322Z" fill="#44CF37"/>
  </svg>);
}

export function GoalSecondHalf() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85651 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15C9.85651 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85651 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85651 1 8 1ZM5.4555 2.42625L7.56425 3.6565V5.144L5.14137 6.852L3.77637 6.35588L3.22862 4.15788C3.82664 3.41584 4.58901 2.82303 5.4555 2.42625ZM1.90475 8.6055L3.50338 7.188L4.85613 7.67888L5.7705 10.5576L5.14313 11.4965H2.9705C2.37331 10.6401 2.00632 9.64459 1.90475 8.6055ZM6.57637 13.9587L5.86325 11.9935L6.4845 11.0634H9.51812L10.1403 11.9935L9.42712 13.9579C8.49004 14.1816 7.51346 14.1825 6.57637 13.9587ZM13.0295 11.4956H10.8612L10.2312 10.555L11.1281 7.67888L12.4993 7.18538L14.0952 8.60462C13.9937 9.64371 13.6267 10.6392 13.0295 11.4956ZM12.7758 4.16312L12.228 6.35325L10.842 6.852L8.43838 5.144V3.6565L10.5462 2.42625C11.4142 2.82416 12.1776 3.41884 12.7758 4.16312Z" fill="#44CF37"/>
    <circle cx="12.5" cy="11.5" r="3" fill="white" stroke="#44CF37"/>
    <path d="M14.2322 11.4998C14.2322 11.7272 14.1874 11.9525 14.1003 12.1626C14.0133 12.3728 13.8857 12.5637 13.7248 12.7246C13.564 12.8854 13.373 13.013 13.1629 13.1001C12.9527 13.1871 12.7275 13.2319 12.5 13.2319C12.2725 13.2319 12.0473 13.1871 11.8371 13.1001C11.627 13.013 11.436 12.8854 11.2752 12.7246C11.1143 12.5637 10.9867 12.3728 10.8997 12.1626C10.8126 11.9525 10.7678 11.7272 10.7678 11.4998L12.5 11.4998H14.2322Z" fill="#44CF37"/>
  </svg>);
}

export function GoalFullTime() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1ZM5.4555 2.42625L7.56425 3.6565V5.144L5.14137 6.852L3.77637 6.35588L3.22862 4.15788C3.82664 3.41584 4.58901 2.82303 5.4555 2.42625ZM1.90475 8.6055L3.50338 7.188L4.85613 7.67888L5.7705 10.5576L5.14313 11.4965H2.9705C2.37331 10.6401 2.00632 9.64459 1.90475 8.6055ZM6.57638 13.9587L5.86325 11.9935L6.4845 11.0634H9.51812L10.1403 11.9935L9.42712 13.9579C8.49004 14.1816 7.51346 14.1825 6.57638 13.9587ZM13.0295 11.4956H10.8612L10.2312 10.555L11.1281 7.67888L12.4993 7.18538L14.0952 8.60462C13.9937 9.64371 13.6267 10.6392 13.0295 11.4956ZM12.7758 4.16312L12.228 6.35325L10.842 6.852L8.43838 5.144V3.6565L10.5462 2.42625C11.4142 2.82416 12.1776 3.41884 12.7758 4.16312Z" fill="#44CF37"/>
  </svg>);
}

export function GoalOvertime() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85651 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15C9.85651 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85651 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85651 1 8 1ZM5.4555 2.42625L7.56425 3.6565V5.144L5.14137 6.852L3.77637 6.35588L3.22862 4.15788C3.82664 3.41584 4.58901 2.82303 5.4555 2.42625ZM1.90475 8.6055L3.50338 7.188L4.85613 7.67888L5.7705 10.5576L5.14313 11.4965H2.9705C2.37331 10.6401 2.00632 9.64459 1.90475 8.6055ZM6.57637 13.9587L5.86325 11.9935L6.4845 11.0634H9.51812L10.1403 11.9935L9.42712 13.9579C8.49004 14.1816 7.51346 14.1825 6.57637 13.9587ZM13.0295 11.4956H10.8612L10.2312 10.555L11.1281 7.67888L12.4993 7.18538L14.0952 8.60462C13.9937 9.64371 13.6267 10.6392 13.0295 11.4956ZM12.7758 4.16312L12.228 6.35325L10.842 6.852L8.43838 5.144V3.6565L10.5462 2.42625C11.4142 2.82416 12.1776 3.41884 12.7758 4.16312Z" fill="#44CF37"/>
    <circle cx="12.5" cy="11.5" r="3" fill="white" stroke="#44CF37"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12.25 11.75V13H12.75V11.75H14V11.25H12.75V10H12.25V11.25H11V11.75H12.25Z" fill="#44CF37"/>
  </svg>);
}

export function PenaltyKick() {
  return ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <ellipse cx="8" cy="14.4886" rx="5.91589" ry="1.51111" fill="#D2D5D9"/>
    <path d="M8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1ZM5.4555 2.42625L7.56425 3.6565V5.144L5.14137 6.852L3.77637 6.35588L3.22862 4.15788C3.82664 3.41584 4.58901 2.82303 5.4555 2.42625ZM1.90475 8.6055L3.50338 7.188L4.85613 7.67888L5.7705 10.5576L5.14313 11.4965H2.9705C2.37331 10.6401 2.00632 9.64459 1.90475 8.6055ZM6.57638 13.9587L5.86325 11.9935L6.4845 11.0634H9.51812L10.1403 11.9935L9.42712 13.9579C8.49004 14.1816 7.51346 14.1825 6.57638 13.9587ZM13.0295 11.4956H10.8612L10.2312 10.555L11.1281 7.67888L12.4993 7.18538L14.0952 8.60462C13.9937 9.64371 13.6267 10.6392 13.0295 11.4956ZM12.7758 4.16312L12.228 6.35325L10.842 6.852L8.43838 5.144V3.6565L10.5462 2.42625C11.4142 2.82416 12.1776 3.41884 12.7758 4.16312Z" fill="#A6B4C1"/>
  </svg>);
}
