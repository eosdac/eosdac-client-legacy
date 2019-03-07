<template>
  <q-page padding>

    <file-input v-model ="abi" label="Select abi" :asbuffer="false"/>
    
    <file-input v-model ="wasm" label="Select wasm" :asbuffer="true"/>

    <q-btn color="primary" label="set abi"  @click="setAbi" />
    <q-btn color="primary" label="set code"  @click="setCode" />

    <pre> {{abi}}</pre>
    <pre>{{wasm}}</pre>


  </q-page>
</template>

<script>
import {mapGetters} from 'vuex';
import fileInput from 'components/controls/file-input'

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
      // getEosApi: 'global/getEosApi'
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
            code: this.wasm,

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
            abi: this.abi,
          }
        }];
      let result = await this.$store.dispatch('user/transact', {actions: actions} );
      if(result){
        // this.$store.commit('user/setIsCandidate', false );
        console.log(result);
      }
    },

  }
}
</script>

<style>




</style>
