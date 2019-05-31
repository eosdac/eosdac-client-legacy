<template>
  <div>
    <q-input
      stack-label="Account"
      v-model="manifest.account"
      :dark="getIsDark"
    />
    <q-input stack-label="Domain" v-model="manifest.domain" :dark="getIsDark" />
    <q-input
      stack-label="App Meta"
      v-model="manifest.appmeta"
      :dark="getIsDark"
    />
    <q-input stack-label="ChainId" v-model="chainId" :dark="getIsDark" />

    <div class="q-mt-md">
      <div v-for="(value, name) in contract_actions" :key="`ctr${name}`">
        <div class=" q-mt-md row items-center">
          <div class="q-title on-left">{{ name }}</div>
          <q-btn
            dense
            flat
            size="sm"
            label="toggle all"
            @click="toggleAll(name)"
          />
        </div>

        <div class="row bg-dark">
          <div
            v-for="(action, i) in value"
            :key="`a${name + i}`"
            style="transition: background-color 0.3s ease;"
            class="q-pa-sm q-ma-xs cursor-pointer round-borders"
            v-bind:class="{
              'bg-positive': action.selected,
              'bg-bg1': !action.selected
            }"
            @click="action.selected = !action.selected"
          >
            {{ action.action }}
          </div>
        </div>
      </div>
    </div>
    <q-btn label="load Actions" @click="loadContractActions" color="primary" />
    <q-btn label="export" @click="exportFile" color="primary" />
  </div>
</template>

<script>
// const SHA256 = require("crypto-js/sha256");
import { mapGetters } from "vuex";
import { saveAs } from "file-saver";
export default {
  name: "appManifest",
  data() {
    return {
      app_contracts: [
        "dacelections",
        "eosiomsigold",
        "kasdactokens",
        "dacmultisigs"
      ],
      contract_actions: {},
      chainId: this.$store.getters["global/getChainId"],
      manifest: {
        account: "",
        domain: "https://members.eosdac.io",
        appmeta:
          "https://members.eosdac.io/app-metadata.json#SHA256HASHxxxxxxxxxxxxxxxxxxxxxxx",
        whitelist: []
      }
    };
  },
  computed: {
    ...mapGetters({
      getDacApi: "global/getDacApi",
      getIsDark: "ui/getIsDark"
    })
  },
  methods: {
    async loadContractActions() {
      for (let i = 0; i < this.app_contracts.length; i++) {
        let contract = this.app_contracts[i];
        let abi = await this.getAbi(contract);
        if (!abi) return;

        let actions = abi.actions.map(a => {
          return { contract: contract, action: a.name, selected: false };
        });
        this.$set(this.contract_actions, contract, actions);
      }
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
    toggleAll(contract) {
      this.contract_actions[contract].forEach(
        action => (action.selected = !action.selected)
      );
    },
    parseManifest() {
      let temp = [];
      for (let ctr in this.contract_actions) {
        let selected_actions = this.contract_actions[ctr].filter(
          ctra => ctra.selected == true
        );
        console.log(selected_actions);
        selected_actions = JSON.parse(JSON.stringify(selected_actions));

        if (selected_actions.length == this.contract_actions[ctr].length) {
          //if all actions are selected use wildcard notation ""
          selected_actions = [
            { contract: selected_actions[0].contract, action: "" }
          ];
        }
        temp = temp.concat(selected_actions);
      }

      this.manifest.whitelist = temp.map(t => {
        if (t.selected !== undefined) {
          delete t.selected;
        }
        return t;
      });
      return this.manifest;
    },
    exportFile() {
      let blob = new Blob([JSON.stringify(this.parseManifest(), null, 4)], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, `chain-manifests.json`);
    }
  }
};
</script>

<style></style>
