<template>
<div>
 <!--small screens mobile-->
<div v-if="!isHidden" class="q-mb-md bg-bg1 round-borders shadow-5 animate-fade lt-sm">

    <div class="row justify-center q-pa-md relative-position">
        <q-chip  v-if="!is_seen_computed"  dense class="animate-fade absolute" style="top:10px;right:10px"  color="negative">new</q-chip>
        <div class="relative-position" style="text-align:center">
          <q-chip  v-if="msig.trx.actions.length > 1"   dense class="absolute" style="top:12px;left:100px" color="dark">{{msig.trx.actions.length}}</q-chip>
          <q-icon style="border:2px solid #4A1289;border-radius:50%" size="48px" count="5" :name="'icon-'+matchIcon" class="q-pa-md q-mr-xs q-mb-xs text-text2" :color="getStatusColor" />
          <div class="q-body-3 text-text1 capitalize">{{msig.title}}</div>
        </div>
    </div>

    <div class="row q-caption  bg-bg2 q-pa-md q-mx-xs round-borders" >
      <div class="full-width">
        <span class="text-text1">Proposal: <span class="text-text2">{{msig.proposal_name}}</span></span>
      </div>
      <div class="full-width q-mt-xs">
        <span class="text-text1">Submitted by:&nbsp;</span>
        <router-link :to="{path: '/profile/' + msig.proposer}" >{{ msig.proposer }}</router-link>
      </div>
      <div class="full-width q-mt-xs">
        <span class="text-text1">Submitted on:&nbsp;<span class="text-text2">{{new Date(msig.block_time).toDateString()}}</span></span>
      </div>
    </div>

    <div class="row q-pa-md justify-between relative-position items-center">
      <div v-if="msig.status == 1 || msig.status == 2" @click="approvals_modal = true" class="cursor-pointer">
          <div class="q-caption text-text2" >Received Approvals:</div>
          <div class="text-text1 q-title">
            <span><q-spinner v-if="provided_approvals==null" color="primary" size="25px" style="margin-top:-4px" /></span>
            <span v-if="provided_approvals" class="text-primary-light cursor-pointer animate-fade">{{provided_approvals.length}}</span>
            <span class="">/{{msig.threshold}}</span>
          </div>
      </div>
      <q-btn label="view details" color="bg2" @click="mobile_details_modal=true; handleIsSeenCache(true)"/>
    </div>

<!-- mobile details modal -->
<q-modal maximized v-model="mobile_details_modal" >
  <div class="text-text1 bg-bg2 full-height">
    <!-- header -->
    <div style="height:50px" class="bg-bg1 row items-center justify-between q-px-md text-text1">
      <span>Proposal Details</span>
      <q-btn icon="close" @click="mobile_details_modal = false" class="no-shadow" />
    </div>
    <!-- content -->
    <div class="q-pa-md " >

      <q-item >
        <q-item-side left >
          <q-icon size="48px" count="5" :name="'icon-'+matchIcon" class=" text-text2" :color="getStatusColor" />
        </q-item-side>
        <q-item-main >
          {{msig.title}}
        </q-item-main>
      </q-item>

      <div class="q-pt-md q-body-1" style="border-top:1px solid grey">
      <div class="row justify-end items-center">
        <q-checkbox color="primary-light"  left-label :label="isSeen ?'Unmark as seen':'Mark as seen' " v-model="isSeen" @input="handleIsSeenCache" />
      </div>
        <div class="q-pb-xs" >
          <span>Proposal name: </span> <span class="text-text2">{{msig.proposal_name}}</span>
        </div>

        <div class="q-pb-xs">
          <span>Submitted by: </span> <span class="text-text2">{{msig.proposer}}</span>
        </div>

        <div class="q-pb-xs">
          <span>Submitted on: </span> <span class="text-text2">{{new Date(msig.block_time).toUTCString()}}</span>
        </div>
        <div class="q-pb-xs">
          <span>Expiration: </span> <span class="text-text2">{{new Date(msig.trx.expiration).toUTCString()}}</span>
        </div>

        <div  class="q-mb-xs">
          <div>Description: </div>
          <div class="text-text2">{{msig.description}}</div>
        </div>
        <div >
          <div>Actions <span class="text-text2">({{msig.trx.actions.length}}) </span></div>
          <div class="text-text2 q-mb-md">{{msig.trx.actions.map(a=>a.name).join(', ')}}</div>
        </div>
      </div>
      
      <div class=" bg-bg2">
        <Actionparser class="q-body-1" @seenAllActions="disable_approve = false" :actions="msig.trx.actions" />
      </div>
    <div v-if="!read_only" class="q-mt-md">  
        <q-btn v-if="!isApproved" class="full-width q-mb-md" :disabled="disable_approve" color="positive" label="Approve" @click="approveProposal(msig.proposer, msig.proposal_name)"  />
        <q-btn v-if="isApproved" class="full-width q-mb-md" color="warning" label="Unapprove" @click="unapproveProposal(msig.proposer, msig.proposal_name)"  />
        <q-btn v-if="isCreator" class="full-width q-mb-md" color="red" label="cancel" @click="cancelProposal(msig.proposer, msig.proposal_name)" />
        <q-btn v-if="isExecutable" class="full-width q-mb-md" label="execute" />
    </div>

    </div>
  </div> 
