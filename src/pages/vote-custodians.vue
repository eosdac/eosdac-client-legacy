<template>
<q-page class="text-text1">
<!-- <Transaction ref="Transaction" v-on:done="getMemberVotes(); $refs.votebar.initProgressbar(); sortCandidatesByVotes()" /> -->

  <div class=" gradient-bg-primary q-px-md q-pt-md relative-position" style="min-height:260px; overflow:hidden">
    <div class="row">
      <div class="col-12">
        <!-- <q-btn v-if="!getMemberRoles.candidate && getAccountName" class="float-right" color="dark" to="/managecandidateship" :label="$t('vote_custodians.candidate_registration')" /> -->
        <h4 class="q-display-1 q-mb-sm q-mt-none">{{ $t("default.custodians") }}</h4>
      </div>
    </div>

    <div class="blur-details q-pa-md absolute-bottom" style="height:120px;margin-right:-16px;margin-left:-16px;">
      <div class="column  justify-center q-px-md full-height">
        <!-- <VotingProgress height="30px" ref="votebar"/> -->
      </div>
    </div>
  </div>

<div class="q-pa-md"> <!-- padding wrapper -->


<!-- <custodians-display /> -->


<div class="row gutter-md reverse-wrap">

  <!-- first column  -->
  <div class="col-xs-12 col-xl-8" >
     <!-- <pre>{{getSelectedCand}}</pre> -->
    <div >
      <div class="q-display-1 q-mb-md ">{{ $t('vote_custodians.candidate_list') }} <span class="text-text2">- {{custodians.length}}</span></div>
      <p class="text-text2 q-body-1">{{ $t('vote_custodians.description_main') }}</p>

      <div v-if="!loading" class="row bg-bg1 q-pa-md q-mb-md shadow-5 round-borders justify-between animate-fade"  >
        <q-search dark color="primary-light"  v-model="filter" :placeholder="$t('vote_custodians.search')" />
        <div v-if="!loading" class="row inline items-center q-mt-md" style="font-size:12px;">
          <span>{{ $t('vote_custodians.rows_per_page') }}:</span>
           <q-select
              class="q-ml-md"
              style="width:45px;"
              hide-underline
              v-model="pagination.items_per_page"
              dark
             :options="[{label:'4', value:4}, {label:'8', value:8}, {label:'16', value:16}, {label:'24', value:24}, {label:'48', value:48}]"
            />
            <q-pagination  v-show="true" v-model="pagination.page" :min="1" :max="pagination.max" :max-pages="6" direction-links size="12px" />
        </div>
      </div>

      <Candidate
        v-for="candidate in paginate"
        :key="candidate.candidate_name"
        :data="candidate"

        @clickvotefor="addToVoteList(candidate.candidate_name)"
        @clickunvotefor="deleteFromVoteList(candidate.candidate_name)"
      />

      <div v-if="!loading" class="row bg-bg1 q-pa-md q-mb-md shadow-5 round-borders justify-between animate-fade"  >
        <q-search dark color="primary-light"  v-model="filter" :placeholder="$t('vote_custodians.search')" />
        <div  class="row inline items-center q-mt-md " style="font-size:12px;">
          <span>{{ $t('vote_custodians.rows_per_page') }}:</span>
           <q-select
              class="q-ml-md"
              style="width:45px;"
              hide-underline
              v-model="pagination.items_per_page"
              dark
             :options="[{label:'4', value:4}, {label:'8', value:8}, {label:'16', value:16}, {label:'24', value:24}, {label:'48', value:48}]"
            />
            <q-pagination  v-show="true" v-model="pagination.page" :min="1" :max="pagination.max" :max-pages="6" direction-links size="12px" />
        </div>
      </div>
      
    </div>
  </div>
  <!-- second column -->
  <div class="col-xs-12 col-xl-4" >
    <div>
      <div class="q-display-1 q-mb-md">{{ $t('vote_custodians.my_votes') }} <span class="text-text2">- {{getSelectedCand.length}}/{{maxvotes}}</span></div>
      <p class="text-text2 q-body-1">{{ $t('vote_custodians.description_side') }}</p>

      <q-card id="votebox" class="q-pa-lg q-mt-md bg-bg1 bg-logo">
        <q-btn style="font-weight: 300;" v-bind:class="{'pulse': votesdidchange}" class="full-width items-baseline" color="primary" size="xl" @click="voteForCandidates();">
          <div style="width:55px;display:inlineblock">
            <q-icon size="40px" class="float-left" name="icon-ui-3"></q-icon>
          </div>
          <div style="display:inline-block" >
            <span v-if="votesdidchange">{{ $t('vote_custodians.submit_my_votes') }}</span>
            <span v-if="!votesdidchange">{{ $t('vote_custodians.my_votes') }}</span>
          </div>
        </q-btn>
        <q-list class="q-mt-md">
          <transition-group name="list" tag="p">
            <q-item class="bg-bg2" style="height:66px;margin-bottom:1px;" v-for="(cand, i) in getSelectedCand" :key="i">
              <q-item-side>
                <q-item-tile style="height:36px;width:36px;" class="q-mr-sm">
                  <div v-if="cand.profile && $helper.isUrl(cand.profile.image)" class="profile_image animate-fade" style="width: 36px; height:36px" v-bind:style="{ 'background-image': 'url(' + cand.profile.image + ')' }"></div>
                  <div v-else class="profile_image" style="width: 36px; height:36px" v-bind:style="{ 'background-image': `url(${$profiles.default_avatar})` }"></div>
                </q-item-tile>
              </q-item-side>
              <q-item-main>
                <router-link class="q-headline a2" :to="{path: '/profile/' + cand.candidate_name}" >
                  <div class="q-ma-none" style="min-width:100px; overflow:hidden">{{cand.candidate_name}}</div>
                </router-link>
              </q-item-main>
              <q-item-side right>
                <q-btn dense round color="primary" icon="close" @click="deleteFromVoteList(cand.candidate_name)" />
              </q-item-side>
            </q-item>
          </transition-group>
        </q-list>
        <!-- <pre>{{getSelectedCand}}</pre> -->
        <!-- <pre>{{getTokenBalance}}</pre> -->
        <!-- <pre>{{votesdidchange}}</pre> -->
      </q-card>
    </div>
  </div>
