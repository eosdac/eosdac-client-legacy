<template>
  <div class="row justify-between bg-bg1 shadow-5 round-borders q-pa-md q-mb-md" v-if="custodians.length" >

    <div class="column items-center q-pa-sm animate-fade" v-for="custodian in custodians" :key="custodian.cust_name">
      <!-- <div class="profile_image relative-position" style=" width:65px;height:65px;" v-bind:style="{ 'background-image': `url(${custodian.profile.image})` }">
        <div style="position:absolute;bottom:-10px;right:-10px"><q-icon size="36px" color="warning" name="star"/></div>
      </div> -->
      <profile-pic :accountname="custodian.cust_name" :scale="1" />
      <router-link class="q-body-1 a2 q-mt-xs" :to="{path: '/profile/' + custodian.cust_name}" >
        <div class="q-ma-none" >{{custodian.cust_name}}</div>
      </router-link>
    </div>

  </div>
</template>

<script>
import profilePic from './profile-pic';
import {mapGetters} from 'vuex';

export default {
  name: 'displayCustodians',
  components:{
    profilePic
  },

  props: {
    data: Object,
  },

  data () {
    return {
      custodians:[]
    }
  },

  computed: {
    ...mapGetters({
      getCustodians: 'dac/getCustodians'
    })
  },

  methods: {

    async setCustodians () {
        let custodians;
        if(!this.getCustodians){
          custodians = await this.$store.dispatch('dac/fetchCustodians' );
        }
        else{
          custodians = this.getCustodians;
        }
        this.custodians = custodians;
    }
  },

  mounted: function() {
    if(this.getCustodians){
      this.setCustodians();
    }
  },

  watch: {
    getCustodians (oldval, newval) {
      if(newval){
        this.setCustodians();
      }
    }
  }

}
</script>

<style lang ="stylus">
@import '~variables'

.loading {
  opacity: 0;
  transition: opacity .4s ease-out;
}

.loaded {
  opacity: 1;
}

</style>

