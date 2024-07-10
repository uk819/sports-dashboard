import {isESports} from '@core/utils';
import styles from './style.scss';
import {Button} from 'antd';
import {useHistory} from 'react-router-dom';
const Page404 = () => {
  const history = useHistory();
  const goBack = () => {
    history.push('/');
  };
  const isE = isESports();
  return (
    <div className={styles.wraper}>
      <div className='logo'>
        <img src={require(`@my/assets/images/common/${isE ? 'logo_esports' : 'logo'}.webp`)} alt="logo" />
      </div>
      <div className='content'>
        <p className='ttl'>页面错误</p>
        <div className='image404'>
          <img src={require('./i/404.webp')} alt="404" />
        </div>
        <p className='desc'>
          尊敬的用户，很抱歉，此页面未找到，请您联系客服为您提供解决方案，对您造成的不便，我们深表歉意，感谢您的理解与支持。
        </p>
      </div>
      <Button onClick={goBack} type='primary' className='goBack'>
        返回主页
      </Button>
    </div>
  );
};
export default Page404;