</div><!-- end row -->

<q-scroll-observable @scroll="userHasScrolled" />

  <q-modal v-model="voting_disabled_modal"  minimized  :content-css="{width: '50%'}" >
    <div  class="bg-dark round-borders q-pa-md">
      <div style="overflow: auto;">
        <q-btn round color="primary" class="float-right" @click="voting_disabled_modal=false" icon="close" />
      </div>

      <div class="q-mb-xl q-mt-md">
        <div class="q-pb-md q-mb-md" style="border-bottom:1px solid grey">{{$t('vote_custodians.voting_disabled_title')}}</div>
        <p class="text-text2">{{$t('vote_custodians.voting_disabled_text')}}</p>
      </div>
    </div>
  </q-modal>



</div><!-- end wrapper -->

<debug-data :data="[{'getDacVotes': getDacVotes}]" />
</q-page>
</template>

<script>

import Candidate from 'components/ui/candidate';
import VotingProgress from 'components/ui/voting-progress';
import debugData from 'components/ui/debug-data';
import { Notify } from 'quasar';

import {mapGetters} from 'vuex'

export default {
  name: 'Votecustodians',
  components: {
    Candidate,
    VotingProgress,
    debugData
  },
  data() {
    return {
      voting_disabled_modal: false,//!this.$configFile.network.custodianContract.enable_voting,
      loading: false,
      voting_progress: 14,
      custodians: [],
      contractstate: [],
      pagination :{
        page:1,
        max:1,
        items_per_page: 24
      },
      filter : '',
      maxvotes : 5,
      oldvotes : [],
      votesdidchange : false
    }
  },

  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getTokenBalance: 'user/getDacBalance',
      getCandidates: 'dac/getCandidates',
      getDacVotes: 'user/getDacVotes'
      // getMemberRoles: 'account/getMemberRoles'
    }),

    getSelectedCand(){
      return this.custodians.filter(x => x.selected == true);
    },

    paginate(){
      let filtered;

      if(this.filter != ''){
        filtered = this.custodians.filter(cand => {
            return cand.candidate_name.indexOf(this.filter) !== -1;
        });
      }
      else{
        filtered = this.custodians;
      }
      this.pagination.max = Math.ceil(filtered.length/this.pagination.items_per_page);

      filtered = filtered.slice((this.pagination.page-1) * this.pagination.items_per_page, this.pagination.page * this.pagination.items_per_page);

      // let candidates_on_page = filtered.map(c => c.candidate_name);
      // this.addProfiles(filtered, candidates_on_page);

      return filtered;
    }

  },


  mounted() {

    this.getAllCandidates();
  },

  methods: {
    async getAllCandidates(){
      
      if(this.getCandidates){
        this.custodians = this.getCandidates;
      }
      else{
        this.loading = true;
        this.custodians = await this.$store.dispatch('dac/fetchActiveCandidates');
        this.loading = false;
      }
      
      await this.getMemberVotes();

    },



    addToVoteList(name, init=false){
      let selected = this.custodians.filter(x => x.selected == true);
      if(selected.length < 5){//todo get this var out of contract config
        let cand = this.custodians.find(x => x.candidate_name === name);
        if(cand){
          cand.selected = true;
          if(!init){
            cand.total_votes = (cand.total_votes*1)+(this.getTokenBalance*10000);
          }
        }
        this.checkVotesChanged();
      }
      else{
        if(!init){
          console.log('reached max number of votes.');
          Notify.create({
            message: `Reached maximum number of votes`,
            timeout: 2000,
            type: 'negative',
            position: 'bottom-right'
          });
        }


      }
    },

    deleteFromVoteList(name){
      let cand = this.custodians.find(x => x.candidate_name === name);
      cand.selected =false;
      cand.total_votes = (cand.total_votes*1)-(this.getTokenBalance*10000);
      this.checkVotesChanged();
    },

    //cast votes
    async voteForCandidates() {

      if(!this.$configFile.configFile.contracts.custodian.enable_voting){
        this.votesdidchange = false;
        this.voting_disabled_modal = true;
        return false;
      }
      if(!this.votesdidchange){
        return false;
      }

      let votes = this.custodians.filter(x => x.selected == true).map(c => c.candidate_name);

      let actions = [{
          account: this.$configFile.get('custodiancontract'),
          name: 'votecust',
          data: {
            voter: this.getAccountName,
            newvotes: votes
          }
      }];

      let result = await this.$store.dispatch('user/transact', {actions: actions} );
      if(result){
        this.votesdidchange = false;
        this.sortCandidatesByVotes();
        // getMemberVotes(); 
        // $refs.votebar.initProgressbar(); 
      }

    },

    sortCandidatesByVotes(){
      this.custodians = this.custodians.sort(function(a, b) {
          let t = b.total_votes - a.total_votes;
          return t;
      });

    },

    checkVotesChanged(){
      let newvotes = this.custodians.filter(x => x.selected == true);

      if(newvotes.length != this.oldvotes.length){
        this.votesdidchange = true;
      }
      else if(newvotes.every(v => this.oldvotes.includes(v.candidate_name)) ){
        this.votesdidchange =  false;
      }
      else{
        this.votesdidchange =  true;
      }
    },

    //get current votes from member from chain
    async getMemberVotes(){
      if(!this.getAccountName){
        console.log('Guest mode, unable to retrieve votes');
        return false;
      }

      let votes = await this.$store.dispatch('user/fetchDacVotes', this.getAccountName);
      // let votes = [{candidates: ['piecesnbitss', 'evilmikehere']}];

      if(votes){
        this.votesdidchange = false;
        this.oldvotes = votes;
        this.oldvotes.forEach((vote) =>{
          this.addToVoteList(vote, true);
        })
      }
      else{
        this.oldvotes = [];
        this.votesdidchange = false;
        console.log(`${this.getAccountName} has not voted.`);
      }
    },

    userHasScrolled(scroll){
      const votebox = document.getElementById('votebox');
      if(scroll.position < 477 || window.innerWidth < 1200){
        votebox.style.top = '0px';
        return false;
      }
      // console.log(`votebox: ${offset(votebox).top} scroll: ${scroll.position}`);
      votebox.style.top = (scroll.position-375)+'px';
    }

  },
  watch:{
    getAccountName(val) {
      this.votesdidchange = false;
      this.getSelectedCand.forEach(sc=>{
        sc.selected = false;
      });
      this.getMemberVotes();
    }


  }
}
</script>

<style lang="stylus">
@import '~variables'


.list-item {
  display: inline-block;
  margin-right: 10px;
}

.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}

.list-enter, .list-leave-to{
  opacity: 0;
  transform: translateY(35px);
}

.pulse{
  background-color:$p-light !important;
  transition: background-color 1000ms linear;
  -webkit-animation: pulse 1s infinite cubic-bezier(0.66, 0, 0, 1);
  -moz-animation: pulse 1s infinite cubic-bezier(0.66, 0, 0, 1);
  -ms-animation: pulse 1s infinite cubic-bezier(0.66, 0, 0, 1);
  animation: pulse 1s infinite cubic-bezier(0.66, 0, 0, 1);
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

#votebox{
  position:relative;
  transition: all 1s ease 0s;
  top: 0;
}

</style>
