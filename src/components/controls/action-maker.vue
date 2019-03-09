<template>
  <div>

    <!-- no props set = custom_mode -->
    <div v-if="account=='' && name=='' ">
      <div class="q-mb-sm">
        <q-item>
          <q-item-main>
            <q-input :dark="getIsDark" v-model="custom_mode.account" type="text" stack-label="Contract" placeholder="input a contract name" @keyup.enter.native="data_fields=[];custom_mode_parse_actions(custom_mode.account)" />
          </q-item-main>
          <q-item-side right>
            <q-btn color="primary-light"  flat label="load" @click="data_fields=[];custom_mode_parse_actions(custom_mode.account)" />
          </q-item-side>
        </q-item>
      </div>
      
      <div v-if="custom_mode.abi.actions" class="row" >
        <q-btn size="sm" v-for="(action, i) in custom_mode.abi.actions" :label="action.name" :key="`a${i}`" color="bg1" class="animate-pop q-ma-xs" @click="custom_mode.action_name= action.name" />
        <q-btn size="sm" title="view abi" icon="mdi-magnify" class="animate-pop q-ma-xs" color="positive" @click="view_abi_modal=true" />
      </div>
      
    </div>


    <div v-if="data_fields.length" class="bg-bg1 q-pa-md round-borders animate-fade">
 
        <div class="q-pa-sm q-title">
          <span class="text-text2">{{this.account || custom_mode.account}}</span>
          <div style="display:inline-block" class="fa-arrow-right">></div>
          <span class="text-text2">{{this.name || custom_mode.action_name}}</span>
        </div>
        <q-item v-for="(field, i) in data_fields" :key="`field_${i}`" >
          <q-item-main>

            <div v-if="field.type == 'bytes'">
              <file-input v-if="field.name == 'abi'" v-model ="data_fields[i].value" label="Select abi" :asbuffer="false"/>
              <file-input v-if="field.name == 'code'" v-model ="data_fields[i].value" label="Select wasm" :asbuffer="true"/>
            </div>
            <div v-else>
              <q-input class="animate-fade" v-model="data_fields[i].value"  :name="field.name" ref="input" color="primary-light" :dark="getIsDark" :stack-label="field.name" type="text" :placeholder="field.type"/>
            </div>

          </q-item-main>
        </q-item>

        <div class="row q-mt-md justify-end items-center">

          <q-btn color="primary" label="add" @click="processInputs"  />
        </div>
    </div>

    <div v-if="isLoading" class="row justify-center"><q-spinner color="primary-light" :size="60" /></div>
    <div v-if="abi_load_error !='' " class="animate-fade q-pa-md text-negative q-caption">{{abi_load_error}}</div>

    <!-- view abi modal -->
    <q-modal minimized v-model="view_abi_modal">
      <div style="height:50px" class="bg-bg1 row items-center justify-between q-px-md text-text1">
        <span>ABI: {{custom_mode.account}}</span>
        <q-btn icon="close" @click="view_abi_modal = false;" class="no-shadow"/>
      </div>
      <div class="q-pa-md bg-bg2 text-text1">
        <div v-html="prettyHtml(custom_mode.abi)" class="overflow-hidden" />
      </div>
    </q-modal>



  </div>
</template>

<script>
import fileInput from 'components/controls/file-input'
const prettyHtml = require('json-pretty-html').default;
import {mapGetters} from 'vuex';
const {TextDecoder, TextEncoder} = require('text-encoding');
const {Serialize} = require('eosjs');
const numberTypes =['bool','uint8','int8','uint16','int16','uint32','uint64','int64','int32','varuint32','varint32','uint128','int128','float32','float64','float128'];
import { Notify } from 'quasar';

