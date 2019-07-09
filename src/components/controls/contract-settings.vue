<template>
  <div class="row gutter-sm">
    <div
      v-for="(config_item, key) in contract_config"
      :key="key"
      class="col-xs-12 col-sm-6 col-md-4 col-lg-3 animate-fade"
    >
      <div class="bg-bg2 q-pa-md round-borders">
        <q-item-tile class="row items-center justify-between no-wrap">
          <div class="text-text2">
            {{ $t(`conf_cust_contr.${config_item.name}_title`) }}
          </div>
          <help-btn
            :content="$t(`conf_cust_contr.${config_item.name}_desc`)"
            :title="$t(`conf_cust_contr.${config_item.name}_title`)"
            color="text1"
            size="sm"
          />
        </q-item-tile>

        <q-input
          class="q-mb-sm"
          :dark="getIsDark"
          v-model="config_item.value"
          :placeholder="config_item.type"
          color="primary-light"
        />
      </div>
    </div>
    <div class="col-xs-12 row justify-end" v-if="contract_config.length">
      <q-btn
        flat
        :disable="contract == ''"
        color="primary-light"
        label="export"
        class="on-left"
        @click="exportFile"
      />
      <q-btn
        :disable="contract == ''"
        label="update"
        @click="updateConfig"
        color="primary"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import helpBtn from "components/controls/help-btn";
import { saveAs } from "file-saver";
export default {
  name: "contractSettings",
  components: {
    helpBtn
  },
  props: {
    contract: {
      type: String,
      default: "dacelections"
    }
  },
  data() {
    return {
      contract_config: []
    };
  },
  computed: {
    ...mapGetters({
      getCustodianConfig: "dac/getCustodianConfig",
      getWpConfig: "dac/getWpConfig",
      getIsDark: "ui/getIsDark",
      getDacApi: "global/getDacApi"
    })
  },
  methods: {
    async init() {
      if (this.contract == "") return;
      if (
        this.contract == this.$configFile.get("wpcontract") &&
        this.getWpConfig.authority_account === null
      ) {
        await this.$store.dispatch("dac/fetchWpConfig");
      }

      let abi = await this.getAbi(this.contract);
      if (abi == undefined) return;

      let config_struct = abi.structs.find(
        s => s.name == "contr_config" || s.name == "config"
      ).fields;

      let current_config =
        this.contract == "dacproposals"
          ? this.getWpConfig
          : this.getCustodianConfig;

      for (let conf in current_config) {
        let item = config_struct.find(cs => cs.name == conf);
        item.value = current_config[conf];
      }
      this.contract_config = config_struct;
    },
    async getAbi(contract) {
      if (!this.getDacApi) return;

      let abi = await this.getDacApi.eos.get_abi(contract).catch(e => {
        console.log("error getting abi file", e);
      });

      if (abi && abi.abi) {
        return abi.abi;
      } else {
        return false;
      }
    },
    async updateConfig() {
      let action_name =
        this.contract == "dacproposals" ? "updateconfig" : "updateconfige";
      let data =
        this.contract == "dacproposals"
          ? {
              new_config: this.parseConfig(),
              dac_id: this.$configFile.get("dacscope")
            }
          : {
              newconfig: this.parseConfig(),
              dac_id: this.$configFile.get("dacscope")
            };

      let action = {
        account: this.contract,
        name: action_name,
        // data: {
        //   newconfig: this.parseConfig()
        // },
        authorization: [
          {
            actor: this.contract,
            permission: "active"
          }
        ]
      };
      action.data = data;

      let res = await this.$store.dispatch("user/proposeMsig", {
        actions: [action],
        title: `Update configuration of ${this.contract}`,
        description: "this is the description of the action"
      });
      console.log(res);
    },

    parseConfig() {
      let new_config = this.contract_config.reduce((result, item) => {
        switch (item.type) {
          case "bool":
            if (
              item.value === 0 ||
              item.value === false ||
              item.value === "false"
            ) {
              item.value = false;
            } else {
              item.value = true;
            }
            break;

          default:
            break;
        }
        result[item.name] = item.value;
        return result;
      }, {});
      return new_config;
    },
    exportFile() {
      let blob = new Blob([JSON.stringify(this.parseConfig(), null, 4)], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, `${this.contract}.config.json`);
    }
  },

  mounted() {
    this.init();
  },
  watch: {
    contract: function() {
      this.init();
    }
  }
};
</script>

<style></style>
