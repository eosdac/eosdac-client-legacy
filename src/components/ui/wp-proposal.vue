<template>
  <div v-if="wp.key" class="q-mb-md">
    <div>{{wp.key}}</div>
    <div>{{wp.title}}</div>
    <div>{{wp.summary}}</div>
    <div>{{wp.pay_amount}}</div>
    <div>{{getVotes}}</div>
    <div>{{wp.state}}</div>
    <div>{{getIsCreator}}</div>

    <div v-if="!read_only">
      <div v-if="wp.state==0">
        <q-btn  class="on-left"  color="positive" label="Approve" @click="voteprop('voteApprove')"  />
        <q-btn  class="on-left"  color="negative" label="Deny" @click="voteprop('voteDeny')"  />
      </div>
      <div v-if="wp.state==1">
        <q-btn  class="on-left"  color="positive" label="Approve Claim" @click="voteprop('claimApprove')"  />
        <q-btn  class="on-left"  color="negative" label="Deny Claim" @click="voteprop('claimDeny')"  />
      </div>
    </div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'wpProposal',
  props:{
    read_only: false,
    wp:{
      type: Object,
      default: ()=>{ return {} }
    }
  },
  computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getIsCustodian: 'user/getIsCustodian'
    }),
    getVotes(){
      if(this.wp.votes){
        return this.wp.votes;
      }
    },
    getIsCreator(){
      return this.getAccountName === this.wp.proposer;
    }
  },
  data () {
    return {}
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
        console.log(result);
      }

    }


  }

}


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
