export const addDecimals = (a: number, b: number) => {
  const precision = 10 ** 10;
  return (a * precision + b * precision) / precision;
};

export const subtractDecimals = (a: number, b: number) => {
  const precision = 10 ** 10;
  return (a * precision - b * precision) / precision;
};

export const truncateDecimals = (number: number, decimalPlaces: number) => {
  const numberString = number.toString();
  const [integerPart, decimalPart] = numberString.split('.');
  const truncatedDecimalPart = decimalPart ? decimalPart.slice(0, decimalPlaces) : '';

  return `${integerPart}.${truncatedDecimalPart.padEnd(decimalPlaces, '0')}`;
};
export const amountVilidation = (v: string )=>{
  return v.replace(/[^\d.]/g, '') // 将非数字和点以外的字符替换成空
      .replace(/^\./g, '') // 验证第一个字符是数字而不是点
      .replace(/\.{2,}/g, '.') // 出现多个点时只保留第一个
      .replace('.', '$#$') // 1、将数字的点替换成复杂字符$#$
      .replace(/\./g, '') // 2、将字符串的点直接清掉
      .replace('$#$', '.') // 3、将复杂字符再转换回点
      .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
};

export const interceptedTwoDigits = (digital: number)=>{
  return Math.floor(digital*1000000)/1000000;
};
export const interceptedTwoDigitsToString = (digital: number)=>{
  const n = interceptedTwoDigits(digital);
  return n.toFixed(2);
};
export const getSeriesDigitsStr =(seriesType: number, len: number)=>{
  switch (seriesType) {
    case 10001013: return '10串1013';
    case 10001: return '10串1';
    default:
      return perSeriesStr(seriesType, len);
  };
};
export const perSeriesStr = (type: number, len:number)=>{
  const frist = String(type).charAt(0);
  if (Number(frist) === len) {
    return String(type).replace('00', '串');
  }
  return String(type).charAt(0)+'串1';
};
