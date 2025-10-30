import i18next from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

function getLanguage() {
  const locale = new Intl.Locale(navigator.language);
  console.log(locale);
  switch (locale.language) {
    case "de":
      i18n.changeLanguage("de");
      break;
    case "en":
      i18n.changeLanguage("en");
      break;
    default:
      i18n.changeLanguage("en");
      console.log("Language " + locale + "not found! Changed to English");
      break;
  }
  console.log(i18next.language);
}
const isProduction = process.env.NODE_ENV === "production";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    supportedLngs: ["en", "de"],
    lng: "en",
    ns: ["translation"],
    defaultNS: "translation",

    backend: {
      loadPath: isProduction
        ? "/static/locales/{{lng}}/{{ns}}.json"
        : "/locales/{{lng}}/{{ns}}.json",
      addPath: isProduction
        ? "/static/locales/add/{{lng}}/{{ns}}"
        : "/locales/add/{{lng}}/{{ns}}",
    },

    interpolation: {
      escapeValue: false,
    },
  });

getLanguage();

export default i18n;
