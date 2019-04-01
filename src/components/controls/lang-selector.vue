<template>
  <div>
    <q-select
      :float-label="labelvalue"
      color="primary-light"
      :dark="getIsDark"
      v-model="lang"
      :options="[
        {
          label: $t('lang_selector.languages.chinese') + ' - 中文',
          value: 'zh-hans'
        },
        {
          label: $t('lang_selector.languages.english_us') + ' - English (US)',
          value: 'en-us'
        },
        {
          label: $t('lang_selector.languages.english_gb') + ' - English (GB)',
          value: 'en-gb'
        },
        {
          label: $t('lang_selector.languages.french') + ' - Français',
          value: 'fr'
        },
        {
          label: $t('lang_selector.languages.german') + ' - Deutsch',
          value: 'de'
        },
        {
          label: $t('lang_selector.languages.italian') + ' - Italiano',
          value: 'it'
        },
        {
          label: $t('lang_selector.languages.japanese') + ' - 日本語',
          value: 'ja'
        },
        {
          label: $t('lang_selector.languages.korean') + ' - 한국어',
          value: 'ko'
        },
        {
          label: $t('lang_selector.languages.russian') + ' - Pусский',
          value: 'ru'
        },
        {
          label: $t('lang_selector.languages.spanish') + ' - Español',
          value: 'es'
        },
        {
          label: $t('lang_selector.languages.vietnamese') + ' - Vietnamese',
          value: 'vi'
        }
      ]"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LangSelector',
  props: {
    label: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      lang: '',
      labelvalue: ''
    };
  },

  computed: {
    ...mapGetters({
      getLanguage: 'user/getLanguage',
      getIsDark: 'ui/getIsDark'
    })
  },

  mounted() {
    this.lang = this.getLanguage;
    if (this.label === true) {
      this.labelvalue = this.$t('lang_selector.choose_your_language');
    }
  },

  watch: {
    lang(lang) {
      this.$store.commit('user/setLanguage', lang);
      const qLang = lang === 'en-gb' ? 'en-uk' : lang;
      import('quasar-framework/i18n/' + qLang)
        .then(lang => {
          this.$q.i18n.set(lang.default);
        })
        .catch(e => console.log(`could not load language file ${qLang}`));
      this.$i18n.locale = lang;
    }
  }
};
</script>

<style></style>
