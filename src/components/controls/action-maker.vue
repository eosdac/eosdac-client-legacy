<template>
  <div >

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
      
      <div v-if="custom_mode.abi.actions" class="row q-mb-md bg-bg2 q-pa-xs" >
        <q-btn size="10px" :icon="$configFile.icon.action" v-for="(action, i) in custom_mode.abi.actions" :label="action.name" :key="`a${i}`" color="bg1" class="animate-pop q-ma-xs" @click="custom_mode.action_name= action.name" />
        <q-btn size="10px" title="view abi" icon="mdi-magnify" class="animate-pop q-ma-xs" color="positive" @click="view_abi_modal=true" />
      </div>
      
    </div>


    <div v-if="data_fields.length" class=" animate-fade bg-bg2 q-pa-md q-mt-md round-borders">
        <div class="row justify-between q-mb-md">
          <div class="q-py-sm q-title ">
            <q-icon :name="$configFile.icon.action" class="q-mr-xs" size="24px"/>
            <span class="text-text1">{{this.account || custom_mode.account}}</span>
            <div style="display:inline-block" class="fa-arrow-right">></div>
            <span class="text-text1">{{this.name || custom_mode.action_name}}</span>
          </div>
          <auth-display v-model="authorization" :auth="getAuth" />
        </div>
        <div class="row gutter-md">
          <div v-for="(field, i) in data_fields" :key="`field_${i}`" class="col-xs-12 col-md-6">
            <q-item  class=" no-padding" >
              <q-item-main>

                <div v-if="field.type == 'bytes'" class="full-width">
                  <file-input style="margin-top:20px" v-if="field.name == 'abi'" v-model ="data_fields[i].value" label="Select abi" :asbuffer="false"/>
                  <file-input style="margin-top:20px" v-if="field.name == 'code'" v-model ="data_fields[i].value" label="Select wasm" :asbuffer="true"/>
                </div>
                <div v-else-if="field.type == 'bool'">
                  <q-select v-model="data_fields[i].value" :stack-label="field.name" color="primary-light" :dark="getIsDark" :options="[{value:'true', label: 'true'}, {value:'false', label: 'false'}]" />
                </div>
                <div v-else-if="isNumberType(field.type)">
                  <q-input class="animate-fade" v-model="data_fields[i].value"  :name="field.name" ref="input" color="primary-light" :dark="getIsDark" :stack-label="field.name" type="number" :placeholder="field.type"/>
                </div>
                <div v-else-if="field.type=='asset'" >
                  <q-input class="animate-fade" v-model="data_fields[i].value"  :name="field.name" ref="input" color="primary-light" :dark="getIsDark" :stack-label="`${field.name} & symbol`" type="text" :placeholder="field.type"/>
                </div>       
                <div v-else>
                  <q-input class="animate-fade" v-model="data_fields[i].value"  :name="field.name" ref="input" color="primary-light" :dark="getIsDark" :stack-label="field.name" type="text" :placeholder="field.type"/>
                </div>

              </q-item-main>
            </q-item>
          </div>
        </div>

        <div class="row q-mt-md justify-end items-center">
          <span v-if="add_action_feedback!=''" class="text-positive on-left animate-fade q-caption">{{add_action_feedback}}</span>
          <q-btn color="primary" icon="add" label="add action" @click="processInputs"  />
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
import authDisplay from 'components/ui/auth-display'
const prettyHtml = require('json-pretty-html').default;
import {mapGetters} from 'vuex';
const {TextDecoder, TextEncoder} = require('text-encoding');
const {Serialize} = require('eosjs');
const numberTypes =['uint8','int8','uint16','int16','uint32','uint64','int64','int32','varuint32','varint32','uint128','int128','float32','float64','float128'];
import { Notify } from 'quasar';

export default {
  name: 'actionMaker',
  components:{
    fileInput,
    authDisplay
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
      add_action_feedback: '',
      abi_load_error: '',

      isLoading: false,

      data_fields: [],
      authorization: [],
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
    }),
    getAuth(){
    
      if(this.getAccountName && this.getAccount){
        if(this.auth.length){
          return this.auth;
        }
      }
      else{
        return [];
      }

    }


  },

  methods:{
    prettyHtml,
    async getAbi(contract){
      if(!this.getEosApi) return;
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
      if(abi && abi.structs){
        let struct = abi.structs.find(s=> s.name == action_name);
        return struct.fields;
      }

    },

    async setFieldsModel(contract, action_name, abi=false){
      this.data_fields = [];
      let actions = abi || await this.getAbi(contract);
      let fields = this.getDataFieldsForActionName(actions, action_name);
      if(!fields) return;
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
      let process_error = false;
      let action_data = this.data_fields.reduce((res, input) =>{
console.log(this.data_fields)
        //validate and cast types
        let value = String(input.value).trim();
        if((value.includes('[') && value.includes(']') ) || (value.includes('{') && value.includes('}') ) ){
          value = JSON.parse(value);
        }
        else if(this.isNumberType(input.type) ){
          value = Number(value);
        }
        else if(input.type =='bool'){
          value = value === 'true' ? true : false
        }
        else if(input.type =='name' || input.type =='account_name'){
          if(!this.$helper.isAccountname(value)){
            process_error = `${input.name}: invalid accountname`;
          }
        }
        else if(input.type =='asset'){
          let [quantity, symbol] = value.replace(/\s\s+/g, ' ').split(' ');
          if(!quantity || !symbol || symbol.length < 3){
            process_error = `${input.name}: invalid asset`;
          }
          else{
            value = Number(quantity).toFixed(4) +' '+symbol.toUpperCase();
          }
        }

        res[`${input.name}`] = value;
        return res;

      }, {});

      if(process_error){
            this.$q.notify({
                message: `Input Error`,
                timeout: 7000,
                type: 'negative',
                detail: process_error,
                position: 'bottom-right', 
                closeBtn: true, 
            });
            return;
      }

      let action = {
        account: this.account || this.custom_mode.account,
        name: this.name || this.custom_mode.action_name,
        data: action_data
      }
      action.hex = await this.serializeActionData(action);

      
      action.authorization = JSON.parse(this.authorization);


      if(!action.hex){
        return;
      }
      this.add_action_feedback = `Action added`;
      setTimeout(()=>{this.add_action_feedback = ''}, 1500)
      this.$emit('actiondata', action);
    },

    async serializeActionData(action){
      try{
        let account = action.account;
        let name = action.name;
        let data = action.data;
        const contract = await this.getEosApi.eosapi.getContract(account);
        let hex = Serialize.serializeActionData(contract, account, name, data, new TextEncoder, new TextDecoder);
        return hex;

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
    },

    isNumberType(type){
      return numberTypes.includes(type);
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
