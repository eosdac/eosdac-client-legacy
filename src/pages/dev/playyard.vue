<template>
  <q-page padding>
    <!-- content -->
   <pre> {{abi}}</pre>
   <pre>{{wasm.toString(`hex`)}}</pre>
  <file-input v-model ="abi" :asbuffer="false"/>
  <q-btn color="primary" label="set abi"  @click="setAbi" />

  <file-input v-model ="wasm" :asbuffer="true"/>
  <q-btn color="primary" label="set code"  @click="setCode" />



  </q-page>
</template>

<script>
import {mapGetters} from 'vuex';
import fileInput from 'components/controls/file-input'
const {TextDecoder, TextEncoder} = require('text-encoding');
const {Serialize} = require('eosjs');


export default {
  name: 'playyard',
  components:{
    fileInput
  },
  data () {
    return {
      abi:'',
      wasm:''

    }
  },
  computed:{
    ...mapGetters({
      getEosApi: 'global/getEosApi'
    })

  },
  methods:{

    async setCode(){
      let actions = [{
          account: 'eosio',
          name: "setcode",
          data: {
            account: 'piecesnbitss',
            vmtype:0 ,
            vmversion: 0,
            code: this.buf2hex(this.wasm),

          }
        }];
      let result = await this.$store.dispatch('user/transact', {actions: actions} );
      if(result){
        // this.$store.commit('user/setIsCandidate', false );
        console.log(result);
      }
    },

    async setAbi(){

      let actions = [{
          account: 'eosio',
          name: "setabi",
          data: {
            account: 'piecesnbitss',
            abi: await this.parseAbi(),
          }
        }];
      let result = await this.$store.dispatch('user/transact', {actions: actions} );
      if(result){
        // this.$store.commit('user/setIsCandidate', false );
        console.log(result);
      }
    },

    async parseAbi(){

      const buffer = new Serialize.SerialBuffer({
          textEncoder: new TextEncoder,
          textDecoder: new TextDecoder,
      });
      let abi = JSON.parse(this.abi);
      const abiDefinition = await this.getEosApi.eosapi.abiTypes.get(`abi_def`);

      abi = abiDefinition.fields.reduce(
          (acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
          abi,
      );

      abiDefinition.serialize(buffer, abi);
      return Buffer.from(buffer.asUint8Array()).toString(`hex`);
    },

    buf2hex(buffer) { 
      return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }


  }
}
</script>

<style>

.fileContainer {
    overflow: hidden;
    position: relative;
    background:blue;
    display: inline-block;
    padding:10px;
    cursor: pointer;
    
}

.fileContainer [type=file] {
    cursor: inherit;
    display: block;
    font-size: 999px;
    filter: alpha(opacity=0);
    min-height: 100%;
    min-width: 100%;
    opacity: 0;
    position: absolute;
    right: 0;
    text-align: right;
    top: 0;
}


</style>
