<template>
  <div>
    <q-item>
      <q-item-side v-if="icon"  :icon="icon" :class="statusClass"/>
      <q-item-main>
        <q-input type="number" :dark="getIsDark"  :stack-label="xlabel" color="primary-light" ref="assetinput" :value="parseInput"  @input="update($event)" />
      </q-item-main>
    </q-item>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'assetInput',
  props:{
    value:'',

    label: String,
    icon: String,
    min: {
      type: Number,
      default: null
    },
    max:{
      type: Number,
      default: null
    }
  },
  data () {
    return {
      xlabel: this.label || '',
      statusClass:'text-text2',
    }
  },
  computed:{
    ...mapGetters({
      getIsDark: 'ui/getIsDark'
    }),
    parseInput(){
      console.log(this.value)
      if(this.value){
        let n = Number(this.value);
        this.statusClass= 'text-positive';
        this.setLabel(this.label);

        if(this.min !=null && (n < this.min) ){
          console.log(`value less then set min ${this.min}`)
          this.setLabel(`value less then set min ${this.min}`);
          this.statusClass= ['text-negative', 'fa-vibrate'];
        }

        if(this.max!=null && (n > this.max) ){
          console.log(`value greater then set max ${this.max}`)
          this.setLabel(`value greater then set max ${this.max}`);
          this.statusClass= ['text-negative', 'fa-vibrate'];
        }
        return n
      }
      else{
        this.statusClass= ['text-text2'];
        this.setLabel(this.label);
      }


    }
  },
  methods:{
    update(e) {
      if(e != undefined){
         e = `${e.toFixed(4)}`;
      }
      this.$emit('input', e)
    },

    setLabel(l){
      this.xlabel = l;
    }

  },
  mounted(){
 
    if(this.label){
      this.setLabel(this.label);
    }
    
  }
}
</script>

<style>
</style>
