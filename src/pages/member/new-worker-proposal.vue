<template>
  <q-page class="q-pa-md">
    <!-- content -->
    
    <div class="bg-bg1 round-borders shadow-5 q-pa-md bg-logo">
      <div class="text-text1 q-title q-mb-md">Submit Worker Proposal</div>
      <div class="q-mb-md text-text2">Please fill in the form to explain your worker proposal. There need to be more text here to guide the potential worker. </div>
      <q-input type="text" stack-label="Title" color="primary-light" :dark="getIsDark" v-model="wp_data.title" />

      <div class="row gutters-sm q-my-md">
        <div class="col-xs-12 col-lg-6">
          <!-- <asset-input v-model="wp_data.pay_amount" label="Pay Amount" :maw="100" :min="0" icon="icon-type-2" /> -->
            <q-item>
              <q-item-side left icon="icon-ui-19" class="text-text2"/>
              <q-item-main>
                <q-input type="number" stack-label="Pay Amount" color="primary-light" :dark="getIsDark" v-model="wp_data.pay_amount" />
              </q-item-main>
              <q-item-side left >
                <q-select stack-label="&nbsp" hide-underline v-model="wp_data.symbol" :dark="getIsDark" color="primary-light" :options="allowed_currencies.map(c => {return {label:c, value:c} })"/>
              </q-item-side>
            </q-item>
        </div>

        <div class="col-xs-12 col-lg-6">
          <div>
            <q-item>
              <q-item-side left icon="mdi-teach" class="text-text2"/>
              <q-item-main>
                <q-input type="text" stack-label="Arbitrator" color="primary-light" :dark="getIsDark" v-model="wp_data.arbitrator" />
              </q-item-main>
              <q-item-side left >
                <help-btn title="Arbitrator" content="An arbitrator is a crazy person..." />
              </q-item-side>
            </q-item>
            
          </div>
        </div>
      </div>

      <q-input class="bg-bg2 q-pa-md" type="textarea" :rows="10" stack-label="Description" color="primary-light" :dark="getIsDark" v-model="wp_data.summary" />
      <div class="row justify-end q-mt-md">
        <q-btn label="submit" color="primary" @click="submitProposal" class="animate-pop" />
      </div>
    </div>
    <pre>{{wp_data}}</pre>
  </q-page>
</template>

<script>
import {mapGetters} from 'vuex';
import assetInput from 'components/controls/asset-input';
import helpBtn from 'components/controls/help-btn';
export default {
  name: 'newWorkerProposal',
  components:{
    assetInput,
    helpBtn
  },
  data() {
    return {
      allowed_currencies: ['EOS', 'EOSDAC'],
      wp_data:{
        title: '',
        summary: '',
        arbitrator: '',
        pay_amount: '',
        symbol: 'EOS'
      }
    }
  },
    computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getIsDark: 'ui/getIsDark',
      getSettingByName: 'user/getSettingByName'

    })
  },
  methods:{
    async submitProposal(){
      let actions = [{
          account: this.$configFile.get('wpcontract'),
          name: "createprop",
          data: {
            proposer: this.getAccountName,
            title: this.wp_data.title,
            summary: this.wp_data.summary,
            arbitrator: this.wp_data.arbitrator,
            pay_amount: `${Number(this.wp_data.pay_amount).toFixed(4)} ${this.wp_data.symbol}`,
            content_hash: "00000000000000000000000000000000"
          }
        }];
      let result = await this.$store.dispatch('user/transact', {actions: actions} );
      if(result){
        // this.$store.commit('user/setIsCandidate', false );
        console.log(result);
      }
    }

  }
}

</script>

<style>
</style>
