<template>
<div >
  <div class="row relative-position justify-start q-mb-md">
      <h4 class="q-display-1 q-my-none">Create Msig Transaction</h4>
  </div>
  <q-stepper color="primary-light" class="bg-bg1" ref="stepper" vertical>

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
    <q-step  name="second" title="Specify Actions" subtitle="" >
      <div class="q-mb-md text-text2">
          Add actions to the multisignature transaction
      </div>
      <div v-for="n in 10">Step 2</div>
      <q-stepper-navigation>
        <q-btn color="primary" flat @click="$refs.stepper.previous()" label="Back" />
        <q-btn color="primary" @click="$refs.stepper.next()" label="Next" />
      </q-stepper-navigation>
    </q-step>

    
    <q-step name="third" title="Review Msig Transaction">
      <div v-for="n in 3">Step 3</div>
      <q-stepper-navigation>
        <q-btn color="secondary" @click="$refs.stepper.next()" label="Next" />
        <q-btn color="secondary" flat @click="$refs.stepper.previous()" label="Back" />
      </q-stepper-navigation>
    </q-step>

    <q-step name="fourth" title="Submit">
      <div v-for="n in 3">Step 5</div>
      <q-stepper-navigation>
        <q-btn color="secondary" @click="$refs.stepper.next()" label="Next" />
        <q-btn color="secondary" flat @click="$refs.stepper.previous()" label="Back" />
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {
      controlled_accounts: [
        {account: 'account1', selected: false},
        {account: 'account2', selected: false},
        {account: 'account3', selected: false},
      ]
    }
  },
  methods:{
    handleSelection(index){
      this.controlled_accounts = this.controlled_accounts.map(ca=>{ca.selected=false; return ca});
      this.controlled_accounts[index].selected=true;
    }
    
  }
}
</script>

<style>
.q-stepper-title{
  color:white;
}
</style>
