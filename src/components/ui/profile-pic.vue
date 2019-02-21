<template>
      <div class="profile_image relative-position animate-fade" style="height:65px; width:65px;"  v-bind:style="style" >
        <div v-if="is_custodian" style="position:absolute;bottom:-10px;right:-10px;"><q-icon size="34px" color="warning" name="star"/></div>
      </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'profilePic',
  props:{
    accountname: '',
    scale: Number
  },

  data () {
    return {
      profilePic: ''
    }
  },

  computed:{
    ...mapGetters({
      getCustodians: 'dac/getCustodians'
    }),
    style () {
      return { 
          transform: `scale(${this.scale})`,
          'background-image': `url(${this.profilePic})`
          };
     },

     is_custodian(){
       if(this.getCustodians){
         return this.getCustodians.find(c=> c.cust_name == this.accountname);
       }
       else{
         return false;
       }
     }
  },
  methods:{
    async setProfilePic(){
      let p = await this.$profiles.getAvatars([this.accountname] );
      this.profilePic = p[0].image;
      
    }
  },
  mounted(){
    this.setProfilePic();
  },

}
</script>

<style>
/* #profilepic{
  width:50px;
  height:50px;
  background-color:blue;
}
.loading {
  opacity: 0;
  transition: opacity .4s ease-out;
}

.loaded {
  opacity: 1;
} */
</style>
