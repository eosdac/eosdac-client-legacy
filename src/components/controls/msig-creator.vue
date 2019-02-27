<template>
<div class="text-text1">
  <div class="row relative-position justify-start q-mb-md">
      <h4 class="q-display-1 text-text2 q-my-none">Create Msig Transaction</h4>
  </div>
  <q-stepper color="primary-light" class="bg-bg1 bg-logo" ref="stepper"  contractable>

    <!-- step 1 select msig account -->
    <q-step default name="first" title="Select Msig Account" >
      <div class="q-mb-md text-text2">
          Select an account from which you want to propose a multisignature transaction.
      </div>

      <div>
        <div class="text-text1 q-mb-md">The DAC "dacauthority" controls the following accounts:</div>
        <div class="row bg-bg2 q-pa-md">
          <q-btn class=" q-my-sm q-mr-sm"  v-for="(n,i) in controlled_accounts" :key="i"  :label="n.name" color="bg1" @click="handleSelection(i)" >
            <q-icon v-if="n.selected" class="animate-pop q-ml-sm" name="check" color="positive" />
          </q-btn>
        </div>
      </div>

      <div class="row justify-end">
        <q-stepper-navigation>
          <q-btn color="primary" class="animate-pop" @click="$refs.stepper.next()" label="Next" v-if="controlled_accounts.find(ca=> ca.selected==true)" />
        </q-stepper-navigation>
      </div>
    </q-step>

    <!-- step 2 add description -->
    <q-step default name="second" title="Add info" >
      <div class="q-mb-md text-text2">
          Give the msig transaction a name, title and description
      </div>
      <div class="row gutter-md">
        <div class="col-xs-12 col-md-6"><div><q-input :dark="getIsDark" v-model="msig_name" stack-label="Name" placeholder="msig name" /></div></div>
        <div class="col-xs-12 col-md-6"><div><q-input :dark="getIsDark" v-model="msig_title" stack-label="Title" placeholder="title" /></div></div>
      </div>

      <div class="q-mt-lg"><q-input type="textarea" :max-height="150" :dark="getIsDark" v-model="msig_description" stack-label="Description" placeholder="Short info about the transaction" /></div>

      <div class="row justify-end">
        <q-stepper-navigation >
          <q-btn color="primary-light" flat @click="$refs.stepper.previous()" label="Back" />
          <q-btn color="primary" class="animate-pop" @click="$refs.stepper.next()" label="Next" v-if="msig_title && msig_name && msig_description" />
        </q-stepper-navigation>
      </div>
    </q-step>

    <!-- step 3 add actions -->
    <q-step  name="third" title="Add Actions" class="text-text1" subtitle="" >
      <div class="q-mb-md text-text2">
          Add actions to the multisignature transaction.
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
          <q-btn color="primary-light" flat @click="$refs.stepper.previous()" label="Back" />
          <q-btn v-if="actions.length" class="animate-pop" color="primary" @click="$refs.stepper.next()" label="Next" />
        </q-stepper-navigation>
      </div>
    </q-step>

    <!-- step 4 set expiration -->
    <q-step name="fourth" title="Set Exipiration">
      <div class="q-mb-md text-text2">
          Set a date on which the transaction should expire. The transaction will be unexecutable after this date even if all signatures are collected.
      </div>
      <div>
       <q-datetime-picker minimal :dark="getIsDark" class="bg-bg1" color="positive" v-model="trx_expiration" :min="mindate" :max="maxdate" type="date" />
      </div>
      <div class="row justify-end q-mt-md">
        <q-stepper-navigation>
          <q-btn color="primary-light" flat @click="$refs.stepper.previous()" label="Back" />
          <q-btn color="primary" class="animate-pop" @click="$refs.stepper.next()" label="Next" />
        </q-stepper-navigation>
      </div>
    </q-step>

    <!-- step 5 review and submit -->
    <q-step name="fifth" title="Review & Submit" active-icon="remove_red_eye">
      <div class="row justify-between">
        <div class="row">
        <q-item class="animate-pop">
          <q-item-side icon="mdi-account-key-outline" color="text2" />
          <q-item-main style="margin-left:-5px">
            <q-item-tile class="text-text1" label>Multisignature Account</q-item-tile>
            <q-item-tile class="text-text2 q-caption" sublabel>{{getSelectedAccount}}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item class="animate-pop">
          <q-item-side icon="timer" color="text2" />
          <q-item-main style="margin-left:-5px">
            <q-item-tile class="text-text1" label>Expiration</q-item-tile>
            <q-item-tile class="text-text2 q-caption" sublabel>{{trx_expiration}}</q-item-tile>
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
        <q-checkbox :dark="getIsDark" class="text-text2" color="primary-light" v-model="reset_form_after_success" left-label label="Reset after submit" />
      </div>
      <div class="row q-pa-md q-mt-md bg-bg2 round-borders">
          <display-action v-for="(action,i) in actions" :action="action" :key="`a${i}`" viewable/>
      </div>

      <div class="row justify-between  items-center q-mt-lg ">
        <q-btn label="view full Msig" icon="pageview" class="q-my-xs" color="primary" @click="openReview_Msig_Modal" />
        <div class="q-my-xs">
          <q-btn color="primary-light" flat @click="$refs.stepper.previous()" label="Back" />
          <q-btn color="positive" class="animate-pop" @click="proposeMsig" label="submit" />
        </div>

      </div>
    </q-step>
  </q-stepper>

  <!-- review msig modal -->
    <q-modal maximized v-model="review_msig_modal">
      <div style="height:50px" class="bg-bg1 row items-center justify-between q-px-md text-text1">
        <span>Review Msig Transaction: {{msig_name}}</span>
        <q-btn icon="close" @click="review_msig_modal = false; review_msig_modal_content =''" class="no-shadow"/>
      </div>
      <div class="q-pa-md bg-bg2 text-text1 full-height ">
        <div>For convenience the action data is shown in hex and plain text. </div>
        <div v-html="review_msig_modal_content" class="overflow-hidden" />
      </div>
    </q-modal>

  <!-- debug data -->
  <debug-data :data="[{
    'selected_account':controlled_accounts.find(ca=> ca.selected==true),
    'actions': actions,
    'trx_expiration': trx_expiration,
    'getCustodians': getCustodians
    }]" />

