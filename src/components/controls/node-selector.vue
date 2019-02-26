<template>
<div v-if="setup">
  <div v-if="setupError && successEndpoint" class="row justify-center">
    <div class="col-sm-12 text-center">
      <div class="row justify-center">
        <div class="col-sm-12 q-pa-sm text-center">
          <q-alert v-if="errorEndpoint" :message="$t(errorEndpointText)" class="text-truncate" icon="info" color="red" />
          <q-alert v-if="successEndpoint" :message="$t('nodeselector.endpoint_set')" class="text-truncate" icon="icon-ui-6" color="positive" />
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-sm-12 q-pa-sm text-center">
          <q-field :label="$t('nodeselector.custom_endpoint')" label-width="12" dark>
            <q-input color="p-light" dark v-model="endpoint" placeholder="https://endpoint-url.com" />
          </q-field>
          <q-btn :disabled="badEndpoint"  class="q-ma-sm" color="primary" @click="connect(endpoint)" :label="$t('nodeselector.connect')" />
        </div>
      </div>
    </div>
  </div>
 
</div>
<div v-else>

  <q-alert v-if="errorEndpoint" :message="$t(errorEndpointText)" class="text-truncate" icon="info" color="red" />
  <q-alert v-if="successEndpoint" :message="$t('nodeselector.endpoint_set')" class="text-truncate" icon="icon-ui-6" color="positive" />

  <div class="row relative-position" style="min-height:250px">
    <!-- col1 -->
    <div class="col-sm-12 col-lg-4 q-pa-md">

        <div class="column justify-between" style="height:100%">
          <div v-if="!endpointListFail">
              <p class="q-title">{{ $t('nodeselector.automatic_connection') }}</p>
              <p class="text-dimwhite q-body-1" style="min-height:50px" v-html="$t('nodeselector.click_connect_below')"></p>
          </div >
          <div >
            <q-btn size="md" class="float-right" color="primary" @click="getFastestNode() " :label="$t('nodeselector.connect')" />
          </div>
        </div>

    </div>
    <!-- col2 -->
    <div class="col-sm-12 col-lg-4 q-pa-md">
      <!-- can't use flex with the q-select, breakpoint get triggered buggy -->
      <!-- <div class="column justify-between" style="height:100%"> -->
          <div>
              <p class="q-title">{{ $t('nodeselector.select_endpoint') }}</p>
              <p class="text-dimwhite q-body-1" style="min-height:50px" v-html="$t('nodeselector.select_the_endpoint_you_would_like')"></p>
              <q-field :label="$t('nodeselector.choose_endpoint')" label-width="12" dark>
              <q-select color="p-light" :placeholder="$t('nodeselector.select_endpoint')" v-model="selectedEndpoint" dark radio :options="endpoints" />
              </q-field>
          </div>
          <div class="q-mt-lg">
              <q-btn size="md" :disabled="!selectedEndpoint" class="float-right" color="primary" @click="connect(selectedEndpoint)" :label="$t('nodeselector.connect')" />
          </div>
      <!-- </div> -->
    </div>
    <!-- col3 -->
    <div class="col-sm-12 col-lg-4 q-pa-md" >
        <div class="column justify-between" style="height:100%">
            <div >
              <p class="q-title">{{ $t('nodeselector.manual_connection') }}</p>
              <p class="text-dimwhite q-body-1" style="min-height:50px">{{ $t('nodeselector.specify_your_own') }}</p>
              <q-field :label="$t('nodeselector.custom_endpoint')" label-width="12" dark>
                <q-input color="p-light" dark v-model="endpoint" placeholder="https://endpoint-url.com" />
              </q-field>
            </div>
            <div class="q-mt-lg">
                <q-btn size="md" :disabled="badEndpoint" class="float-right" color="primary" @click="connect(endpoint)" :label="$t('nodeselector.connect')" />
            </div>
        </div>
    </div>
  
  </div>
</div>
</template>

<script>

import NodeSelector from '../../modules/nodeselector.js';
import {mapGetters} from 'vuex';

