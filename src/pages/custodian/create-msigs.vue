<template>
  <q-page class="q-pa-md">
    <msig-creator />
  </q-page>
</template>

<script>
import msigCreator from 'components/controls/msig-creator';
import {mapGetters} from 'vuex';
export default {
  name: 'CreateMsigs',
  components:{
    msigCreator
  }
}
</script>

<style>
</style>
