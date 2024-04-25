import entries from "lodash/entries";

export const LANG_CONFIG = {
  // English
  en: {
    name: "English",
    nameEn: "English",
  },

  "en-US": {
    name: "American English",
    nameEn: "English (US)",
  },
  "en-GB": {
    name: "British English",
    nameEn: "English (UK)",
  },

  zh: {
    nameEn: "Simplified Chinese",
    name: "简体中文",
  },

  "zh-CN": {
    nameEn: "Simplified Chinese",
    name: "简体中文",
  },

  "zh-HK": {
    nameEn: "Traditional Chinese",
    name: "繁體中文",
  },

  ja: {
    name: "日本語",
    nameEn: "Japanese",
  },

  // Korean
  ko: {
    nameEn: "Korean",
    name: "한국어",
  },

  fr: {
    nameEn: "French",
    name: "Français",
  },
  de: {
    nameEn: "German",
    name: "Deutsch",
  },
  es: {
    nameEn: "Spanish",
    name: "Español",
  },
  it: {
    nameEn: "Italian",
    name: "Italiano",
  },
  ru: {
    nameEn: "Russian",
    name: "Русский",
  },
  pt: {
    nameEn: "Portuguese",
    name: "Português",
  },
  nl: {
    nameEn: "Dutch",
    name: "Nederlands",
  },
  pl: {
    nameEn: "Polish",
    name: "Polski",
  },
};

export const LANGUAGE_ENTRYS = entries(LANG_CONFIG);
