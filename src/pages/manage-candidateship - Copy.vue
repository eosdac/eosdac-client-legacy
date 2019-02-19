<template>
<q-page class="text-white ">

  <div class=" gradient-bg-primary q-px-md q-pt-md relative-position" style="min-height:260px; overflow:hidden">
    <div class="row">
      <div class="col-12">
        <h4 v-if="!getMemberRoles.candidate" class="q-display-1 q-mb-sm q-mt-none">{{ $t("regcandidate.register_as_candidate") }}</h4>
        <h4 v-if="getMemberRoles.candidate" class="q-display-1 q-mb-sm q-mt-none">{{ $t("regcandidate.unregister_as_candidate") }}</h4>
      </div>
    </div>

    <div class="blur-details q-pa-md absolute-bottom" style="height:120px;margin-right:-16px;margin-left:-16px;">

      <div v-if="iscandidatedata" class="row  items-center q-px-md full-height">
        <div class="q-mr-lg">
          <div class="text-dimwhite q-caption uppercase q-mb-sm">{{$t('regcandidate.locked_tokens')}}</div>
          <div class="q-title"><span class="text-dimwhite">{{iscandidatedata.locked_tokens.split(' ')[0]}}</span><span> {{iscandidatedata.locked_tokens.split(' ')[1]}}</span></div>
        </div>
        <div >
          <div class="text-dimwhite q-caption uppercase q-mb-sm">{{$t('regcandidate.requested_pay')}}</div>
          <div class="q-title" ><span class="text-dimwhite">{{iscandidatedata.requestedpay.split(' ')[0]}}</span><span> {{iscandidatedata.requestedpay.split(' ')[1]}}</span></div>
        </div>
      </div>

    </div>
  </div>

<div class="q-pa-md">

  <div v-if="!profile_is_irrevirsible" class="bg-dark2 q-pa-md round-corners shadow-5">
    {{ $t("regcandidate.profile_required") }}
    <span v-if="hasprofile">{{ $t("regcandidate.profile_not_confirmed") }}</span>
  </div>

  <div v-if="profile_is_irrevirsible" class="row q-mt-md gutters-md bg-dark2 round-corners shadow-5" style="min-height:265px">

        <div class="col-md-8 col-sm-12 q-pa-md text-dimwhite">
          <div v-if="!getMemberRoles.candidate" >{{$t('regcandidate.page_description_unregistered') }}</div>
          <div v-if="getMemberRoles.candidate" >
            <span>{{$t('regcandidate.page_description_registered') }}</span>
          </div>

          <div v-if="getMemberRoles.custodian">{{ $t('regcandidate.page_description_active_custodian') }}</div>
          <!-- <pre>{{iscandidatedata}}</pre>
          <pre>{{stakeRequirementMet}}</pre> -->
        </div>

        <div class="col-md-4 col-sm-12 q-pa-md">
          <div class="text-dimwhite" v-if="!getMemberRoles.candidate">

            <div class="q-mb-lg " v-if="!stakeRequirementMet">
              <p>{{$t('regcandidate.stake_description', {minimum_stake: minStakeAmount}) }}</p>
              <q-input  color="p-light" dark type="number" v-model="stakeamount" :float-label="$t('regcandidate.stake_amount')" :placeholder="$t('regcandidate.amount_to_stake_placeholder')" />
              <!-- <pre>{{stakeRequirementMet}}</pre> -->
            </div>
            <!-- <q-input dark  type="hidden" v-model="registerdata.bio"  float-label="Profile JSON url" placeholder="http://example.com/myjsonprofile.json" /> -->
            <div >
              <p >{{$t('regcandidate.pay_description', {requested_pay: requested_pay_max}) }}</p>
              <q-input v-if ="requested_pay_max" class="q-my-md" color="p-light" dark type="number" :max="requested_pay_max.split(' ')[0]" v-model="requestedpay" :float-label="$t('regcandidate.requested_pay')" :placeholder="$t('regcandidate.requested_custodian_pay_placeholder')" />
              <q-btn size="md"  class="animate-pop" :loading="loading" color="primary" @blur.native="userMsg=''" @click="registerAsCandidate" :label="$t('regcandidate.register')">
                <q-spinner slot="loading" />
              </q-btn>

            </div>
          </div>

          <q-btn size="md" v-if="getMemberRoles.candidate" class="animate-pop" :loading="loading" color="primary" @blur.native="userMsg=''" @click="unregisterAsCandidtate" :label="$t('regcandidate.unregister')">
            <q-spinner slot="loading" />
          </q-btn>
          <div class="q-mt-md text-dimwhite animate-fade " v-if="userMsg != ''">{{userMsg}}</div>
          <!-- <pre>{{getMemberRoles}}</pre> -->
        </div>
  </div>
  <div class="q-pa-md q-mt-md bg-dark2 round-corners shadow-5" v-if="!getMemberRoles.candidate && (stakeRequirementMet>0)">
    <div>{{$t('regcandidate.unstake_description')}} {{lockup_release_time_delay_days}}</div>
    <div style="height:30px"><q-btn size="md"  class="animate-pop on-right float-right"  color="primary"  @click="unstake" :label="$t('regcandidate.unstake')" /></div>
    
  </div>

