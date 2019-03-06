<template>
<q-page class="text-text2 q-pa-md">

  <div class="row relative-position justify-start q-mb-md">
    <h4 class="q-display-1 q-my-none">Review Proposals</h4>
  </div>

  <q-tabs class="q-mb-md" @select="setActiveTab">
    <!-- Tabs - notice slot="title" -->
    <q-tab default slot="title" name="open" label="open" />
    <q-tab slot="title" name="executed" label="executed"  />
    <q-tab slot="title" name="cancelled" label="cancelled/expired"  />
  </q-tabs>

  <div class="row bg-bg1 q-pa-md q-mb-md shadow-5 round-borders justify-between" v-if="true" >
    <q-search :dark="getIsDark" color="primary" v-model="filter" :placeholder="$t('vote_custodians.search')" />
    <div class="row inline items-center q-mt-sm" style="font-size:12px;">
      <span>{{ $t('vote_custodians.rows_per_page') }}:</span>
        <q-select
          class="q-ml-sm"
          style="width:45px;"
          hide-underline
          v-model="pagination.items_per_page"
          :dark="getIsDark"
          :options="[{label:'1', value:1},{label:'4', value:4}, {label:'8', value:8}, {label:'16', value:16}, {label:'24', value:24}, {label:'48', value:48}]"
        />
        <q-pagination color="primary-light" v-show="true" v-model="pagination.page" :min="1" :max="pagination.max" :max-pages="6" direction-links size="12px" />
    </div>
  </div>

  <div style="min-height:200px">
    <Msigproposal v-for="(msig, index) in proposals" :read_only="false" :key="index" :msig="msig" />
  </div>
</q-page>
</template>

<script>

import Msigproposal from 'components/ui/msig-proposal';

import {mapGetters} from 'vuex';

export default {
  name: 'ReviewMsigs',
  components: {
      
      Msigproposal
  },

  data() {
    return {
      systemmsig: 'eosio.msig',
      proposals: [],
      createmsig_modal: false,
      active_tab : '',
      pagination :{
        page:1,
        max:1,
        items_per_page: 8
      },
      filter: '',
    }
  },

  computed: {
    ...mapGetters({
      getactiveCustodians: 'api/getActiveCustodians',
      getAccountName: 'account/getAccountName',
      getIsDark: 'ui/getIsDark'
    })

  },

  created(){
    this.$root.$on("reloadproposals", this.getProposalsWithDelay);
  },

  methods:{
    setActiveTab(tab){
      //setting the active tab will trigger a watcher
      this.active_tab = tab;
    },

    managePagination(){
      //map tab to number for making the request 
      const map = {open:1, executed:2, cancelled:0};
      //calculate skip
      let skip = (this.pagination.page-1) * this.pagination.items_per_page;
      //make request
      let find = {
        status: map[this.active_tab]
      }
      if(find.status === 1){
        find["trx.expiration"] = { $gt: new Date()};
      }
      if(find.status === 0){
        find =  {$or: [ { status: 0 }, { "trx.expiration": { $lt: new Date() }  } ] }  
      }
      this.getProposals({find: find, skip: skip, limit: this.pagination.items_per_page});
    },

    async getProposals(query){
      //todo: loading animation
      this.proposals = [];
      let p =  await this.$store.dispatch('dac/fetchMsigProposals', query );
      this.pagination.max = Math.ceil(p.total/this.pagination.items_per_page);
      this.proposals = p.data;
    },

    getProposalsWithDelay(){
      console.log('executed getproposalswithdelay')
      // setTimeout(this.getProposals, 6000)
    }


  },
  
  watch:{

      active_tab: function(newVal, oldVal){
        if(newVal !== oldVal){ //double check the tab has been changed

          if(this.pagination.page == 1){
            this.managePagination();
          }
          else{
            this.pagination.page = 1; //this will trigger the watcher below
          };

        }
      },

      'pagination.items_per_page': function (newVal, oldVal){
          this.managePagination();
      },

      'pagination.page': function(newVal, oldVal){
          this.managePagination();
      }
  }


}
</script>

<style>
.msigproposal_header{
  height:80px
}
</style>
