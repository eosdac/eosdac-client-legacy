<template>
  <div class="row gutter-md">
    <div
      v-for="(config_item, key) in contract_config"
      :key="key"
      class="col-xs-12 col-md-6"
    >
      <q-input
        :dark="getIsDark"
        :stack-label="config_item.name"
        v-model="config_item.value"
        :placeholder="config_item.type"
        color="primary-light"
      />
    </div>
    <div class="col-xs-12">
      <q-btn label="update" @click="updateConfig" color="primary" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "contractSettings",
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
      getIsDark: "ui/getIsDark",
      getDacApi: "global/getDacApi"
    })
  },
  methods: {
    async init() {
      let abi = await this.getAbi(this.contract);
      let config_struct = abi.structs.find(s => s.name == "contr_config")
        .fields;

      for (let conf in this.getCustodianConfig) {
        let item = config_struct.find(cs => cs.name == conf);
        item.value = this.getCustodianConfig[conf];
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
      let new_config = this.contract_config.reduce((result, item) => {
        switch (item.type) {
          case "bool":
            if (
              item.value == 0 ||
              item.value == false ||
              item.value == "false"
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
      console.log(new_config);
      let action = {
        account: this.contract,
        name: "updateconfig",
        data: {
          newconfig: new_config
        },
        authorization: [
          {
            actor: this.contract,
            permission: "active"
          }
        ]
      };

      let res = await this.$store.dispatch("user/proposeMsig", {
        actions: [action],
        title: `Update configuration of ${this.contract}`,
        description: "this is the description of the action"
      });
      console.log(res);
    }
  },
  mounted() {
    console.log("init");
    this.init();
  }
};
</script>

<style></style>
