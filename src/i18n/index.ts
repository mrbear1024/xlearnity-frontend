import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入语言资源
import en from './locales/en.json';
import zh from './locales/zh.json';

const resources = {
  en: {
    translation: en
  },
  zh: {
    translation: zh
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // 默认语言为英文
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // react already does escaping
    },
    
    // 调试模式（生产环境中应关闭）
    debug: import.meta.env.DEV,
  });

export default i18n;