export default {
  name: 'NodeSelector',
  props: {
    setup: Boolean
  },
  components: {

  },
  computed: {
    ...mapGetters({
      
      getAccountName: 'user/getAccountName',
      getCurrentEndpoint: 'api/getCurrentEndpoint'
    })
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      endpoint: '',
      errorEndpoint: false,
      errorEndpointText: '',
      badEndpoint: false,
      selectedEndpoint: '',
      endpoints: [],
      endpointListFail: false,
      successEndpoint: false,
      fastest: '',
      setupError: false
    }
  },
  mounted() {
    if (this.setup) {
      this.getFastestNode()
    } else {
      this.loadEndpoints()
    }
    if (this.getCurrentEndpoint) {
      this.errorEndpoint = false
      this.badEndpoint = false
      this.endpoint = this.getCurrentEndpoint.httpEndpoint
    }
  },
  methods: {
    async getFastestNode() {
      //if the chain id is not from mainnet then use the default node from the config file
      if(this.$configFile.network.chainId !== 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' || this.setup){
        let test = await this.$store.dispatch('api/testEndpoint', this.$configFile.network.default_node);
        if(test){
          console.log('ok')
          this.connect(this.$configFile.network.default_node);
          return false;
        }
      }
      
      let s = new NodeSelector(this.$configFile.get('bpnodeapi') );
      this.loading = true
      this.loadingText = 'nodeselector.gathering_endpoints'
      let fastest = await s.get_fastest_node();
      if (fastest) {
        this.connect(fastest.node)
      }
      this.loading = false
    },

    async loadEndpoints() {
      console.log('loading endpoints')
      let s = new NodeSelector(this.$configFile.get('bpnodeapi') );

      try {
        let endpoints = await s.get_nodes();
        
        let res = []
        endpoints.forEach(url => {
          res.push({label: url, value: url})
        })

        //add the default node to the list
        // res.unshift({
        //     label: this.$configFile.network.default_node,
        //     value: this.$configFile.network.default_node,
        //     sublabel: this.$t('nodeselector.default_node')
        // })
        this.endpoints = res;
        console.log(this.endpoints)

      } 
      catch (error) {
        this.endpointListFail = true
      }
    },
    filterUrl(url) {
      if (url.substr(-1) === '/') {
        return url.substr(0, url.length - 1);
      } else {
        return url
      }
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async endpointSuccess() {
      this.successEndpoint = true
      await this.sleep(5000)
      this.successEndpoint = false
    },
    async endpointFail() {
      this.errorEndpoint = true
      await this.sleep(5000)
      this.errorEndpoint = false
    },
    async connect(u) {
      //todo: push eos object to store...
      this.loading = true
      this.loadingText = 'nodeselector.connecting'
      try {
        let url = await this.filterUrl(u)
  
        this.loading = false
        this.$store.commit('api/ADD_ENDPOINT', {
          save: true,
          url,
          chainId: this.$configFile.network.chainId
        })
        this.$store.commit('api/CHANGE_ENDPOINT', url)
        await this.$store.dispatch('api/getEos', {rebuild:true})
        this.endpointSuccess()
        this.$emit('done')
      } catch (err) {
        this.loading = false
        this.endpointFail()
        if (this.setup) {
          this.setupError = true
          this.loadEndpoints()
        }
        if (err.message.includes('Cannot POST')) {
          this.errorEndpointText = 'nodeselector.error_invalid_url'
        } else {
          switch (err.message) {
            case 'timeout':
              this.errorEndpointText = 'nodeselector.error_endpoint_connection_timed_out'
              break
            case 'NetworkError when attempting to fetch resource.':
              this.errorEndpointText = 'nodeselector.error_could_not_connect_to_endpoint'
              break
            case 'Wrong chainId':
              this.errorEndpointText = 'nodeselector.error_chain_id'
              break
            case 'Failed to fetch':
              this.errorEndpointText = 'nodeselector.error_could_not_connect_to_endpoint'
              break
            default:
              this.errorEndpointText = 'nodeselector.error_could_not_connect_to_endpoint'
          }
        }
      }
    }
  },
  watch: {
    endpoint(val) {
      if (!val) {
        this.errorEndpoint = false
        this.errorEndpointText = ''
        this.badEndpoint = true
      } else {
        this.errorEndpoint = false
        this.errorEndpointText = ''
        this.badEndpoint = false
      }
    },
    getCurrentEndpoint () {
      this.endpoint = this.getCurrentEndpoint.httpEndpoint
    }
  }
}
</script>

<style>
</style>
