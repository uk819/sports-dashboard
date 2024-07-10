import css from './style.scss';

export default ({team, name}: {team: 'home' | 'away', name: string}) => {
  return (
    <div className={css.wrapper}>
      <div className='logo'>
        <img src={require(`../../i/${team}-logo.webp`)} alt='team-logo' />
      </div>
      <div className='name'>{name}</div>
    </div>
  );
};
