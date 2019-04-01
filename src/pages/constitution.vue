<template>
  <q-page class="text-white q-pa-md">
    <div class="row gutter-md reverse-wrap">
      <!-- first column  -->
      <div class="col-xs-12 col-xl-8">
        <div class=" bg-bg1 shadow-5 round-borders">
          <div class="row justify-end bg-bg1 q-pa-md round-borders">
            <q-toggle
              color="primary-light"
              v-model="white_constitution"
              class="text-text1"
              left-label
              :label="$t('constitution.switch_contrast')"
            />
          </div>
          <div class="q-pa-md bg-bg1 full-width" style="min-height:1000px">
            <div
              v-if="constitution != ''"
              v-bind:class="{ overwrite: !white_constitution }"
              class="markdown-body testtt animate-fade"
              v-html="constitution"
            ></div>
          </div>
        </div>
      </div>

      <!-- second column -->
      <div class="col-xs-12 col-xl-4 text-text1">
        <div>
          <div
            id="registerbox"
            class="bg-logo bg-bg1 q-pa-md round-borders shadow-5 relative-position"
            style="overflow:hidden"
          >
            <q-item>
              <q-item-side
                :icon="$configFile.icon.constitution"
                color="text2"
              />
              <q-item-main>
                <q-item-tile class="text-text1" label>{{
                  $t('default.constitution')
                }}</q-item-tile>
                <q-item-tile class="text-text2" sublabel>
                  version <xspan :value="getLatestMemberTerm.version"></xspan>
                </q-item-tile>
              </q-item-main>
            </q-item>

            <q-item>
              <q-item-side :icon="$configFile.icon.check" color="positive" />
              <q-item-main>
                <q-item-tile class="text-text1" label>{{
                  $t('constitution.hash')
                }}</q-item-tile>
                <q-item-tile
                  class="text-text2"
                  style="overflow:hidden; white-space:nowrap;"
                  sublabel
                >
                  <xspan :value="getLatestMemberTerm.hash"></xspan>
                </q-item-tile>
              </q-item-main>
            </q-item>

            <q-item>
              <q-item-side :icon="$configFile.icon.link" color="text2" />
              <q-item-main style="overflow:hidden">
                <q-item-tile class="text-text1" label>{{
                  $t('constitution.direct_link')
                }}</q-item-tile>
                <q-item-tile
                  class="text-text2"
                  style="overflow:hidden; white-space:nowrap;"
                  sublabel
                >
                  <span
                    ><a target="_blank" :href="getLatestMemberTerm.terms">{{
                      getLatestMemberTerm.terms
                    }}</a></span
                  >
                </q-item-tile>
              </q-item-main>
            </q-item>

            <!-- <q-item-side left>dd</q-item-side> -->
            <div class="row justify-end items-center">
              <q-btn
                v-if="needSignature"
                @click="signConstitution()"
                color="primary"
                label="register"
              />
              <div
                v-if="!needSignature"
                class="text-positive q-caption q-my-sm"
              >
                {{ $t('constitution.signed_message') }}
              </div>
              <q-btn
                v-if="!needSignature"
                class="on-right"
                @click="unRegister()"
                color="primary"
                label="unregister"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-scroll-observable @scroll="userHasScrolled" />

    <debug-data
      :data="[
        {
          getMemberTerms: getMemberTerms,
          getAgreedTermsVersion: getAgreedTermsVersion
        }
      ]"
    />
  </q-page>
</template>

<script>
const CryptoJS = require('crypto-js');
import marked from 'marked';
import xspan from 'components/ui/xspan';
import debugData from 'components/ui/debug-data';

