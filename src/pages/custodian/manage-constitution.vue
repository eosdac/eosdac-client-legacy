<template>
  <q-page class="q-pa-md">
    <q-select
      v-model="new_constitution_url"
      stack-label="Constitution History"
      color="primary-light"
      :dark="getIsDark"
      :options="getParsedMemberTerms"
      placeholder="Select Version"
      @input="md5_constitution = ''"
    />
    <div class="row items-center no-wrap">
      <q-input
        class="full-width "
        :dark="getIsDark"
        color="primary-light"
        v-model="new_constitution_url"
        stack-label="Constitution URL"
        placeholder="Input URL to Constitution"
        @input="md5_constitution = ''"
      />
      <div><q-btn label="load" @click="getConstitution" color="primary" /></div>
    </div>
    <q-input
      :dark="getIsDark"
      color="primary-light"
      v-model="md5_constitution"
      stack-label="Verification Hash"
      placeholder="MD5 Hash"
    />
  </q-page>
</template>

<script>
const CryptoJS = require("crypto-js");
import marked from "marked";
// import xspan from "components/ui/xspan";

import { mapGetters } from "vuex";
export default {
  components: {},
  data() {
    return {
      isloading: false,
      constitution: "",
      md5_constitution: "",
      new_constitution_url: ""
    };
  },
  computed: {
    ...mapGetters({
      getIsDark: "ui/getIsDark",
      getMemberTerms: "dac/getMemberTerms",
      getLatestMemberTerm: "dac/getLatestMemberTerm",
      getAccountName: "user/getAccountName",
      getIsLoaded: "dac/getIsLoaded"
    }),
    getParsedMemberTerms() {
      if (!this.getMemberTerms) return [];
      return this.getMemberTerms
        .map(mt => {
          return {
            value: mt.terms,
            label: `version ${mt.version}`,
            sublabel: mt.hash
          };
        })
        .reverse();
    }
  },

  methods: {
    async getConstitution() {
      if (!this.new_constitution_url) return;
      this.isloading = true;
      try {
        let getCt = await this.loadConstitutionFromUrl(
          this.new_constitution_url
        );
        this.md5_constitution = CryptoJS.MD5(getCt).toString();

        this.constitution =
          '<span class="animate-fade">' +
          marked(getCt, { sanitize: true }) +
          "</span>";
        this.isloading = false;
      } catch (e) {
        console.log(e);
        this.isloading = false;
      }
    },

    async loadConstitutionFromUrl(url) {
      try {
        let constitution = await this.$axios.get(url);
        return constitution.data;
      } catch (err) {
        throw err;
      }
    }
  },

  watch: {}
};
</script>

<style></style>
