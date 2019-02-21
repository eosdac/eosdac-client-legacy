<template>
<div class="text-text1">
  <div class="row relative-position justify-start q-mb-md">
      <h4 class="q-display-1 q-my-none">Create Msig Transaction</h4>
  </div>
  <q-stepper color="primary-light" class="bg-bg1" ref="stepper"  contractable>

    <!-- step 1 select msig account -->
    <q-step default name="first" title="Select Msig Account" >
      <div class="q-mb-md text-text2">
          Select an account from which you want to propose a multisignature transaction
      </div>

      <div class="row">
        <q-btn class="text-text1 q-my-sm q-mr-sm"  v-for="(n,i) in controlled_accounts" :key="i"  :label="n.account" color="bg2" @click="handleSelection(i)" >
          <q-icon v-if="n.selected" class="animate-fade" name="check" color="positive" />
        </q-btn>
      </div>

      <div class="row justify-end">
        <q-stepper-navigation>
          <q-btn color="primary" class="animate-fade" @click="$refs.stepper.next()" label="Next" v-if="controlled_accounts.find(ca=> ca.selected==true)" />
        </q-stepper-navigation>
      </div>
    </q-step>

    <!-- step 2 add actions -->
    <q-step  name="second" title="Specify Actions" class="text-text1" subtitle="" >
      <div class="q-mb-md text-text2">
          Add actions to the multisignature transaction
      </div>
      <q-tabs dark>
        <q-tab default slot="title" name="tab-1" :label="`send ${this.$configFile.get('systemtokensymbol')}`" />
        <q-tab slot="title" name="tab-2" :label="`send ${this.$configFile.get('dactokensymbol')}`" />
        <q-tab slot="title" name="tab-3" :label="`Advanced`" />
        <!-- Targets -->
        <q-tab-pane name="tab-1" class="text-text1 bg-bg2 bg-logo">
          <action-maker :account="$configFile.get('systemtokencontract')" name="transfer"/>
        </q-tab-pane>
        <q-tab-pane name="tab-2" class="text-text1 bg-bg2 bg-logo">
          <action-maker :account="$configFile.get('tokencontract')" name="transfer"/>
        </q-tab-pane>
        <q-tab-pane name="tab-3" class="text-text1 bg-bg2 bg-logo">
          <action-maker />
        </q-tab-pane>
      </q-tabs>

      <div class="row justify-end q-mt-md">
        <q-stepper-navigation>
          <q-btn color="primary" flat @click="$refs.stepper.previous()" label="Back" />
          <q-btn v-if="verifyStep2" color="primary" @click="$refs.stepper.next()" label="Next" />
        </q-stepper-navigation>
      </div>
    </q-step>


    <q-step name="third" title="Set Exipiration">
      <div>
       <q-datetime-picker minimal dark class="bg-bg1" color="positive" v-model="trx_expiration" :min="mindate" :max="maxdate" type="date" />
      </div>
      <div class="row justify-end q-mt-md">
        <q-stepper-navigation>
          <q-btn color="primary" flat @click="$refs.stepper.previous()" label="Back" />
          <q-btn color="primary" @click="$refs.stepper.next()" label="Next" />
        </q-stepper-navigation>
      </div>
    </q-step>

    <q-step name="fourth" title="Submit">
      <div v-for="n in 3">Step 5</div>

      <div class="row justify-end q-mt-md">
        <q-stepper-navigation>
          <q-btn color="primary" flat @click="$refs.stepper.previous()" label="Back" />
          <q-btn color="positive" @click="" label="submit" />
        </q-stepper-navigation>
      </div>
    </q-step>
  </q-stepper>
<debug-data :data="[{
  'action_data': action_data,
  'trx_expiration': trx_expiration
  }]" />
</div>
</template>

<script>
import debugData from 'components/ui/debug-data';
import actionMaker from 'components/controls/action-maker';
import { date } from 'quasar';
const today = new Date();
const { addToDate, subtractFromDate } = date;

export default {
  // name: 'ComponentName',
  components:{
    debugData,
    actionMaker
  },
  computed:{
    parseNumberToAsset(number, symbol){
      return `${number.toFixed(4)} ${symbol}`;
    },
    verifyStep2(){
      let test = false;
      if(this.$helper.isAccountname(this.action_data.to) && this.action_data.quantity){
        test = true;
      }

      return test;
    }
  },
  data () {
    return {
      controlled_accounts: [
        {account: 'account1', selected: false},
        {account: 'account2', selected: false},
        {account: 'account3', selected: false},
      ],
      trx_expiration: new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000) ).toISOString(),
      mindate: today,
      maxdate: addToDate(today, {days: 14}),
      action_data:{
        from:'',
        to:'',
        quantity:'',
        memo:''
      }
    }
  },
  methods:{
    handleSelection(index){
      this.controlled_accounts = this.controlled_accounts.map(ca=>{ca.selected=false; return ca});
      this.controlled_accounts[index].selected=true;
      this.action_data.from = this.controlled_accounts[index].account;
    }
    
  }
}
</script>

<style>
.q-stepper-title{
  color:white;
}
</style>