</div>


</q-page>
</template>



<script>



import {
  mapGetters
} from 'vuex'
export default {
  name: 'RegisterCandidate',
  components: {

  },
  data (){
    return{
      loading: false,
      init_loading: false,
      hasprofile : false,
      profile_is_irrevirsible: false,
      iscandidatedata : false,
      stakeamount: 0,
      requested_pay_max : false,
      requestedpay : 0,
      lockup_release_time_delay_days : 0,
      minStakeAmount:'',
      contract_config: {},
      userMsg: ''

    }
  },
  created() {
    this.init()
    // this.checkMemberRoles();
    // this.getProfileData();
    // this.getContractConfig();
  },

  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getRegistered: 'account/getRegistered',
      getMemberRoles: 'account/getMemberRoles'
    }),

    stakeRequirementMet(){
      if(this.iscandidatedata){
        let stake = this.iscandidatedata.locked_tokens.split(" ")[0];
        let required_stake = this.minStakeAmount.split(" ")[0];
        // console.log(stake, required_stake)
        if(stake ==''){
          return false;
        }
        else if(parseInt(stake) >= parseInt(required_stake) ){
          return stake;
        }
        else{
          return false;
        }
      }

    },
    formatcanddata(){
      let data = {
        staked:{
          value: 0.0000,
          symbol : this.$configFile.network.tokenContract.token
        },
        reqpay:{
          value: 0.0000,
          symbol : this.$configFile.network.mainCurrencyContract.token
        }
      };
      if(this.iscandidatedata){
        data.staked.value = iscandidatedata.locked_tokens.split(' ')[0];
        data.reqpay.value = iscandidatedata.requestedpay.split(' ')[0];
      }
      return data;

    }
  },
  methods:{
    registerAsCandidate(){
        if(this.requestedpay == '' || this.requestedpay ==undefined){
          this.userMsg = this.$t('regcandidate.msg_reqpay_error');
          this.requestedpay = 0;
          return false;
        }
        let requestedpay = this.requestedpay.toFixed(4)+ ' EOS';

        if(!this.stakeamount && !this.stakeRequirementMet){
          this.userMsg = this.$t('regcandidate.msg_stake_error');
          this.stakeamount = 0;
          return false;
        }
        let stake = this.stakeamount.toFixed(4)+' '+this.$configFile.network.tokenContract.token;

        let stakeTransfer = {
          contract: this.$configFile.network.tokenContract.name, 
          action: 'transfer', 
          fields: {
            from : this.getAccountName, 
            to: this.$configFile.network.custodianContract.name,
            quantity: stake,
            memo: this.$configFile.network.custodianContract.memo
            }
        }
        let nominateCand = {
          contract: this.$configFile.network.custodianContract.name, 
          action: 'nominatecand', 
          fields: {
            cand : this.getAccountName, 
            requestedpay:requestedpay,
            }
        }
        let actions=[];
        if(this.stakeRequirementMet){
          actions = [nominateCand];
        }
        else{
          actions = [stakeTransfer, nominateCand];
        }
        this.$refs.Transaction.newTransaction(actions, false);
    },

    unregisterAsCandidtate(){
        this.$refs.Transaction.newTransaction([{
          contract: this.$configFile.network.custodianContract.name,
          action: 'withdrawcand',
          fields: {
            cand: this.getAccountName
          }
        }], false)
    },
    unstake(){
        this.$refs.Transaction.newTransaction([{
          contract: this.$configFile.network.custodianContract.name,
          action: 'unstake',
          fields: {
            cand: this.getAccountName
          }
        }], false)

    },

    async init(){
      try {
         this.init_loading = true;
        //get contract config
        let config = await this.$store.dispatch('api/getContractConfig', {contract: this.$configFile.network.custodianContract.name});
        //check profile
        let p = await this.$profiles.getProfiles([this.getAccountName]);
        // console.log(p)
        if(p && p.length){
          this.hasprofile = true;
          // this.profile_is_irrevirsible = p[0].irrevirsible;
          this.profile_is_irrevirsible = true;
        }
        else{
          this.profile_is_irrevirsible = false;
        }
        // console.log(config)
        if(config){
          this.minStakeAmount = config.lockupasset;
          this.lockup_release_time_delay_days = config.lockup_release_time_delay/60/60/24;
          // this.stakeamount = config.lockupasset;
          this.requested_pay_max = config.requested_pay_max;
        }
        //check memberrole
        this.iscandidatedata = await this.$store.dispatch('api/getIsCandidate');
        // console.log(iscandidate);
         this.init_loading = false;
      } catch (err) {
         this.init_loading = false;
        throw err
      }
    },

  }
}
</script>

<style lang="stylus">

</style>