</div>
</template>

<script>
const prettyHtml = require('json-pretty-html').default;
import {mapGetters} from 'vuex';
import debugData from 'components/ui/debug-data';
import actionMaker from 'components/controls/action-maker';
import displayAction from 'components/ui/display-action';
import { date } from 'quasar';

const today = new Date();
const { addToDate, subtractFromDate } = date;
const msigTrx_template = { 
        expiration: '',
        ref_block_num: 0,
        ref_block_prefix: 0,
        max_net_usage_words: 0,
        max_cpu_usage_ms: 0,
        delay_sec: 0,
        actions:[],
        context_free_actions: [],
        transaction_extensions: [],
        signatures: [],
        context_free_data: []
        };
export default {
  // name: 'ComponentName',
  components:{
    debugData,
    actionMaker,
    displayAction
  },
  data () {
    return {
      reset_form_after_success: true,
      msig_name:'',
      msig_title:'',
      msig_description:'',
      controlled_accounts: [],
      trx_expiration: new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000) ).toISOString(),
      mindate: today,
      maxdate: addToDate(today, {days: 14}),
      actions:[],
      review_msig_modal: false,
      review_msig_modal_content :''
    }
  },
  computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getCustodians: 'dac/getCustodians',
      getIsDark: 'ui/getIsDark'
    }),
    parseNumberToAsset(number, symbol){
      return `${number.toFixed(4)} ${symbol}`;
    },
    verifyStep2(){
      return true;
    },
    getSelectedAccount(){
      let selected = this.controlled_accounts.find(ca=> ca.selected==true);
      if(selected){
        return selected.name;
      }
      return;
    },
    getSelectedAccount2(){
      let selected = this.controlled_accounts.find(ca=> ca.selected==true);
      if(selected){
        return selected;
      }
      return;
    }
  },

  methods:{
    handleSelection(index){
      this.controlled_accounts = this.controlled_accounts.map(ca=>{ca.selected=false; return ca});
      this.controlled_accounts[index].selected=true;
    },

    addAction(data){
      this.actions.push(data);
    },

    deleteAction(i){
      this.actions.splice(i, 1);
    },

    setControlledAccounts(){
      this.controlled_accounts = this.$configFile.get('authaccount').controlling.map(ca => {
        ca.selected = false;
        return ca;
      })
    },

    constructMsigTransaction(){
      let template = JSON.parse(JSON.stringify(msigTrx_template) );
      template.expiration = this.trx_expiration.split('.')[0]; 
      template.actions = this.actions.map(a=>{
        a.authorization = [{actor: this.getSelectedAccount2.name, permission: this.getSelectedAccount2.permission}];
        //replace plain data with hex
        if(a.hex){
          a.data = a.hex;
          delete a.hex;
        }
        return a;
      });
      return template;
    },

    openReview_Msig_Modal(){
      let template = JSON.parse(JSON.stringify(msigTrx_template) );
      template.expiration = this.trx_expiration.split('.')[0];
      template.actions = this.actions
      this.review_msig_modal_content = prettyHtml(template);
      this.review_msig_modal = true;
    },

    getRequested(){
      let requested = this.getCustodians.map(c => {
        let req = {actor: c.cust_name, permission: 'active'};
        return req;
      });
      return requested;
    },

    async proposeMsig(){
      let propose = {
            account: this.$configFile.get('systemmsigcontract'), 
            name: 'propose',
            data: {
              proposer: this.getAccountName,
              proposal_name: this.msig_name,
              requested: this.getRequested(),
              trx: this.constructMsigTransaction()
            }
      };

      let proposed = {
            account: this.$configFile.get('dacmsigcontract'), 
            name: 'proposed',
            authorization: [ {actor: this.getAccountName, permission: 'active'}, {actor: 'dacauthority', permission: 'one'}],
            data: {
              proposer: this.getAccountName,
              proposal_name: this.msig_name,
              metadata: JSON.stringify({title:this.msig_title, description: this.msig_description})
            }
      };

      let result = await this.$store.dispatch('user/transact', {actions: [propose, proposed] } );
      if(result){
        console.log('transaction callback', result);
        if(this.reset_form_after_success){
          this.$refs.stepper.reset();
          Object.assign(this.$data, this.$options.data());
          this.setControlledAccounts();
        }
        
      }

    }
  },
  mounted(){
    // this.$store.dispatch('dac/fetchControlledAccounts');
    this.setControlledAccounts();
  }
}
</script>

<style>
.q-stepper-title{
  color:white;
}
</style>
