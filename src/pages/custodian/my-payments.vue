<template>
  <q-page class="q-pa-md">
    <div class="q-display-1 text-text1 q-mb-md">Pending Payments <span class="text-text2" v-if="pendingpay.length">({{pendingpay.length}})</span></div>
    <div class="row">
      <div class="bg-bg1 round-borders shadow-5 col-xs-12 col-md-6">

        <div v-if="pendingpay.length">

          <q-item v-for="(pay, i) in pendingpay" :key="`pay_id_${i}`">
            <q-item-side left>{{pay.key}}</q-item-side>
            <q-item-main>
              <q-item-tile label>{{pay.receiver}}</q-item-tile>
              <q-item-tile sublabel>{{pay.quantity }}</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-btn label="claim" color="primary" @click="claimpay(pay.key)"/>
            </q-item-side>
          </q-item>

          <q-item v-if="pendingpay.length > 1">
            <q-item-main>
              <q-item-tile label>Total</q-item-tile>
              <q-item-tile sublabel>{{ totalPayAmount }}</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-btn color="positive" label="claim all" @click="claimAll" />
            </q-item-side>
          </q-item>

          
        </div>
        <div v-else>
          You do not have any pending payments.
        </div>
      </div>

      <div class="q-display-1 text-text1 q-my-md">Update Requested Pay <span class="text-text2">({{getIsCandidate.requestedpay}})</span></div>
      <div class="text-text1 round-borders bg-bg1 q-pa-md">
          <span >{{$t('regcandidate.pay_description', {requested_pay: $helper.assetToLocaleNumber(getCustodianConfig.requested_pay_max) }) }}</span>
          <q-item class="q-pl-none">
            <q-item-side left icon="icon-type-2"  v-bind:class="{'text-positive':verifyAndGetRequestedPay, 'text-text2': !verifyAndGetRequestedPay}"/>
            <q-item-main>
              <q-input  color="primary-light" :dark="getIsDark" type="number" :max="20" v-model="new_requested_pay" :stack-label="$t('regcandidate.requestedpay')" :placeholder="$t('regcandidate.requested_custodian_pay_placeholder')" />
            </q-item-main>
          </q-item>
          <div class="row justify-end">
            <q-btn label="update" @click="updateRequestedPay" color="primary" />
          </div>
      </div>



    </div>
  <debug-data :data="[{'pendingpay': pendingpay}]" />
  </q-page>
</template>

<script>
import {mapGetters} from 'vuex';
import debugData from 'components/ui/debug-data';

export default {
  name: 'claimpay',
  components: {
    debugData
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      pendingpay : [],
      new_requested_pay: ''

    }
  },
  computed: {
    ...mapGetters({
      getCustodianConfig: 'dac/getCustodianConfig',
      getAccountName: 'user/getAccountName',
      getIsDark: 'ui/getIsDark',
      getIsCandidate: 'user/getIsCandidate',
    }),

    totalPayAmount(){
      if(!this.pendingpay.length) return 0;

      let total = this.pendingpay.reduce((total, p) =>{
        return total + this.$helper.assetToNumber(p.quantity)
      }, 0);

      return this.$helper.toLocaleNumber(total)+ ' EOS';
    },
    verifyAndGetRequestedPay(){
      if(this.new_requested_pay && (this.new_requested_pay <= this.$helper.assetToNumber(this.getCustodianConfig.requested_pay_max) ) ){
        return this.$helper.numberToAsset(this.new_requested_pay.toFixed(4), this.$configFile.get('systemtokensymbol') );
      }
      else{
        console.log('requested pay out of range');
        return false;

      }
    },

  },
  methods:{
    async claimpay(id){
      let actions = [
        {
          account: this.$configFile.get('custodiancontract'), 
          name: 'claimpay',
          data: {
            payid: id, 
          }
        }
      ];
      let result = await this.$store.dispatch('user/transact', {actions: actions} );
      if(result){
        
      }
        
    },

    async claimAll(){
      const contract = this.$configFile.get('custodiancontract');
      let actions = this.pendingpay.map(pp=>{
        return {
          account: contract, 
          name: 'claimpay',
          data: {
            payid: pp.key, 
          }
        };
      });
      let result = await this.$store.dispatch('user/transact', {actions: actions} );
      if(result){
        
      }
    },

    async updateRequestedPay(){
      if(!this.verifyAndGetRequestedPay){
        alert('new requested pay not set');
        return;
      }
      let actions = [
        {
          account: this.$configFile.get('custodiancontract'), 
          name: 'updatereqpay',
          data: {
            cand: this.getAccountName,
            requestedpay: this.verifyAndGetRequestedPay
          }
        }
      ];
      console.log(actions)
      let result = await this.$store.dispatch('user/transact', {actions: actions} );
      if(result){
        this.$store.dispatch('user/fetchIsCandidate');
      }
    },

    async getClaimPay(){
      this.loading = true;
      this.pendingpay =  await this.$store.dispatch('user/fetchPendingPay');
      this.loading = false;
    }

  },
  mounted(){
    this.getClaimPay();
  }

}
</script>

<style>
</style>
