<template>
  <q-page>
    <div class="q-pa-md">
      <div class="row gutter-sm">
        <div class="col-xs-12 col-md-6">
          <div class="bg-bg1 round-borders shadow-5 q-pa-md">
            <div class="q-title q-mb-md">Profile Cache</div>
            <div class="row">
              <q-btn
                class="q-ma-xs"
                label="log cache"
                color="primary"
                @click="logProfileCache"
              />
              <q-btn
                class="q-ma-xs"
                label="empty cache"
                color="primary"
                @click="emptyProfileCache"
              />
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-md-6">
          <div class="bg-bg1 round-borders shadow-5 q-pa-md">
            <div class="q-title q-mb-md">Config File</div>
            <div class="row">
              <q-btn
                class="q-ma-xs"
                label="log config"
                color="primary"
                @click="logConfigFile"
              />
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-md-6 ">
          <div class="bg-bg1 round-borders shadow-5 q-pa-md">
            <div class="row justify-between q-mb-md"></div>
            <color-picker />
            <div class="q-mt-md row justify-between">
              <q-btn
                label="download scheme"
                color="primary"
                @click="getColorScheme"
              />
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-md-6 ">
          <div class="bg-bg1 round-borders shadow-5 q-pa-md full-height">
            <div class="q-title q-mb-md">Network</div>
            <div class="q-mt-md row">
              <network-switcher class="q-ma-xs" :enable_pin="false" />
              <firehose class="q-ma-xs" />
            </div>
          </div>
        </div>
      </div>

      <debug-data
        :data="[
          {
            getIsCustodian: getIsCustodian,
            getActiveNetwork: getActiveNetwork,
            getMemberStatus: getMemberStatus,
            getAgreedTermsVersion: getAgreedTermsVersion,
            getMemberTerms: getMemberTerms
          }
        ]"
      />
    </div>
    <!-- end wrapper -->
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { colors } from "quasar";

import colorPicker from "components/controls/color-picker";

import networkSwitcher from "components/controls/network-switcher";

import firehose from "components/controls/firehose";

import debugData from "components/ui/debug-data";

export default {
  name: "test",
  components: {
    colorPicker,
    networkSwitcher,
    firehose,
    debugData
  },
  data() {
    return {
      scatter: null,
      assettest: ""
    };
  },
  computed: {
    ...mapGetters({
      getActiveNetwork: "global/getActiveNetwork",
      getAgreedTermsVersion: "user/getAgreedTermsVersion",
      getDacBalance: "user/getDacBalance",
      getMemberStatus: "user/getMemberStatus",
      getIsDark: "ui/getIsDark",
      getMemberTerms: "dac/getMemberTerms",
      getIsCustodian: "user/getIsCustodian",
      getEosApi: "global/getEosApi"
      // getCustodians: 'dac/getCustodians',
    })
  },

  methods: {
    logConfigFile() {
      console.log(this.$configFile);
    },
    logProfileCache() {
      console.log(this.$profiles);
    },
    emptyProfileCache() {
      this.$profiles.delete();
    },
    switchNode() {
      this.$store.commit("global/setNode", "http://testerino.com");
    },

    getColorScheme() {
      let colornames = ["primary", "bg1", "bg2", "text1", "text2"];
      let new_colors =
        "//add this file in the extensions/branding/colors folder\n\n";

      colornames.forEach(c => {
        new_colors += `$${c} = ${colors.getBrand(c)}\n`;
      });

      let a = document.createElement("a");
      let file = new Blob([new_colors], {
        type: "text/plain;charset=utf-8"
      });
      a.href = URL.createObjectURL(file);
      a.download = "new.colors.style";
      a.click();
      console.log(new_colors);
    }
  }
};
</script>
