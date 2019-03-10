<template>
<div class="row items-center">
  <q-icon name="mdi-shield-account" />
  <div class="q-caption">{{parseAuth}}</div>
  <!-- <q-btn label="add" @click="addAuth"/> -->
</div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  // name: 'ComponentName',
  props:{
    auth: Array
  },
  data () {
    return {}
  },
  computed:{
    ...mapGetters({
      getAccount: 'user/getAccount'
    }),
    parseAuth(){
      return this.auth.map(a=>{return `${a.actor}@${a.permission}`}).join(', ');
    }
  },
  methods:{

    addAuth(){
      console.log(this.auth);
      this.auth.push({actor: 'gggg', permission: '123'})
    }
  },
  mounted(){
    this.$emit('input', this.auth);
  }
}
</script>

<style>
</style>
