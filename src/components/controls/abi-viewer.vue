<template>
  <!-- no props set = custom_mode -->
  <div>
    <div class="q-mb-sm">
      <q-item>
        <q-item-main>
          <q-input
            :dark="getIsDark"
            v-model="contract"
            type="text"
            stack-label="Contract"
            placeholder="input a contract name"
            @keyup.enter.native="getAbi(contract)"
          />
        </q-item-main>
        <q-item-side right>
          <q-btn
            color="primary-light"
            flat
            label="load"
            @click="getAbi(contract)"
          />
        </q-item-side>
      </q-item>
    </div>

    <div v-if="abi.version" class="row q-mb-md bg-bg2 q-pa-xs">
      <q-btn
        size="10px"
        @click="
          $emit('ActionSelected', { account: contract, name: action.name })
        "
        :icon="$configFile.icon.action"
        v-for="(action, i) in abi.actions"
        :label="action.name"
        :key="`a${i}`"
        color="bg1"
        class="animate-pop q-ma-xs"
      />
      <q-btn
        size="10px"
        title="view abi"
        icon="mdi-magnify"
        class="animate-pop q-ma-xs"
        color="positive"
        @click="view_abi_modal = true"
      />
    </div>

    <!-- <div v-if="abi.version" class="row q-mb-md bg-bg2 q-pa-xs" >
        <q-btn size="10px"  v-for="(table, i) in abi.tables" :label="table.name" :key="`t${i}`" color="bg1" class="animate-pop q-ma-xs"  />
        <q-btn size="10px" title="view abi" icon="mdi-magnify" class="animate-pop q-ma-xs" color="positive" @click="view_abi_modal=true" />
      </div> -->

    <div v-if="abi_load_error != ''" class="text-negative q-caption">
      {{ abi_load_error }}
    </div>
    <div v-if="isLoading" class="row justify-center">
      <q-spinner color="primary-light" :size="60" />
    </div>

    <!-- view abi modal -->
    <q-modal minimized v-model="view_abi_modal">
      <div
        style="height:50px"
        class="bg-bg1 row items-center justify-between q-px-md text-text1"
      >
        <span>ABI: {{ contract }}</span>
        <q-btn
          icon="close"
          @click="view_abi_modal = false"
          dense
          class="no-shadow"
        />
      </div>
      <div class="q-pa-md bg-bg2 text-text1">
        <div v-html="prettyHtml(abi)" class="overflow-hidden" />
      </div>
    </q-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
const prettyHtml = require('json-pretty-html').default;
export default {
  name: 'abiViewer',
  data() {
    return {
      contract: '',
      abi: {},
      abi_load_error: '',
      isLoading: false,
      view_abi_modal: false
    };
  },
  computed: {
    ...mapGetters({
      getEosApi: 'global/getEosApi',
      getIsDark: 'ui/getIsDark'
    })
  },
  methods: {
    prettyHtml,
    async getAbi(contract) {
      this.abi = {};
      if (!this.getEosApi) return;
      this.abi_load_error = '';
      this.isLoading = true;

      let abi = await this.getEosApi.eos.get_abi(contract).catch(e => {
        console.log(e);
      });

      this.isLoading = false;
      if (abi && abi.abi) {
        this.abi = abi.abi;
      } else {
        this.abi_load_error = `ABI for ${contract} not found`;
        return false;
      }
    }
  }
};
</script>

<style></style>
