<template>
  <div>
    <q-btn v-if="!firehose_active" @click="start" label="start firehose" color="primary" />
    <q-btn v-else @click="stop" label="stop firehose" color="primary" />
  </div>
</template>

<script>
var FIREHOSE=null;
import {FirehoseClient} from '../../modules/firehose-client.js';
import { Notify } from 'quasar';

export default {
  name: 'firehose',
  data () {
    return {
      firehose_active: false

    }
  },
  methods:{
    stop(){
      FIREHOSE.close();
      FIREHOSE = null;
      this.firehose_active = false;
    },
    async start(){
      if(FIREHOSE !== null){
        console.log('firehose already started');
        return;
      }
      console.log('starting firehose...');
      const api = await this.$store.dispatch('global/getEosApi');
      
      FIREHOSE = new FirehoseClient({server: 'ws://ex2.eosdac.io:1337', eosEndpoint: 'http://eu.eosdac.io'}, api.eosapi );

      FIREHOSE.ready((firehose) => {
          this.firehose_active = true;
          firehose
              .request('action_trace', {code:'daccustodian', name:'votecust'})
      })
      .callback((type, data) => {
          console.log('type', type)
          console.log('data', data)
          if(type =='action_trace' && data.name =='votecust'){
            Notify.create({
                message: `${data.data.voter} has casted new votes`,
                timeout: 0, // in milliseconds; 0 means no timeout
                color: 'primary',
                icon: 'icon-dac-balance',
                detail: data.data.newvotes.join(', '),
                position: 'bottom-left', // 'top', 'left', 'bottom-left' etc.
                closeBtn: true, // or string as button message e.g. 'dismiss'
            });
          }
      })

    }
  }, 
  mounted(){
    

  }
}
</script>

<style>
</style>