</q-modal>

</div> 
<!-- end mobile -->

 <!--big screens desktop-->
<div v-if="!isHidden" class="q-mb-md bg-bg1 round-borders shadow-5 animate-fade gt-xs">
    <q-collapsible  label="First" group="msigproposals" icon-toggle header-class="msigproposal_header" collapse-icon="icon-ui-11" @show="handleIsSeenCache(true)">
      <template slot="header" >
        <q-item-side left >
          <div class="row full-height items-center relative-position">
            <q-chip  v-if="msig.trx.actions.length > 1" floating dense color="dark">{{msig.trx.actions.length}}</q-chip>
            <q-chip  v-if="!is_seen_computed" class="animate-fade" floating dense color="negative">new</q-chip>
            <q-icon size="48px" count="5" :name="'icon-'+matchIcon" class="q-mr-xs" :color="getStatusColor" />
          </div>
        </q-item-side>
        <q-item-main >
          <div class="q-ml-lg">
            <!-- <div class="q-title q-mb-xs"><span class="text-text1">{{msig.proposal_name}}:</span> {{msig.title}}</div> -->
            <div class="q-body-3 q-mb-xs text-text1 capitalize" >{{msig.title}}</div>
            <div class="q-caption">
              <div>
                <span class="text-text2">Submitted by: </span>
                <router-link :to="{path: '/profile/' + msig.proposer}" >
                  {{ msig.proposer }}
                </router-link>
              </div>
              <div>
                <span class="text-text2">Submitted on:&nbsp;<span class="text-text1">{{new Date(msig.block_time).toDateString()}}</span></span>
              </div>
            </div>

          </div>
        </q-item-main>
        <q-item-side right v-if="msig.status == 1 || msig.status == 2">

          <div class="q-caption text-text2" >Received Approvals:</div>
          <div class="text-text1 q-display-1">
            <span><q-spinner v-if="provided_approvals==null" color="primary" size="25px" style="margin-top:-4px" /></span>
            <span v-if="provided_approvals" class="text-primary-light cursor-pointer animate-fade"  @click="approvals_modal = true">{{provided_approvals.length}}</span>
            <span class="">/{{msig.threshold}}</span>
          </div>
        </q-item-side>
      </template>

      <div class="q-px-md q-pb-md">
        <div style="border-top: 1px solid grey" >
          <div class="q-mt-md text-text1">Description</div>
          <div class=" q-mb-md">{{msig.description}}</div>
          <div class="q-mt-md text-text1">Expiration</div>
          <div class=" q-mb-md">{{new Date(msig.trx.expiration).toString()}}</div>
          <div class="q-mt-md text-text1">Actions <span class="text-text2">({{msig.trx.actions.length}})</span></div>
          <div class="q-mb-md">{{msig.trx.actions.map(a=>a.name).join(', ')}}</div>
          <div style="text-align:right">
            <span>trx: </span>
            <a target="_blank" :href="$configFile.get('explorer')+`/transaction/${msig.trxid}`" class="q-body-1">{{msig.trxid.substring(0, 8)}}</a>
          </div>
          <div class="bg-dark q-mb-md">
            
            <Actionparser @seenAllActions="disable_approve = false" :actions="msig.trx.actions" />

          </div>

          <div v-if="msig.status == 1 || msig.status == 2" class="row justify-between">
            <span v-if="!read_only">
              <q-btn v-if="!isApproved" class="on-left" :disabled="disable_approve" color="positive" label="Approve" @click="approveProposal(msig.proposer, msig.proposal_name)"  />
              <q-btn v-if="isApproved" class="on-left" color="warning" label="Unapprove" @click="unapproveProposal(msig.proposer, msig.proposal_name)"  />
              <q-btn v-if="isCreator" class="on-left" color="red" label="cancel" @click="cancelProposal(msig.proposer, msig.proposal_name)" />
              <q-btn v-if="isExecutable" color="blue" label="execute" @click="executeProposal(msig.proposer, msig.proposal_name)" />
            </span>
            <span>
              <q-checkbox color="primary-light" left-label :label="isSeen ?'Unmark as seen':'Mark as seen' " v-model="isSeen" @input="handleIsSeenCache" />
            </span>
          </div>

        </div>
      </div>
    </q-collapsible>
  </div> 
  <!-- end big screens -->


