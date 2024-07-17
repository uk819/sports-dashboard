import {Image, ImageProps} from 'antd';
import DpIcon from '../Icon';
import {useMemo, useState} from 'react';
import useSettings from '@core/hooks/sports/useSettings';
import {ESportType} from '@core/constants/enum/sport';
interface IProps extends ImageProps {
  type?: 'league' | 'team';
  size?: number;
  active?: boolean;
}

const DpImage = (props: IProps) => {
  const [err, setErr] = useState(false);
  const {sportId} = useSettings();
  const errNode = useMemo(() => {
    switch (props.type) {
      case 'league':
        return <DpIcon className={props.className} type="league" />;
      case 'team':
        const {size = 20, active} = props;
        if (sportId > 33) {
          const map: Record<number, string> = {
            [ESportType.LOL]: 'lol',
            [ESportType.DOTA]: 'dota',
            [ESportType.KING]: 'king',
            [ESportType.CSGO]: 'csgo',
          };
          return <img width={size} src={require(`@my/assets/images/common/icon_${map[sportId] || 'lol'}.png`)} />;
        }
        return <DpIcon active={active} width={size} height={size} className={props.className} type="team" />;
    }
  }, [props.type, props.active, sportId]);
  return ((!props.fallback && err) || !props.src) ? errNode : <Image preview={false} onError={() => setErr(true)} {...props} placeholder={props.type ? errNode : null}></Image>;
};

export default React.memo(DpImage);
