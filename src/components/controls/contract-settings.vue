<template>
  <div class="row gutter-sm">
    <div
      v-for="(config_item, key) in contract_config"
      :key="key"
      class="col-xs-12 col-sm-6 col-md-4 animate-fade"
    >
      <q-item-tile class="row items-center">
        <div>{{ config_item.name }}</div>
        <help-btn
          content="Fill in the form to propose a transfer from one of the DAC accounts. The transfers will be submitted to the blockchain as multisignature proposals. The custodians need to vote before the transfer can be executed."
          title="Propose Transfer"
          color="primary-light"
          size="sm"
        />
      </q-item-tile>

      <q-input
        :dark="getIsDark"
        v-model="config_item.value"
        :placeholder="config_item.type"
        color="primary-light"
      />
    </div>
    <div class="col-xs-12 row justify-end">
      <q-btn label="update" @click="updateConfig" color="primary" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import helpBtn from "components/controls/help-btn";
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
      console.log(current_config);
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
      let data =
        this.contract == "dacproposals"
          ? {
              new_config: this.parseConfig(),
              dac_scope: this.$configFile.get("dacscope")
            }
          : { newconfig: this.parseConfig() };
      let action = {
        account: this.contract,
        name: "updateconfig",
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
    }
  },

  mounted() {
    console.log("init");
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
