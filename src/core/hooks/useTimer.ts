export const timer: {start: boolean, time: number, interval: any} = {
  start: false,
  time: 0,
  interval: undefined,
};
const countTime = () => {
  timer.time++;
  console.log('time -------------', timer.time);
};
export const initTimer = () => {
  console.log('init Timer -----------------');
  timer.time = 0;
  timer.start = false;
  clearInterval(timer.interval);
};

export const startTimer = () => {
  console.log('start timer --------------');
  timer.interval = setInterval(countTime, 1000);
  timer.start = true;
};


