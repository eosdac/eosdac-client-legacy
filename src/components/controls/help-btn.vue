<template>
  <div>
    <q-btn round flat color="info" icon="mdi-help-circle" >
      <q-popover class="bg-bg1">
        <div class="text-text1 q-pa-sm">
          <div class="q-mb-sm text-text2" v-if="title">{{title}}</div>
          <div class="q-caption">{{content}}</div>
        </div>
      </q-popover>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'helpBtn',
  props:{
    content:{
      type: String,
      default: 'No content given as property'
    },
    title:{
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  }
}
</script>

<style>
</style>
