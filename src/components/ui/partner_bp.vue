<template>
  <div v-if="partners.length">
    <a v-for="(p, i) in partners"  class="on-left" :key ="i" :href="p.url" target="_blank" style=" display:inline-block">
      <div class="row items-center">
      <img :style="style" :src="p.logo" />
      <span>{{p.name}}</span>
      </div>

    </a>


  </div>

</template>

<script>

import partnerbps from '../../statics/credits.json'
export default {
  name: 'partnerbp',
  props: {
    size: String,
  },
  data() {
    return {
      partners : partnerbps.bps
    }
  },
  computed:{
      style () {
        return 'width: ' + this.size +'; margin-right:4px';
      }
  },

  methods:{

  },
  mounted(){

  }

}
</script>

<style>

</style>
