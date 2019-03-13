<template>
<div class="text-text1">
  <div class="row relative-position justify-start q-mb-md">
      <h4 class="q-display-1 text-text2 q-my-none">Create Msig Transaction</h4>
  </div>
  <div class="bg-bg1 round-borders shadow-5 q-pa-md">
    <q-stepper color="primary-light" class="bg-bg1 bg-logo" ref="stepper"  contractable>

      <!-- step 1 select msig account -->
      <q-step default name="first" title="Select Msig Account" :subtitle="getSelectedAccount">
        <div class="q-mb-md text-text2">
            Select an account from which you want to propose a multisignature transaction or specify an individual action. 
        </div>

        <div>

          <div class="row bg-bg2 q-pa-md ">

            <q-btn-dropdown  dark v-for="(n,i) in controlled_accounts" :icon="n.selected ?'check':''" split :key="`b${i}`" color="bg1" class="q-ma-xs" :label="n.name" @click="actionfilter=false; handleSelection(i)">

              <q-list  link class="bg-dark"  >
                <q-item v-for="(la, j) in n.linkedAuths" :key="`la${j}`" @click.native=" actionfilter=j; handleSelection(i)">
                  <q-item-main>
                    <q-item-tile class="text-text1 q-body-1" label>{{`${la.contract}::${la.action}`}}</q-item-tile>
                    <q-item-tile class="text-text2 q-caption" sublabel>{{`@${la.permission}`}}</q-item-tile>
                  </q-item-main>
                  <!-- <q-item-side right icon="info" color="amber" /> -->
                </q-item>
              </q-list>

            </q-btn-dropdown>
            
            
          </div>
        </div>

        <div class="row justify-between q-mt-md" style="min-height:36px">
          <div><q-btn label="advanced"  :icon="allow_advanced ? 'check': ''" size="sm" flat color="primary-light" @click="allow_advanced=!allow_advanced; unSelectAll()" /></div>
          <div><q-btn color="primary" class="animate-pop" @click="$refs.stepper.next()" label="Next" v-if="controlled_accounts.find(ca=> ca.selected==true) || allow_advanced" /></div>
        </div>
      </q-step>

      <!-- step 2 add actions -->
      <q-step  name="second" title="Add Actions" class="text-text1" subtitle="" >
        <div class="q-mb-md text-text2">
            Add actions to the multisignature transaction. <span v-if="actions.length >1" class="animate-fade">Sort the actions by dragging.</span>
        </div>

        <div class="row q-mb-md bg-bg2 q-pa-md q-mt-md round-borders" style="min-height:80px">
          <draggable v-model="actions" group="actions" @start="drag=true" @end="drag=false" style="display:flex">
            <display-action v-for="(action,i) in actions" :action="action" closable viewable @close="deleteAction(i)" :key="`a${i}`" class="cursor-pointer" />
          </draggable>
          <span class="text-negative text-weight-light" v-if="!actions.length">No actions added yet.</span>
        </div>

        <div v-if="getSelectedAccount">
          <q-btn v-if="actionfilter!==false && getSelectedAccount2.linkedAuths.length > 1" label="show all linked actions" color="bg2" @click="actionfilter=false"/>

          <div v-for="(linkedauth, i) in getSelectedAccount2.linkedAuths" :key="`la${i}`" class="text-text1 animate-fade">
            <action-maker
            v-if="actionfilter===false || actionfilter==i"
            :account="linkedauth.contract" 
            :name="linkedauth.action" 
            :prefill="{from: getSelectedAccount, account: getSelectedAccount}" 
            :auth="[{actor: getSelectedAccount, permission: linkedauth.permission}]" 
            @actiondata="addAction"
            />

          </div>

        </div>
        <div v-else class="text-text1">
          <action-maker @actiondata="addAction" :prefill="{from: getAccountName}"/>
        </div>

        <div class="row justify-end q-mt-md">
          <q-stepper-navigation>
            <q-btn color="primary-light" flat @click="$refs.stepper.previous()" label="Back" />
            <q-btn v-if="actions.length" class="animate-pop" color="primary" @click="$refs.stepper.next()" label="Next" >
              <q-chip floating count="5" >{{actions.length}}</q-chip>
              </q-btn>
          </q-stepper-navigation>
        </div>
      </q-step>

      <!-- step 3 add description -->
      <q-step default name="third" title="Add info" >
        <div class="q-mb-md text-text2">
            Give the msig transaction a title and description
        </div>
        <div class="row gutter-md">
          <div class="col-xs-12 col-md-6">
            <div class="full-height">
              <q-input type="text" :dark="getIsDark" maxlength="70" v-model="msig_title" stack-label="Title" placeholder="title" class="q-mb-md" />

            </div>
          </div>

          <div class="col-xs-12 col-md-6">
            <div class="full-height">
              <q-item class="no-padding">
                <q-btn icon="refresh" flat color="primary-light" title="generate new id" @click="msig_name = $helper.randomName();" />
                <q-item-main class="q-pa-md">
                  <q-input readonly hide-underline :dark="getIsDark" v-model="msig_name" stack-label="ID/Name" placeholder="msig name" />
                </q-item-main>
              </q-item>
            </div>
          </div>
          <div class="col-xs-12">
            <div class="full-height">
              <q-input type="textarea"  :max-height="200" :dark="getIsDark" v-model="msig_description" stack-label="Description" placeholder="Short info about the transaction" />

            </div>
          </div>
        </div>

        <div class="row justify-end">
          <q-stepper-navigation >
            <q-btn color="primary-light" flat @click="$refs.stepper.previous()" label="Back" />
            <q-btn color="primary" class="animate-pop" @click="$refs.stepper.next()" label="Next" v-if="msig_title && msig_name && msig_description" />
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
        <div class="q-mb-md text-text2">
            Please review your msig carefully. You can jump back and forth to make changes. 
        </div>
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
              <q-item-side :icon="$configFile.icon.action" color="text2" />
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
  </div>
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
import draggable from 'vuedraggable';
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
    displayAction,
    draggable
  },
  data () {
    return {
      actionfilter:false,
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
      review_msig_modal_content :'',
      allow_advanced: false
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
      return {};
    }
  },

  methods:{
    handleSelection(index){
      this.allow_advanced = false;
      this.controlled_accounts = this.controlled_accounts.map(ca=>{ca.selected=false; return ca});
      this.controlled_accounts[index].selected=true;
      this.$refs.stepper.next()
    },
    unSelectAll(){
      this.controlled_accounts = this.controlled_accounts.map(ca=>{ca.selected=false; return ca});
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
        // a.authorization = [{actor: this.getSelectedAccount2.name, permission: this.getSelectedAccount2.permission}];
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
        this.msig_name = this.$helper.randomName();

        if(this.reset_form_after_success){
          this.$refs.stepper.reset();
          this.msig_title='';
          this.msig_description='';
          this.controlled_accounts = [];
          this.trx_expiration= new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000) ).toISOString();
          this.actions=[];
          this.review_msig_modal_content ='';
          this.setControlledAccounts();
        }
        
      }

    }
  },
  mounted(){
    // this.$store.dispatch('dac/fetchControlledAccounts');
    this.setControlledAccounts();
    this.msig_name = this.$helper.randomName();
  }
}
</script>

<style lang="stylus">
@import '~variables'


</style>
