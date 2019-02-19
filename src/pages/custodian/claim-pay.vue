<template>
  <q-page class="q-pa-md">
    <div class="q-display-1 text-text1 q-mb-md">Claim Payments</div>
    <div class="row">
      <div class="bg-bg1 round-borders shadow-5 col-xs-12 col-md-6">
        <div>total: {{totalPayAmount}}</div>
        <div>payments: {{pendingpay.length}}</div>
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
          <q-btn label="claim all" @click="claimAll" />
        </div>
        <div v-else>
          You do not have any pending payments.
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
      pendingpay : []

    }
  },
  computed: {
    ...mapGetters({
      // getactiveCustodians: 'api/getActiveCustodians',
      // getAccountName: 'account/getAccountName'
    }),

    totalPayAmount(){
      if(!this.pendingpay.length) return 0;

      let total = this.pendingpay.reduce((total, p) =>{
        return total + this.$helper.assetToNumber(p.quantity)
      }, 0);

      return this.$helper.toLocaleNumber(total)+ ' EOS';
    }

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
