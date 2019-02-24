<template>
  <q-page class="q-pa-md">
    <div v-if="getAccountName" class="row gutter-sm">
      <!-- box profile -->
      <div class="col-xs-12 col-md-6 col-xl-4">
        <div class="bg-bg1 round-borders shadow-5 q-pa-md bg-logo dashboard-box" >
          <q-item  class="no-padding">
            <q-item-side left >
              <div class="q-pa-md"><profile-pic  :accountname="getAccountName" :scale="1.5" /></div>
            </q-item-side>
            <q-item-main>
              <q-item-tile label class="q-headline capitalize">{{getAccountName}}</q-item-tile>
              <q-item-tile sublabel >info</q-item-tile>
            </q-item-main>
          </q-item>

          <q-item class="no-padding q-mt-lg">
            <q-item-main>
              <q-item-tile label >
                <div class="row justify-start items-center">
                  <span class="q-headline text-text1 q-mr-sm">My Votes</span>
                  <q-btn v-if="getDacVotes" class="animate-pop" dense size="sm" color="bg2" to="/vote-custodians" label="change votes" />
                </div>
              </q-item-tile>
              <q-item-tile>
                <div class="row">
                  <div v-for="(vote, i) in getDacVotes" class="column" :key="`${i}v`">
                    <profile-pic class="animate-pop" :accountname="vote" :scale="0.7"/>
                  </div>
                </div>
              </q-item-tile>
            </q-item-main>
          </q-item>
        </div>
      </div><!-- box profile -->

      <div class="col-xs-12 col-md-6 col-xl-4" >
        <div class="bg-bg1 round-borders shadow-5 q-pa-md bg-logo dashboard-box">
          <q-item  class="no-padding" style="margin-left:-10px;margin-top:-10px">
            <q-item-side left >
              <div class=""><q-icon name="star" color="warning" size="70px" /></div>
            </q-item-side>
            <q-item-main>
              <q-item-tile label class="q-headline">Custodian</q-item-tile>
              <q-item-tile sublabel >info</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item class="no-padding q-mt-sm">
            <q-item-main>
              <q-item-tile label class="q-headline">Tools</q-item-tile>
              <q-item-tile>
                <div class="row">
                  <q-btn class="animate-pop q-ma-xs" color="bg2" to="/custodian/review-msigs" label="View Msigs" />
                  <q-btn class="animate-pop q-ma-xs" color="bg2" to="/custodian/create-msigs" label="Propose Msigs" />
                  <q-btn class="animate-pop q-ma-xs" color="bg2" icon="icon-social-discord-com" @click="openURL('https://discord.gg/8ARMTmG')" label="Discord" />
                  <q-btn disabled class="animate-pop q-ma-xs" color="bg2"  to="/custodian/create-msigs" label="Review Proposals" />
                </div>
              </q-item-tile>
            </q-item-main>
          </q-item>
        </div>
      </div>

      <div class="col-xs-12 col-md-6 col-xl-4">
        <div class="bg-bg1 round-borders shadow-5 q-pa-md">3</div>
      </div>

    </div>
    <div class="bg-bg1 shadow-5 round-borders q-pa-md q-mt-md">
      <div class="q-headline">Custodian Board</div>
      <display-custodians />
    </div>
  </q-page>
</template>

<script>
import {mapGetters} from 'vuex';
import profilePic from 'components/ui/profile-pic';
import displayCustodians from 'components/ui/display-custodians';
import { openURL } from 'quasar';
export default {
  name: 'Grid',
  components:{
    profilePic,
    displayCustodians
  },
  computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getDacVotes: 'user/getDacVotes'
    }),
  },
  data () {
    return {

    }
  },
  methods:{
    openURL
  },
  mounted(){

  }
}
</script>

<style>
.dashboard-box{
  min-height:250px;
  overflow:hidden;
}
</style>

