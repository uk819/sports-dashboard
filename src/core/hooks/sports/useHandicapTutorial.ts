import usePublicState from '../usePublicState';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const handleHandicapTutorial = () => {
    dispatch(ACTIONS.SPORT.handleHandicapTutorial());
  };
  const handlePractice = () => {
    dispatch(ACTIONS.SPORT.handlePractice());
  };

  return {
    handleHandicapTutorial,
    handlePractice,
  };
};
