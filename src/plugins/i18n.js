import nestedObjectAssign from "nested-object-assign";
import VueI18n from "vue-i18n";

import messages from "src/i18n";
import custom_messages from "src/extensions/i18n";

let msg = nestedObjectAssign({}, messages, custom_messages);

export default ({ app, Vue, store }) => {
  Vue.use(VueI18n);
  let lang = "en-us";

  if (store.getters["user/getLanguage"]) {
    lang = store.getters["user/getLanguage"];
  } else {
    if (typeof msg[browserLocale()] === "undefined") {
      lang = "en-us";
    } else {
      lang = browserLocale();
    }
  }

  store.commit("user/setLanguage", lang);

  app.i18n = new VueI18n({
    silentTranslationWarn: true,
    locale: lang,
    fallbackLocale: "en-us",
    messages: {
      de: msg["de"],
      "en-gb": msg["en-gb"],
      "en-us": msg["en-us"],
      es: msg["es"],
      fr: msg["fr"],
      it: msg["it"],
      ja: msg["ja"],
      ko: msg["ko"],
      ru: msg["ru"],
      vi: msg["vi"],
      "zh-hans": msg["zh-hans"]
    }
  });
  Vue.prototype.i18n = app.i18n;
};

function browserLocale() {
  let lang;
  if (navigator.languages && navigator.languages.length) {
    // latest versions of Chrome and Firefox set this correctly
    lang = navigator.languages[0];
  } else if (navigator.userLanguage) {
    // IE only
    lang = navigator.userLanguage;
  } else {
    // latest versions of Chrome, Firefox, and Safari set this correctly
    lang = navigator.language;
  }
  return lang.toLowerCase();
}
