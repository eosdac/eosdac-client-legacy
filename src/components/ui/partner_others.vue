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

import credits from '../../statics/credits.json'
export default {
  name: 'partnerothers',
  props: {
    size: String,
  },
  data() {
    return {
      partners : credits.others
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
