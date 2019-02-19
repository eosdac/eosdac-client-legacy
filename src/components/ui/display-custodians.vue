<template>
  <div class="row justify-between" v-if="custodians.length">
    <!-- <pre>{{custodians}}</pre> -->
    <div class="column items-center bg-primary" v-for="custodian in custodians" :key="custodian.cust_name">
      <!-- <div class="center_background_image" style="border-radius:50%; width:20px;height:20px" v-bind:style="{ 'background-image': `url()` }"></div> -->
      <span  id="profilepic"></span>
  
      <router-link class="q-body-1 a2 q-mt-xs" :to="{path: '/profile/' + custodian.cust_name}" >
        <div class="q-ma-none" >{{custodian.cust_name}}</div>
      </router-link>
    
      <!-- <span>{{custodian.cust_name}}</span> -->
    </div>
    <div class="col"></div>
  </div>
</template>

<script>
import profilePic from './profile-pic'
import {mapGetters} from 'vuex'

export default {
  name: 'profilePic',
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
      //get all custodians + profiles and display avatar
      async setCustodians () {

          this.custodians = this.getCustodians;

        
        
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

#profilepic{
  width:50px;
  height:50px;
  background-color:blue;
  border-radius: 50%;
}
.loading {
  opacity: 0;
  transition: opacity .4s ease-out;
}

.loaded {
  opacity: 1;
}

</style>