import { mapGetters } from 'vuex';
export default {
  components: {
    xspan,
    debugData
  },
  data() {
    return {
      isloading: false,
      constitution: '',
      white_constitution: false,

      md5_constitution: '',

      latestMemberTerms: this.getLatestMemberTerm || {}
    };
  },
  computed: {
    ...mapGetters({
      getMemberTerms: 'dac/getMemberTerms',
      getLatestMemberTerm: 'dac/getLatestMemberTerm',
      getAccountName: 'user/getAccountName',
      getAgreedTermsVersion: 'user/getAgreedTermsVersion',
      getIsLoaded: 'dac/getIsLoaded'
    }),

    needSignature() {
      if (
        this.getLatestMemberTerm &&
        this.getAgreedTermsVersion &&
        this.getLatestMemberTerm.version === this.getAgreedTermsVersion
      ) {
        return false;
      } else {
        return true;
      }
    }
  },

  methods: {
    async getConstitution() {
      if (!this.getLatestMemberTerm.terms) return;
      this.isloading = true;
      try {
        let getCt = await this.loadConstitutionFromGithub(
          this.getLatestMemberTerm.terms
        );
        this.md5_constitution = CryptoJS.MD5(getCt).toString();

        //check if the fetched constitution matches the contract hash
        // if(this.md5_constitution === this.latestMemberTerms.hash){
        //   console.log('Constitution verified! Hashes match!')
        // }

        this.constitution =
          '<span class="animate-fade">' +
          marked(getCt, { sanitize: true }) +
          '</span>';
        this.isloading = false;
      } catch (e) {
        console.log(e);
        this.isloading = false;
      }
    },

    async loadConstitutionFromGithub(url) {
      try {
        let constitution = await this.$axios.get(url);
        return constitution.data;
      } catch (err) {
        throw err;
      }
    },

    async signConstitution() {
      let actions = [
        {
          account: this.$configFile.get('tokencontract'),
          name: 'memberreg',
          data: {
            sender: this.getAccountName,
            agreedterms: this.md5_constitution
          }
        }
      ];

      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      });
      if (result) {
        this.$store.commit(
          'user/setAgreedTermsVersion',
          this.getLatestMemberTerm.version
        );
      }
    },

    async unRegister() {
      let actions = [
        {
          account: this.$configFile.get('tokencontract'),
          name: 'memberunreg',
          data: {
            sender: this.getAccountName
          }
        }
      ];
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      });
      if (result) {
        this.$store.commit('user/setAgreedTermsVersion', false);
      }
    },

    async checkRegistered() {
      // let memberRegistration = await this.$store.dispatch('api/getRegistered');
      // let latestMemberTerms = await this.$store.dispatch('api/getMemberTerms');
    },

    userHasScrolled(scroll) {
      const votebox = document.getElementById('registerbox');
      if (scroll.position < 40 || window.innerWidth < 1199) {
        votebox.style.top = '0px';
        return false;
      }
      // console.log(`votebox: ${offset(votebox).top} scroll: ${scroll.position}`);
      votebox.style.top = scroll.position + 'px';
    }
  },

  mounted: function() {
    if (this.getLatestMemberTerm) {
      this.getConstitution();
    }
  },
  watch: {
    // getLatestMemberTerm (oldval, newval) {
    //   console.log(oldval, newval)
    //   if(newval.terms){
    //     this.getConstitution();
    //   }
    // },
    // getMemberTerms (oldval, newval) {
    //   if(newval && newval[0] ){
    //     this.getConstitution();
    //   }
    // },
    getIsLoaded() {
      this.getConstitution();
    }
  }
};
</script>

<style lang="stylus">
@import '~variables'

#registerbox{
  position:relative;
  transition: all 1s ease 0s;
  top: 0;
}
.overwrite {
  background: none !important;
  color: var(--q-color-text2) !important;
  // transition: all 0.1s linear;
}
.testtt h1, .testtt h2, , .testtt p{
  color: var(--q-color-text1) !important;
  // transition: all 0.1s linear;
}
.overwrite td, .overwrite th {
  background: var(--q-color-bg2) !important;
  // transition: all 0.1s linear;
}
</style>
