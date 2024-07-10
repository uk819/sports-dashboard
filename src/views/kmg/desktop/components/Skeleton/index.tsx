import MatchSkeleton from './SkeletonMatchList';
import GameResultSkeleton from './SkeletonGameResultList';
import GameResultDetailSkeleton from './SkeletonGameResultDetail';
import {ELoadingKeys} from '@core/constants/enum/sport';

interface IProps {
  type: string;
  length?: number;
}

function DpSkeleton({type, length = 1}: IProps) {
  return (
    <div>
      {
        new Array(length).fill(0).map((_, idx) => <SkeletonComp type={type} key={idx} />)
      }
    </div>
  );
}

function SkeletonComp({type}: { type: IProps['type'] }) {
  switch (type) {
    case 'match':
      return <MatchSkeleton />;
    case ELoadingKeys.GAMES_RESULT:
      return <GameResultSkeleton />;
    case ELoadingKeys.GAME_RESULT_DETAIL:
      return <GameResultDetailSkeleton />;
    default:
      return null;
  }
}

export default React.memo(DpSkeleton);
