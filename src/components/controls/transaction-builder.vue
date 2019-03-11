<template>
<div class="text-text1">
    <div class="text-text1">

      <div class="row justify-between">

        <div class="row ">
          <q-item class="animate-pop">
            <q-item-side icon="timer" color="text2" />
            <q-item-main style="margin-left:-5px">
              <q-item-tile class="text-text1 q-title" label>Trx Delay</q-item-tile>
              <q-item-tile class="text-text2 q-caption" sublabel>{{getSettingByName('trx_delay').value}} seconds</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item class="animate-pop">
            <q-item-side :icon="$configFile.icon.action" color="text2" />
            <q-item-main style="margin-left:-5px">
              <q-item-tile class="text-text1 q-title" label>Actions</q-item-tile>
              <q-item-tile class="text-text2 q-caption" sublabel>{{actions.length}}</q-item-tile>
            </q-item-main>
          </q-item>
        </div>

        <div class="">
          <q-btn v-if="actions.length" label="view all actions" class="on-left animate-pop" icon="pageview" color="primary" @click="view_actions_modal = true" />
          <q-btn :disabled="!actions.length " color="positive" class="animate-pop" @click="pushTransaction" label="Push TRX" />
        </div>

      </div>

      <div class="row q-mb-md bg-bg2 q-pa-md q-mt-md round-borders" style="min-height:80px">
        <display-action v-for="(action,i) in actions" :action="action" closable viewable @close="deleteAction(i)" :key="`a${i}`" class="cursor-pointer"/>
        <span class="text-negative text-weight-light" v-if="!actions.length">No actions added yet.</span>
      </div>



      <q-tabs :dark="getIsDark" color="primary" swipeable>
        <q-tab default slot="title" name="tab-1" :label="`send ${this.$configFile.get('systemtokensymbol')}`" />
        <q-tab slot="title" name="tab-2" :label="`send ${this.$configFile.get('dactokensymbol')}`" />
        <q-tab slot="title" name="tab-3" :label="`Custom`" />
        <q-tab slot="title" name="tab-4" :label="`Advanced`" />
        <q-tab slot="title" name="tab-5" :label="`Load Trx`" />
        <!-- Targets -->
        <q-tab-pane name="tab-1" class="text-text1  tb-builder-pane-height no-padding" >
          <action-maker :account="$configFile.get('systemtokencontract')" :prefill="{from: getAccountName}" name="transfer" @actiondata="addAction" />
        </q-tab-pane>
        <q-tab-pane name="tab-2" class="text-text1  tb-builder-pane-height no-padding">
          <action-maker :account="$configFile.get('tokencontract')" name="transfer" :prefill="{from: getAccountName}" @actiondata="addAction"/>
        </q-tab-pane>
        <q-tab-pane name="tab-3" class="text-text1  tb-builder-pane-height no-padding">
          <!-- <action-maker account="dacelections" name="updateconfig" @actiondata="addAction"/> -->
          <action-maker @actiondata="addAction" :prefill="{from: getAccountName}"/>
        </q-tab-pane>
        <q-tab-pane name="tab-4" class="text-text1  tb-builder-pane-height no-padding">
          <div class="text-text2 q-my-md">Add a raw json action object to the transaction</div>
          <q-input :dark="getIsDark"   rows="7" color="primary-light" type="textarea" v-model="raw_action_object" />
          <q-btn label="add" color="primary" :disabled="raw_action_object ==''" class="q-mt-md" @click="addAction(JSON.parse(raw_action_object) )" />
        </q-tab-pane>

        <q-tab-pane name="tab-5" class="text-text1  tb-builder-pane-height no-padding">
          <div class="row">
            <q-select
            stack-label="Select Transaction"
            class="q-my-md"
            :dark="getIsDark"
            color="primary-light"
            v-model="selected_template"
              :options="trx_templates.map(t => {return {label: t.name, value: t.name} })"
            />
          </div>
          <div v-for="(action, i) in getSelectedTemplate.actions" :key="`at${i}`">
            <action-maker :account="action.contract" :name="action.action" :prefill="action.prefill" :auth="action.auth" @actiondata="addAction"/>
          </div>
          
        </q-tab-pane>
      </q-tabs>

    </div>

 
  <!-- review modal -->
    <q-modal maximized v-model="view_actions_modal">
      <div style="height:50px" class="bg-bg1 row items-center justify-between q-px-md text-text1">
        <span>Review Actions</span>
        <q-btn icon="close" @click="view_actions_modal = false;" class="no-shadow"/>
      </div>
      <div class="q-pa-md bg-bg2 text-text1 full-height ">
        <div v-html="prettyHtml(actions)" class="overflow-hidden" />
      </div>
    </q-modal>



</div>
</template>

<script>
const prettyHtml = require('json-pretty-html').default;
import {mapGetters} from 'vuex';
import actionMaker from 'components/controls/action-maker';
import displayAction from 'components/ui/display-action';

export default {
  name: 'transactionBuilder',
  components:{
    actionMaker,
    displayAction
  },

  data () {
    return {
      selected_template:'',
      trx_templates: require('../../statics/transaction.templates.json'),
      raw_action_object: '',
      actions:[],
      view_actions_modal: false
    }
  },

  computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getIsDark: 'ui/getIsDark',
      getSettingByName: 'user/getSettingByName',
      getAuthString: 'user/getAuthString'
    }),

    getSelectedTemplate(){
      let selected =  this.trx_templates.find(t => t.name == this.selected_template)
      if(selected){

        selected.actions.map(a =>{
          if(a.prefill){
            Object.keys(a.prefill).forEach(key => { 
              if(String(a.prefill[key]).startsWith('$')){
                a.prefill[key] = this.$store.getters[a.prefill[key].substr(1)]
              }
            })
          }
          if(a.auth && !a.processed){
            a.auth = a.auth.map(a => {
              if(a.startsWith('$')){
                a = this.$store.getters[a.substr(1)]
              }
              let [actor, permission] = a.split('@');
              return {actor: actor, permission: permission};
            })
          }
          a.processed = true;
          return a;
        })
        return selected
      }
      else{
        return []
      }
    },
    parseNumberToAsset(number, symbol){
      return `${number.toFixed(4)} ${symbol}`;
    },
    verifyStep2(){
      return true;
    }


  },

  methods:{

    prettyHtml,
    addAction(data){
      this.actions.push(data);
    },

    deleteAction(i){
      this.actions.splice(i, 1);
    },

    async pushTransaction(){
      let result = await this.$store.dispatch('user/transact', {actions: this.actions } );
      if(result){
        console.log('transaction callback', result);
        this.actions = [];
        // this.latest_trx_id = result.transaction_id
      }
    }
    
  }
}
</script>

<style>
.q-stepper-title{
  color:white;
}
.tb-builder-pane-height{
  min-height:420px;
}
</style>
