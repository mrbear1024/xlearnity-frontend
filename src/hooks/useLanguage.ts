import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language;
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // 保存到localStorage
    localStorage.setItem('language', lng);
  };

  const initializeLanguage = () => {
    // 从localStorage获取保存的语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  };

  return {
    currentLanguage,
    changeLanguage,
    initializeLanguage,
    t
  };
};