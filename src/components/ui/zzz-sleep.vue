<template>
  <div class="sleep-z-cont">
    <div class="sleep-z text-text2" v-for="i in 3" ref="z" :key="`z${i}`" >z</div>
  </div>
</template>

<script>
export default {
  name: 'zzzSleep',
  data () {
    return {
  

    }
  },
  methods:{

    async animateZs(){
      
      for(let i = 0; i < this.$refs.z.length; i++){
        
        this.$refs.z[i].classList.add('z-animate');
        await  new Promise(resolve => setTimeout(resolve, 500))
      }
      await  new Promise(resolve => setTimeout(resolve, 500));

      for(let i = 0; i < this.$refs.z.length; i++){
        this.$refs.z[i].classList.remove('z-animate');
      }
      await  new Promise(resolve => setTimeout(resolve, 9000))
      this.animateZs();

    }
    
  },
  mounted(){
    this.animateZs();
  }
}
</script>

<style>
.sleep-z-cont{
  transform: rotate(-15deg);
}
.sleep-z{
  display: inline-block;
  opacity:0;
  font-size: 10px;
  transition: all 0.5s ease-in;
  transform: rotate(0deg);
  /* font-size: 10px; */

}
.z-animate{
  opacity:1;
  font-size: 13px;
  left:-5px;
  transform: rotate(-8deg);

}

</style>
