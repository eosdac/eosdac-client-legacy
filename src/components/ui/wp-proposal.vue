<template>
  <div v-if="wp.key && show" class="q-mb-md q-pa-md bg-bg1 round-borders shadow-5 bg-logo full-height">
    <div class="row">
    
        <profile-pic :accountname="wp.proposer" />
        <q-item >
          <q-item-main>
            <q-item-tile label>Proposer</q-item-tile>
            <q-item-tile sublabel>{{wp.proposer}}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item >
          <q-item-main>
            <q-item-tile label>Requested Pay</q-item-tile>
            <q-item-tile sublabel>{{wp.pay_amount.quantity}}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item >
        <q-item-main>
            <q-item-tile label>Arbitrator</q-item-tile>
            <q-item-tile sublabel>{{wp.arbitrator}}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item >
          <q-item-main>
            <q-item-tile label>Status</q-item-tile>
            <q-item-tile sublabel>{{wp.state}}</q-item-tile>
          </q-item-main>
        </q-item>
      
      
    </div>
    

    <div class="q-mt-md q-title text-weight-thin capitalize">WP{{wp.key}}: {{wp.title}}</div>
    
    <div class="bg-bg2 q-pa-md q-mt-sm round-borders text-weight-light text-text2">{{wp.summary}}</div>

    <!-- <div>{{getVotes}}</div>
    <div>{{wp.state}}</div>
    <div>{{getIsCreator}}</div> -->
    
    <div class="q-mt-md ">
      
      <div class="row">
          <div v-for="(vote,i) in getVotes" :key="`v${i}`" >
            <div style=""><profile-pic  :accountname="vote.voter" :scale="0.7" /></div>
          </div>
      </div>


    </div>
    
    <!-- <div><profile-pic :accountname="wp.arbitrator" :scale="0.7"/></div> -->

    <div v-if="!read_only" class="row justify-end">
      <div v-if="wp.state==0">
        <q-btn  v-if="getVoterStatus==2 || getVoterStatus==0" class="on-right"  color="positive" label="Approve" @click="voteprop('voteApprove')"  />
        <q-btn  v-if="getVoterStatus==1 || getVoterStatus==0" class="on-right"  color="negative" label="Deny" @click="voteprop('voteDeny')"  />
      </div>
      <div v-if="wp.state==2">
        <q-btn  class="on-right"  color="positive" label="Approve Claim" @click="voteprop('claimApprove')"  />
        <q-btn  class="on-right"  color="negative" label="Deny Claim" @click="voteprop('claimDeny')"  />
        <q-btn   v-if="getIsArbitrator" class="on-right"  flat color="positive" label="arb approve" @click="arbApprove()" />
      </div>
      <div v-if="wp.state==1">
        Work is being executed
      </div>
      <div v-if="getIsCreator">
        <q-btn   class="on-right"  flat color="negative" label="cancel" @click="cancelProp()"  />
        <q-btn   class="on-right"  flat color="info" label="Start work" @click="startWork()" />
        <q-btn   class="on-right"  flat color="info" label="complete work" @click="completeWork()" />
      </div>
      <div >
        
      </div>
    </div>
{{proposal_threshold_met}}
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import profilePic from 'components/ui/profile-pic';
export default {
  name: 'wpProposal',
  components:{
    profilePic
  },
  props:{
    read_only: false,
    wp:{
      type: Object,
      default: ()=>{ return {} }
    }
  },
  data () {
    return {
      show: true
    }
  },
  computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getWpConfig: 'dac/getWpConfig'
    }),
    getVotes(){
      if(this.wp.votes){
        return this.wp.votes;
      }
    },
    getIsCreator(){
      return this.getAccountName === this.wp.proposer;
    },
    getIsArbitrator(){
      return this.getAccountName === this.wp.arbitrator;
    },
    //get vote type of logged in user
    getVoterStatus(){
      let myvote = this.wp.votes.find(v => v.voter==this.getAccountName);
      if(!myvote){
        console.log('not voted yet')
        return 0;
      }
      else{
        return myvote.vote
      }
    },
    //when wp state is 0
    proposal_threshold_met(){
      const approved_votes = this.wp.votes.filter(wpv => wpv.vote == 1).length;
      if(this.getWpConfig.proposal_threshold !== null && this.getWpConfig.proposal_threshold <= approved_votes ){
        return true;
      }
      else{
        return false;
      }
    },
    //when wp state is 2
    claim_threshold_met(){
      const approved_claim = this.wp.votes.filter(wpv => wpv.vote == 3).length;
      if(this.getWpConfig.claim_threshold !== null && this.getWpConfig.claim_threshold <= approved_claim ){
        return true;
      }
      else{
        return false;
      }
    }
  },

  methods:{

    async voteprop(votetype){
      const map = {voteApprove: 1, voteDeny: 2, claimApprove: 3, claimDeny: 4};

      let actions = [{
        account: this.$configFile.get('wpcontract'),
        name: "voteprop",
        authorization: [ {actor: this.getAccountName, permission: 'active'}, {actor: this.$configFile.get('authaccountname'), permission: 'one'}],
        data: {
          custodian: this.getAccountName,
          proposal_id: Number(this.wp.key),
          vote: map[votetype]
        }
      }];

      let result = await this.$store.dispatch('user/transact', {actions: actions});
      if(result){
        let vote = this.wp.votes.find(v => v.voter==this.getAccountName);

        if(vote){
          vote.vote = map[votetype];
        }
        else {
          this.wp.votes.push({"proposal_id": Number(this.wp.key), "voter": this.getAccountName, "vote": map[votetype], "comment_hash": "" })
        }

        console.log(result);
      }

    },
    async cancelProp(){
      let actions = [{
        account: this.$configFile.get('wpcontract'),
        name: "cancel",
        authorization: [ {actor: this.getAccountName, permission: 'active'}, {actor: this.$configFile.get('authaccountname'), permission: 'one'}],
        data: {
          proposal_id: Number(this.wp.key),
        }
      }];

      let result = await this.$store.dispatch('user/transact', {actions: actions});
      if(result){
        this.show = false;
        console.log(result);
      }
    },
    async startWork(){
      let actions = [{
        account: this.$configFile.get('wpcontract'),
        name: "startwork",
        // authorization: [ {actor: this.getAccountName, permission: 'active'}],
        data: {
          proposal_id: Number(this.wp.key),
        }
      }];

      let result = await this.$store.dispatch('user/transact', {actions: actions});
      if(result){
        console.log(result);
      }
    },
    async completeWork(){
      let actions = [{
        account: this.$configFile.get('wpcontract'),
        name: "completework",
        // authorization: [ {actor: this.getAccountName, permission: 'active'}],
        data: {
          proposal_id: Number(this.wp.key),
        }
      }];

      let result = await this.$store.dispatch('user/transact', {actions: actions});
      if(result){
        console.log(result);
      }
    },

    async arbApprove(){
      let actions = [{
        account: this.$configFile.get('wpcontract'),
        name: "arbapprove",
        // authorization: [ {actor: this.getAccountName, permission: 'active'}],
        data: {
          arbitrator: this.getAccountName,
          proposal_id: Number(this.wp.key),
        }
      }];

      let result = await this.$store.dispatch('user/transact', {actions: actions});
      if(result){
        console.log(result);
      }
    }


  }

}


//  wp status: pending_approval == 0, work_in_progress == 1 after approved when a worker is working on the WP, and pending_claim == 2 

// enum VoteType {
//             none = 0,
//             // a vote type to indicate a custodian's approval of a worker proposal.
//            1= proposal_approve, 
//             // a vote type to indicate a custodian's denial of a worker proposal.
//             2=proposal_deny, 
//             // a vote type to indicate a custodian's acceptance of a worker proposal as completed.
//            3= claim_approve,
//             // a vote type to indicate a custodian's rejection of a worker proposal as completed.
//            4= claim_deny
//         };

</script>

<style>
</style>
