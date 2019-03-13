<template>
  <q-page padding>
    <abi-viewer />
  </q-page>
</template>

<script>
import {mapGetters} from 'vuex';
import abiViewer from 'components/controls/abi-viewer'

export default {
  name: 'playyard',
  components:{
    abiViewer
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
