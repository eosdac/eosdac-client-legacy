<template>
  <q-page class="q-pa-md">
    <q-select
      v-model="new_constitution_url"
      stack-label="Constitution History"
      color="primary-light"
      :dark="getIsDark"
      :options="getParsedMemberTerms"
      placeholder="Select Version"
      @input="
        md5_constitution = '';
        parsed_constitution = '';
      "
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
      <div>
        <q-btn
          label="load"
          @click="getConstitution"
          color="primary"
          :loading="isloading"
        />
      </div>
    </div>
    <div><xspan :value="md5_constitution" /></div>

    <q-btn
      v-if="getIsNewConstitution === true"
      label="Update constitution"
      @click="updateConstitution"
      color="primary"
    />
    <div
      v-if="parsed_constitution != ''"
      class="markdown-body animate-fade bg-text1 q-pa-md"
      v-html="parsed_constitution"
    ></div>
  </q-page>
</template>

<script>
const CryptoJS = require("crypto-js");
import marked from "marked";
import xspan from "components/ui/xspan";

import { mapGetters } from "vuex";
export default {
  components: {
    xspan
  },
  data() {
    return {
      isloading: false,
      raw_constitution: false,
      parsed_constitution: "",
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
    getIsNewConstitution() {
      if (!this.getMemberTerms || !this.md5_constitution) return null;
      return !this.getMemberTerms.find(mt => mt.hash === this.md5_constitution);
    },
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
      this.parsed_constitution = "";
      this.md5_constitution = null;
      this.raw_constitution = false;
      try {
        let getCt = await this.loadConstitutionFromUrl(
          this.new_constitution_url
        );
        if (!getCt) {
          this.md5_constitution = "";
          this.isloading = false;
          return;
        }
        this.raw_constitution = getCt;
        this.md5_constitution = CryptoJS.MD5(getCt).toString();

        this.parsed_constitution =
          '<span class="animate-fade">' +
          marked(getCt, { sanitize: true }) +
          "</span>";
        this.isloading = false;
      } catch (e) {
        console.log(e);
        this.isloading = false;
        this.md5_constitution = "";
      }
    },

    async loadConstitutionFromUrl(url) {
      let options = {
        method: "GET",
        url: url,
        timeout: 5000
      };
      try {
        let constitution = await this.$axios(options);
        return constitution.data;
      } catch (err) {
        return false;
      }
    },

    async updateConstitution() {
      if (this.new_constitution_url == "" || this.md5_constitution == "")
        return;
      let action = {
        account: this.$configFile.get("tokencontract"),
        name: "newmemterms",
        data: {
          terms: this.new_constitution_url,
          hash: this.md5_constitution
        },
        authorization: [
          {
            actor: this.$configFile.get("tokencontract"),
            permission: "active"
          }
        ]
      };
      let res = await this.$store.dispatch("user/proposeMsig", {
        actions: [action],
        title: `Update constitution`,
        description: `Update the constitution with ${this.new_constitution_url} \nhash: ${this.md5_constitution}`
      });
      console.log(res);
    }
  },

  watch: {}
};
</script>

<style lang="stylus">
@import '~variables'
</style>
