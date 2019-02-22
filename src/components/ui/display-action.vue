<template>
<div>
<transition appear enter-active-class="animated flipInX" leave-active-class="animated flipOutX">
  <div appear class="bg-bg1 q-pa-sm round-borders q-ma-xs">
    <q-btn v-if="viewable" size="sm" dense  class="q-mr-xs text-text1" icon="pageview" flat title="view action data" >
      <q-popover class="bg-bg1">
        <q-list>
          <q-item v-close-overlay v-for="(value, key) in action.data">
            <q-item-main>
              <q-item-tile label>{{key}}</q-item-tile>
              <q-item-tile sublabel>{{value }}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </q-popover>
    </q-btn>
    <span class="text-text2">{{action.account}}</span>
    <div style="display:inline-block " class="fa-arrow-right text-text1">></div>
    <span class="text-text2">{{action.name}}</span>
    <q-btn v-if="closable" size="sm" dense  class="q-ml-xs text-negative" icon="close" flat @click="$emit('close')" title="delete action" />

  </div>
</transition>
</div>
</template>

<script>
export default {
  name: 'displayAction',
  props:{
    action: Object,
    closable: Boolean,
    viewable: Boolean
  },
  data () {
    return {}
  }
}
</script>

<style lang ="stylus">
@import '~variables'


</style>
