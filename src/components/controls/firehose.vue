<template>
  <div>My component</div>
</template>

<script>
import {FirehoseClient} from '../../modules/firehose-client.js';
import { Notify } from 'quasar';

export default {
  name: 'firehose',
  data () {
    return {

    }
  },
  methods:{

    async start(){

      console.log('starting firehose...');
      const api = await this.$store.dispatch('global/getEosApi');
      
      const firehose = new FirehoseClient({server: 'ws://ex2.eosdac.io:1337', eosEndpoint: 'http://eu.eosdac.io'}, api.eosapi );

      firehose.ready((firehose) => {
          firehose
              .request('action_trace', {code:'daccustodian', name:'votecust'})
      })
      .callback((type, data) => {
          console.log('type', type)
          console.log('data', data)
          if(type =='action_trace' && data.name =='votecust'){
            Notify.create({
                message: `${data.data.voter} has casted new votes`,
                timeout: 7000, // in milliseconds; 0 means no timeout
                type: 'info',
                detail: data.data.newvotes.join(', '),
                position: 'bottom-left', // 'top', 'left', 'bottom-left' etc.
                closeBtn: true, // or string as button message e.g. 'dismiss'
            });
          }
      })

    }
  }, 
  mounted(){
    this.start()

  }
}
</script>

<style>
</style>
