<template>
<div class="text-text1">

  <q-stepper color="primary-light" class="bg-bg1 bg-logo" ref="stepper"  contractable>


    <!-- step 1 add actions -->
    <q-step  name="first" title="Add Actions" class="text-text1" subtitle="" >
      <div class="q-mb-md text-text2">
          Add actions to the transaction
      </div>
      <div class="row q-mb-md bg-bg2 q-pa-md round-borders">
        <display-action v-for="(action,i) in actions" :action="action" closable viewable @close="deleteAction(i)" :key="`a${i}`" class="cursor-pointer"/>
        <span class="text-text2" v-if="!actions.length">No actions added yet.</span>
      </div>
      <q-tabs :dark="getIsDark">
        <q-tab default slot="title" name="tab-1" :label="`send ${this.$configFile.get('systemtokensymbol')}`" />
        <q-tab slot="title" name="tab-2" :label="`send ${this.$configFile.get('dactokensymbol')}`" />
        <q-tab slot="title" name="tab-3" :label="`Advanced`" />
        <!-- Targets -->
        <q-tab-pane name="tab-1" class="text-text1 bg-bg2">
          <action-maker :account="$configFile.get('systemtokencontract')" name="transfer" @actiondata="addAction" />
        </q-tab-pane>
        <q-tab-pane name="tab-2" class="text-text1 bg-bg2">
          <action-maker :account="$configFile.get('tokencontract')" name="transfer" @actiondata="addAction"/>
        </q-tab-pane>
        <q-tab-pane name="tab-3" class="text-text1 bg-bg2">
          <!-- <action-maker account="dacelections" name="updateconfig" @actiondata="addAction"/> -->
          <action-maker @actiondata="addAction"/>
        </q-tab-pane>
      </q-tabs>

      <div class="row justify-end q-mt-md">
        <q-stepper-navigation>
          <q-btn v-if="actions.length" class="animate-pop" color="primary" @click="$refs.stepper.next()" label="Next" />
        </q-stepper-navigation>
      </div>
    </q-step>


    <!-- step 2 review and submit -->
    <q-step name="second" title="Review & Submit" active-icon="remove_red_eye">
      <div class="row">
        <q-item class="animate-pop">
          <q-item-side icon="timer" color="text2" />
          <q-item-main style="margin-left:-5px">
            <q-item-tile class="text-text1" label>Trx Delay</q-item-tile>
            <q-item-tile class="text-text2 q-caption" sublabel>{{getSettingByName('trx_delay').value}}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item class="animate-pop">
          <q-item-side icon="donut_large" color="text2" />
          <q-item-main style="margin-left:-5px">
            <q-item-tile class="text-text1" label>Actions</q-item-tile>
            <q-item-tile class="text-text2 q-caption" sublabel>{{actions.length}}</q-item-tile>
          </q-item-main>
        </q-item>
      </div>
      <div class="row q-pa-md q-mt-md bg-bg2 round-borders">
          <display-action v-for="(action,i) in actions" :action="action" :key="`a${i}`" viewable/>
      </div>

      <div class="row justify-between  items-center q-mt-lg ">
        <q-btn label="view all actions" icon="pageview" color="primary" @click="view_actions_modal = true" />
        <div>
          <q-btn color="primary-light" flat @click="$refs.stepper.previous()" label="Back" />
          <q-btn color="positive" class="animate-pop" @click="pushTransaction" label="submit" />
        </div>

      </div>
    </q-step>
  </q-stepper>

  <!-- review msig modal -->
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
      actions:[],
      view_actions_modal: false

    }
  },

  computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getIsDark: 'ui/getIsDark',
      getSettingByName: 'user/getSettingByName'
    }),
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
        this.$refs.stepper.reset();
        this.actions = [];
      }
    }
    
  }
}
</script>

<style>
.q-stepper-title{
  color:white;
}
</style>
