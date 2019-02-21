<template>
<transition appear enter-active-class="animated flipInX" leave-active-class="animated flipOutX">
  <div appear class="bg-bg1 q-pa-sm round-borders q-ma-xs">
    <span class="text-text2">{{action.account}}</span>
    <div style="display:inline-block " class="fa-arrow-right text-text1">></div>
    <span class="text-text2">{{action.name}}</span>
    <q-btn v-if="closable" size="sm" dense  class="q-ml-xs text-negative" icon="close" flat @click="$emit('close')" />
  </div>
</transition>
</template>

<script>
export default {
  name: 'displayAction',
  props:{
    action: Object,
 
    closable: Boolean
  },
  data () {
    return {}
  }
}
</script>

<style>
</style>