<!-- modal for displaying approvals mobile+desktop -->
<q-modal minimized v-model="approvals_modal" >
  <div class="bg-bg2 text-text1">
    <!-- header -->
    <div style="height:50px" class="bg-bg1 row items-center justify-between q-px-md">
      <span>Approvals <span v-if="provided_approvals" class="q-caption text-weight-thin">needs {{msig.threshold-provided_approvals.length}} more</span></span>
      <q-btn icon="close" @click="approvals_modal = false" class="no-shadow" />
    </div>
    <!-- content -->
    <div class="q-pa-md">
      <div class="row justify-start q-mt-sm">
        <!-- <pre>{{provided_approvals}}</pre> -->
        <q-chip class="animate-fade q-mb-sm on-left relative-position" color="bg1" v-for="(c,i) in provided_approvals" :avatar="c.avatar.image" :key="i+'p'">
          <q-icon class="absolute" style="top:-3px; right:-5px" color="positive" name="icon-ui-6" size="18px" />
          <router-link class=" a2" :to="{path: '/profile/' + c.actor}" >
            <div class="q-ma-none" style="min-width:100px; overflow:hidden">{{c.actor}}</div>
          </router-link>
        </q-chip>
        <q-chip class="animate-fade q-mb-sm on-left relative-position" color="bg1" v-for="(c,i) in requested_approvals" :avatar="c.avatar.image" :key="i+'r'">
          <!-- <div class="center_background_image" style="border-radius:50%; width:50px;height:50px" v-bind:style="{ 'background-image': `url(${c.avatar.image})` }"></div> -->
          <router-link class=" a2" :to="{path: '/profile/' + c.actor}" >
            <div class="q-ma-none" style="min-width:100px; overflow:hidden">{{c.actor}}</div>
          </router-link>
        </q-chip>
        <!-- <pre>{{getmsigIsSeenCache}}</pre> -->
      </div>
    </div>
  </div> 
</q-modal>
<!-- <Transaction ref="Transaction" v-on:done="transactionCallback($event)" /> -->
</div>
</template>

<script>

import Actionparser from 'components/ui/action-parser';