export default {
  name: 'actionMaker',
  components:{
    fileInput
  },
  props:{
    account:{
      type: String,
      default: ''
    },
    name:{
      type: String,
      default: ''
    },
    prefill:{
      type: Object,
      default: function () { return {} }
    },
    auth:{
      type: Array,
      default: function () { return [] }
    }
  },
  data () {
    return {
      abi_load_error: '',

      isLoading: false,

      data_fields: [],

      view_abi_modal : false,

      custom_mode:{
        account:'',
        action_name:'',
        abi:{}
      }

    }
  },
  computed:{
    ...mapGetters({
      getEosApi: 'global/getEosApi',
      getIsDark: 'ui/getIsDark',
      getAccountName: 'user/getAccountName',
      getAccount: 'user/getAccount'
    })

  },

  methods:{
    prettyHtml,
    async getAbi(contract){
      this.abi_load_error ='';
      this.isLoading = true;
      let abi = await this.getEosApi.eos.get_abi(contract).catch(e=>{ console.log(e)}) ;
      
      this.isLoading = false;
      if(abi && abi.abi){
        
        return abi.abi
      }
      else{
        this.abi_load_error =`ABI for ${contract} not found`;
        return false;
      }

      
    },

    getDataFieldsForActionName(abi, action_name){
      let struct = abi.structs.find(s=> s.name == action_name);
      return struct.fields;
    },

    async setFieldsModel(contract, action_name, abi=false){
      this.data_fields = [];
      let actions = abi || await this.getAbi(contract);
      let fields = this.getDataFieldsForActionName(actions, action_name);
      this.data_fields = fields.map(f=> {
        if(this.prefill[f.name] ){
          f.value=this.prefill[f.name];
        }
        else{
          f.value='';
        }
        return f;
      });
    },

    async processInputs(){
      
      let action_data = this.data_fields.reduce((res, input) =>{
        let value = input.value;
        if((value.includes('[') && value.includes(']') ) || (value.includes('{') && value.includes('}') ) ){
          value = JSON.parse(value);
        }
        else if(numberTypes.includes(input.type) ){
          value = Number(value);
        }
        console.log('input type',input.type)
        res[`${input.name}`] = value;
        return res;
      }, {});

      let action = {
        account: this.account || this.custom_mode.account,
        name: this.name || this.custom_mode.action_name,
        data: action_data
      }
      action.hex = await this.serializeActionData(action);

      if(this.auth.length){
        action.authorization = this.auth;
      }
      else{
        action.authorization = [{actor: this.getAccountName, permission: this.getAccount.authority }];
      }

      if(!action.hex){
        return;
      }

      this.$emit('actiondata', action);
    },

    async serializeActionData(action){
      try{
        let account = action.account;
        let name = action.name;
        let data = action.data;

        // let sbuf = new Serialize.SerialBuffer({
        //     textEncoder: new TextEncoder,
        //     textDecoder: new TextDecoder,
        // });

        const contract = await this.getEosApi.eosapi.getContract(account);
        // contract.actions.get(name).serialize(sbuf, data, new Serialize.SerializerState({ bytesAsUint8Array: true }));
        // let action_data_hex = Serialize.arrayToHex(sbuf.array);
        let hex = Serialize.serializeActionData(contract, account, name, data, new TextEncoder, new TextDecoder);
        return hex;
        // return action_data_hex;
      }
      catch(e){
        console.log(e);
        Notify.create({
          message: `Serialize`+e.stack.split('\n')[0],
          detail: 'See console for more info',
          timeout: 2000,
          type: 'negative',
          position: 'bottom-right'
        });
        return false;
      }


    },

    async custom_mode_parse_actions(accountname){
      if(!this.$helper.isAccountname(accountname)){
        console.log(`"${accountname}" is not a valid accountname`);
        return false;
      }
      this.custom_mode.abi = {};
      
      let abi = await this.getAbi(accountname).catch(e=>{this.isLoading = false});
      if(abi){
        this.custom_mode.abi = abi;
      }
      
      
    }

  },

  async mounted(){
    if(this.account  && this.name ){
      await this.setFieldsModel(this.account, this.name);
    }
    

  },
  watch:{
    'custom_mode.action_name': function(){
      this.setFieldsModel(this.custom_mode.account, this.custom_mode.action_name, this.custom_mode.abi)

    },
    name: function(){
      if(this.account  && this.name ){
        this.setFieldsModel(this.account, this.name);
      }
    }

  }

}
</script>

<style>
</style>
