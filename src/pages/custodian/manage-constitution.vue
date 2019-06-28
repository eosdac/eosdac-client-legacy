<template>
  <q-page class="q-pa-md">
    <p class="text-text2">
      Review the constitution history and propose constitution updates.
    </p>
    <div class="">
      <div class="row gutter-sm ">
        <div class="col-xs-12 col-md-5 animate-fade">
          <div class="round-borders bg-bg1 shadow-4 overflow-hidden">
            <div
              class="bg-primary q-pa-sm row justify-between items-center"
              style="height:50px"
            >
              <q-icon
                :name="$configFile.icon.dactoken"
                color="text2"
                size="24px"
              />
              <span>Constitution History</span>
              <q-btn
                @click="
                  constitution_version_descending = !constitution_version_descending
                "
                flat
              >
                <q-icon
                  color="text2"
                  v-if="constitution_version_descending"
                  name="mdi-sort-descending"
                />
                <q-icon v-else name="mdi-sort-ascending" color="text2" />
              </q-btn>
            </div>

            <q-scroll-area
              style="width: 100%; height: 250px;"
              :thumb-style="{
                right: '0px',
                borderRadius: '2px',
                background: '#7c41ba',
                width: '10px',
                opacity: 0.8
              }"
            >
              <q-list no-border separator highlight :dark="getIsDark">
                <q-item
                  v-for="(mt, i) in getParsedMemberTerms"
                  :key="`mt${i}`"
                  class="animate-fade"
                >
                  <q-item-side left :icon="$configFile.icon.constitution" />
                  <q-item-main>
                    <q-item-tile label>
                      <div class="overflow-hidden">
                        <span>Version {{ mt.version }} </span>
                        <span class="q-caption text-text2">{{ mt.hash }}</span>
                      </div>
                    </q-item-tile>
                    <q-item-tile sublabel>
                      <div
                        style="white-space: nowrap;"
                        class=" overflow-hidden"
                      >
                        <a
                          class=" q-caption"
                          target="_blank"
                          :href="mt.terms"
                          >{{ mt.terms }}</a
                        >
                      </div>
                    </q-item-tile>
                  </q-item-main>
                  <q-item-side right style="min-width:65px">
                    <q-btn
                      v-if="mt.hash != md5_constitution"
                      color="info"
                      class="animate-fade"
                      flat
                      size="sm"
                      label="load"
                      @click="setConstitution(mt.terms)"
                    />
                    <q-icon
                      v-else
                      name="check"
                      size="24px"
                      color="positive"
                      class="animate-fade"
                    />
                  </q-item-side>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
        </div>
        <div class="col-xs-12 col-md-7 animate-fade">
          <div
            class="round-borders bg-bg1 bg-logo shadow-4  full-height overflow-hidden"
          >
            <div
              class="bg-primary q-pa-sm row justify-between items-center"
              style="height:50px"
            >
              <q-icon
                :name="$configFile.icon.dactoken"
                color="text2"
                size="24px"
              />
              <span>New Constitution</span>
              <help-btn
                :content="
                  `Input an URL pointing to the updated constitution. Click load to pull in the text and calculate its hash.`
                "
                :title="`New Constitution`"
                color="text1"
                size="sm"
              />
            </div>
            <div class="q-pa-md column justify-between " style="height:250px">
              <div class="row items-center no-wrap">
                <q-input
                  class="full-width "
                  :dark="getIsDark"
                  color="primary-light"
                  v-model="new_constitution_url"
                  stack-label="Constitution URL"
                  placeholder="Input URL to Constitution"
                  @input="
                    md5_constitution = '';
                    parsed_constitution = '';
                  "
                />
                <div>
                  <q-btn
                    label="load"
                    @click="setConstitution(new_constitution_url)"
                    color="primary"
                    :loading="isloading"
                    class="on-right animate-fade"
                  />
                </div>
              </div>
              <div
                class="row no-wrap items-center"
                v-if="getIsNewConstitution === true"
              >
                <div>
                  <q-btn
                    label="Update"
                    @click="updateConstitution"
                    color="primary"
                  />
                </div>
                <div class="q-caption text-positive q-pa-sm">
                  New constitution detected. Please review the constitution and
                  verify the md5 hash before updating. The constitution change
                  will be put up for voting via msig.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 animate-scale">
          <div class="q-pa-md round-borders bg-bg1 shadow-4">
            <div v-if="parsed_constitution != ''">
              <div class="row q-pb-md justify-end">
                <xspan :value="md5_constitution" />
              </div>
              <div
                class="markdown-body animate-fade bg-text1 q-pa-md"
                v-html="parsed_constitution"
              />
            </div>
            <div
              v-if="!isloading && parsed_constitution == ''"
              class="animate-fade text-text2"
            >
              No constitution loaded
            </div>
            <div v-if="isloading" class="animate-fade">loading...</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
const CryptoJS = require("crypto-js");
import helpBtn from "components/controls/help-btn";
import marked from "marked";
import xspan from "components/ui/xspan";

import { mapGetters } from "vuex";
export default {
  components: {
    xspan,
    helpBtn
  },
  data() {
    return {
      isloading: false,
      raw_constitution: false,
      parsed_constitution: "",
      md5_constitution: "",
      new_constitution_url: "",
      constitution_version_descending: true
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
      let clone = JSON.parse(JSON.stringify(this.getMemberTerms));
      if (this.constitution_version_descending) {
        return clone.reverse();
      } else {
        return clone;
      }

      // return [...clone, ...clone, ...clone, ...clone, ...clone];
    }
  },

  methods: {
    async setConstitution(url) {
      this.parsed_constitution = "";
      this.md5_constitution = null;
      this.raw_constitution = false;
      if (!url) {
        this.md5_constitution = "";
        return;
      }
      this.isloading = true;
      try {
        let getCt = await this.loadConstitutionFromUrl(url);
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
