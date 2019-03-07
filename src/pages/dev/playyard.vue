<template>
  <q-page padding>
    <!-- content -->
  <file-input v-model ="abi" />
  <q-btn color="primary" label="set abi" @click="setAbi" />

  <file-input v-model ="wasm" />
  <q-btn color="primary" label="set code" @click="setCode" />
<!-- <div v-if="abi_info">{{abi_info}}</div>
<div v-if="wasm_info">{{wasm_info}}</div> -->

<!-- <div class="fileContainer q-mb-md ">
    Click here to add wasm!
    <input type="file" id="wasm" @input="handleInput('wasm')" />
</div>
<q-btn color="primary" label="set code" @click="setCode" />

    
    

<div class="fileContainer">
    Click here to add abi!
    <input type="file" id="abi" @input="handleInput('abi')"/>
</div>
<q-btn color="primary" label="set abi" @click="setAbi" /> -->


  </q-page>
</template>

<script>
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
