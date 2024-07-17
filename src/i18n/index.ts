import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
// i18next-browser-languagedetector插件 这是一个 i18next 语言检测插件，用于检测浏览器中的用户语言，
// import LanguageDetector from 'i18next-browser-languagedetector';
import {crc32} from 'crc';
// 引入需要实现国际化的简体、繁体、英文三种数据的json文件
import zhCN from 'antd/locale/zh_CN';
import en from 'antd/locale/en_GB';
import localZh from './json/zh-CN.json'; // 本地翻译中文文件
import localEn from './json/en-US.json'; // 本地翻译英文文件
import G from '@constants/global';

const resources: any = {
  'zh-CN': {
    translation: localZh,
    ...zhCN,
  },
  'en': {
    translation: localEn,
    ...en,
  },
  'en-US': {
    translation: localEn,
    ...en,
  },
};

i18n
    // .use(LanguageDetector) // 嗅探当前浏览器语言 zh-CN
    .use(initReactI18next) // 将 i18n 向下传递给 react-i18next
    .init({
    // 初始化
      resources, // 本地多语言数据
      fallbackLng: 'localZh_CN', // 默认当前环境的语言
      detection: {
        caches: ['localStorage', 'sessionStorage', 'cookie'],
      },
    });
export const t = (key: string, params?: any): string => {
  const hashKey = `k${crc32(key).toString(16)}`; // 将中文转换成crc32格式去匹配对应的json语言包
  let words = _.get(resources[G.GET('LANGUAGE') === 'zh-cn' ? 'zh-CN' : G.GET('LANGUAGE')], 'translation')[hashKey];
  // let words = i18n.t(hashKey);
  if (words === hashKey) {
    words = key;
  }

  if (params) {
    // 配置传递参数的场景, 参数为对象
    if (Object.keys(params)?.length > 0) {
      const reg = /\{\{[\S\s]+\}\}/;
      words = words?.replace(reg, (a: string, b: number) => {
        const key = a.replace('{{', '').replace('}}', '');
        return params[key];
      });
    }
  }
  return words || key;
};

export default i18n;