import {mapGetters} from 'vuex';
export default {
  name: 'Msigproposal',
  components: {
    Actionparser
  },

  props: {
    msig: Object,

  },

  data () {
    return {
      systemmsig: this.$configFile.get('systemmsigcontract'),
      dacmsig: this.$configFile.get('dacmsigcontract'),
      provided_approvals: null,
      requested_approvals: null,
      isApproved: false,
      isCreator: false,
      isHidden: false,
      approvals_modal: false,
      mobile_details_modal: false,

      isSeen: this.is_seen_computed,

      disable_approve: true

    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getMsigIsSeenCache: 'user/getMsigIsSeenCache',
      getIsCustodian: 'user/getIsCustodian'
    }),

    read_only:function(){
      return !this.getIsCustodian;
    },

    isExecutable: function(){
      if(this.provided_approvals){
        return this.provided_approvals.length >= this.msig.threshold;
        // return this.provided_approvals.length > 0;
      }
      else{
        return false;
      }
    },

    parseActions: function(){
      if(this.msig){
        return this.msig.trx.actions
        // return this.provided_approvals.length > 0;
      }
      else{
        return false;
      }   
    },

    matchIcon: function(){
      const knownactions = ['updateconfig', 'transfer', 'newmemterms'];

      let actions = this.msig.trx.actions.map(a=>a.name);
      if(actions.length > 1){
        return 'action-default';
      }
      else if(!knownactions.includes(actions[0]) ){
        return 'action-default';
      }
      else{
        if(actions[0] == 'updateconfig'){
          actions[0] = "configupdate"; //due to wrong icon name
        }
        return 'action-'+actions[0];
      }
    },

    getStatusColor: function(){
      let statuscolor='';
      if(this.msig.status === 1 && this.isApproved){
        statuscolor = 'positive';
      }
      if(this.msig.status === 0){
        statuscolor = 'negative';
      }
      if(this.isExecutable || this.msig.status === 2){
        statuscolor = 'info';
      }
      return statuscolor;
    },

    is_seen_computed: function(){
      return this.getMsigIsSeenCache.includes(this.msig._id);
    }


  },

  methods: {
    //get the requested and provided approvals for this msg proposal from chain
    async checkApprovals(){
      let approvals = undefined;
      if(this.msig.status === 1){
        approvals = await this.$store.dispatch('dac/fetchApprovalsFromProposal', {proposer: this.msig.proposer, proposal_name: this.msig.proposal_name});
      }
      else if(this.msig.status === 2){
        approvals = {
          provided_approvals:this.msig.provided_approvals,
          requested_approvals:this.msig.requested_approvals
        }
      }

      if(!approvals){
        return;
      }

      let avatars = await this.$profiles.getAvatars([...approvals.provided_approvals.map(a=>a.actor), ...approvals.requested_approvals.map(a=>a.actor) ]);

      this.provided_approvals = approvals.provided_approvals.map(pa=>{
        pa.avatar = avatars.find(p=> p._id===pa.actor );
        // this.$set(pa, 'avatar', avatars.find(p=> p._id===pa.actor ))
        return pa;
      });
        
      this.requested_approvals = approvals.requested_approvals.map(ra=>{
        ra.avatar = avatars.find(p=>p._id===ra.actor);
        return ra;
      });
      //check if user has already approved the proposal
      this.isApproved = this.provided_approvals.find(a => a.actor == this.getAccountName) ? true : false;
      //check if the proposal is created by current user
      this.isCreator = this.getAccountName == this.msig.proposer
      

    },

    //approve a proposal via msig relay {"proposer":0,"proposal_name":0,"level":0}
    async approveProposal(proposer, proposal_name, permission="active"){
      let actions = [
        {
          account: this.systemmsig, 
          name: 'approve', 
          data: {
            proposer: proposer,
            proposal_name: proposal_name,
            level: { "actor": this.getAccountName, "permission": permission }
          }
          
        },
        {
          account: this.dacmsig, 
          name: 'approved',
          authorization: [ {actor: this.getAccountName, permission: 'active'}, {actor: 'dacauthority', permission: 'one'}],
          data: {
            proposer: proposer, 
            proposal_name: proposal_name, 
            approver: this.getAccountName }
        }

      ];
      let result = await this.$store.dispatch('user/transact', {actions: actions});
      if(result){
        this.transactionCallback('e_approval');
      }
    },
  
    //unapprove a proposal via msig relay {"proposer":0,"proposal_name":0,"level":0}
    async unapproveProposal(proposer, proposal_name, permission="active"){
      let actions = [
        {
          account: this.systemmsig, 
          name: 'unapprove', 
          data: {
            proposer: proposer,
            proposal_name: proposal_name,
            level: { "actor": this.getAccountName, "permission": permission }
          }
          
        },
        {
          account: this.dacmsig, 
          name: 'unapproved',
          authorization: [ {actor: this.getAccountName, permission: 'active'}, {actor: 'dacauthority', permission: 'one'}],
          data: {
            proposer: proposer, 
            proposal_name: proposal_name, 
            unapprover: this.getAccountName }
        }

      ];
      let result = await this.$store.dispatch('user/transact', {actions: actions});
      if(result){
        this.transactionCallback('e_unapproval');
      }
    },
    //execute a proposal via msig relay {"proposer":0,"proposal_name":0,"executer":0}
    async executeProposal(proposer, proposal_name){
      let actions = [
        {
          account: this.systemmsig, 
          name: 'exec', 
          data: {
            proposer: proposer,
            proposal_name: proposal_name,
            executer: this.getAccountName
          }
        },
        {
          account: this.dacmsig, 
          name: 'executed',
          authorization: [ {actor: this.getAccountName, permission: 'active'}, {actor: 'dacauthority', permission: 'one'}],
          data: {
            proposer: proposer, 
            proposal_name: proposal_name, 
            executer: this.getAccountName }
        }

      ];
      let result = await this.$store.dispatch('user/transact', {actions: actions});
      if(result){
        this.transactionCallback('e_exec');
      }

    },
    
    //cancel a proposal via msig relay {"proposer":0,"proposal_name":0,"canceler":0}
    async cancelProposal(proposer, proposal_name){
      let actions = [
        {
          account: this.systemmsig, 
          name: 'cancel', 
          data: {
            proposer: proposer,
            proposal_name: proposal_name,
            canceler: this.getAccountName
          }
          
        },
        {
          account: this.dacmsig, 
          name: 'cancelled',
          authorization: [ {actor: this.getAccountName, permission: 'active'}, {actor: 'dacauthority', permission: 'one'}],
          data: {
            proposer: proposer, 
            proposal_name: proposal_name, 
            canceler: this.getAccountName }
        }

      ];
      let result = await this.$store.dispatch('user/transact', {actions: actions});
      if(result){
        this.transactionCallback('e_cancel');
      }

    },

    transactionCallback(e_t){
      
      if(e_t === 'e_unapproval' || e_t === 'e_approval'){
        this.provided_approvals = null;//temporary show spinner by setting to null
        this.checkApprovals();
      }

      if(e_t === 'e_cancel'){
        //hide the proposal
        this.isHidden = true;
      }
      if(e_t === 'e_exec'){
        console.log('executed');
        this.isHidden = true;
      }
      this.mobile_details_modal=false;

    },

    handleIsSeenCache(isSeen_toggle_bool){
      console.log(isSeen_toggle_bool, this.msig._id);
      
      if(isSeen_toggle_bool){
        this.isSeen = true;
        this.$store.commit('user/setMsigIsSeenCache', {mode: 'add', msig_id: this.msig._id} );

      }
      else{
        this.isSeen = false;
        this.$store.commit('user/setMsigIsSeenCache', {mode: 'remove', msig_id: this.msig._id} );
      }
      
    },

  },


  mounted:function(){
   this.checkApprovals();
  },


}
</script>

<style lang ="stylus">
@import '~variables'

.proposal_approved{
  border:2px solid $positive;
  transition : border 400ms ease;
}

.proposal_unapproved{
  border:2px solid transparent;
  transition : border 400ms ease;
}

</style>
