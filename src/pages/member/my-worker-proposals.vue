<template>
  <q-page class="q-pa-md">
    <q-btn label="test" @click="test"/>
  </q-page>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'myWorkerProposals',
  computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getIsDark: 'ui/getIsDark',
      getSettingByName: 'user/getSettingByName',
      getEosApi: 'global/getEosApi'

    })
  },
  data() {
    return {

    }
  },
  methods:{
    async test(){
      let wps = await this.getEosApi.getWps(this.getAccountName);
      console.log(wps)
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
