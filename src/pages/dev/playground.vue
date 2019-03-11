<template>
  <q-page padding>

  </q-page>
</template>

<script>
import {mapGetters} from 'vuex';


export default {
  name: 'playyard',
  components:{
    
  },
  data () {
    return {
      abi:'',
      wasm:''
    }
  },
  computed:{
    ...mapGetters({
      // getEosApi: 'global/getEosApi'
    })

  },
  methods:{


  }
}
</script>

<style>




</style>
