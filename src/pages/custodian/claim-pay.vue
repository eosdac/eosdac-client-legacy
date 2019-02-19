<template>
  <q-page class="q-pa-md">
    <div class="q-display-1 text-white q-mb-md">Claim Payments</div>
    <div class="row">
      <div class="bg-dark2 round-borders shadow-5 col-xs-12 col-md-6">
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
        </div>
        <div v-else>
          You do not have any pending payments.
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>



import {
  mapGetters
} from 'vuex'
export default {
  name: 'claimpay',
  components: {


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
      })

  },
  methods:{
    claimpay(id){
        let actions = [
        {
          contract: this.$configFile.network.custodianContract.name, 
          action: 'claimpay',
          fields: {
            payid: id, 
          }
        }

      ];
      this.$refs.Transaction.newTransaction(actions, false, false);   
    },
    async getClaimPay(){
      this.loading = true;
      this.pendingpay =  await this.$store.dispatch('api/getClaimPay');
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
