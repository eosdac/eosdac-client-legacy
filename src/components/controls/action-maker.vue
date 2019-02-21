<template>
  <div style="min-height:350px">

    <div v-if="data_fields.length">
        
        <q-item v-for="(field, i) in data_fields" :key="`field_${i}`">
          <q-item-main>
            <q-input v-model="data_fields[i].value"  :name="field.name" ref="input" color="primary-light" dark :stack-label="field.name" type="text" :placeholder="field.type"/>
          </q-item-main>
        </q-item>
        <div class="row q-mt-md justify-between items-center">
          
          <div class="q-pa-sm q-caption">
            <span class="text-text2">{{this.account}}</span>
            <div style="display:inline-block" class="fa-arrow-right">></div>
            <span class="text-text2">{{this.name}}</span>
          </div>
          <q-btn color="primary" label="add" @click="processInputs" />
        </div>
    </div>




  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'actionMaker',
  props:{
    account:'',
    name:''
  },
  data () {
    return {
      data_fields: []

    }
  },
  computed:{
    ...mapGetters({
      getEosApi: 'global/getEosApi'
    })

  },

  methods:{
    async getAbi(contract){
      let abi = (await this.getEosApi.eos.get_abi(contract) ).abi;
      return abi;
    },

    getDataFieldsForActionName(abi, action_name){
      let struct = abi.structs.find(s=> s.name == action_name);
      return struct.fields;
    },

    async setFieldsModel(contract, action_name){
      let actions = await this.getAbi(contract);
      let fields = this.getDataFieldsForActionName(actions, action_name);
      this.data_fields = fields.map(f=> {f.value='';return f});
    },

    processInputs(){

      let action_data = this.data_fields.reduce((res, input) =>{
        let value = input.value;
        if((value.includes('[') && value.includes(']') ) || (value.includes('{') && value.includes('}') ) ){
          value = JSON.parse(value);
        }
        res[`${input.name}`] = value;
        return res;
      }, {});

      let action = {
        account: this.account,
        name: this.name,
        data: action_data
      }

      this.$emit('actiondata', action);
    }

  },

  async mounted(){
    if(this.account  && this.name ){
      await this.setFieldsModel(this.account, this.name);
    }
    

  }

}
</script>

<style>
</style>
