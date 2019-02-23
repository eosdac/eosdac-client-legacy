<template>
  <div>
    <q-item>
      <q-item-side v-if="icon" :icon="icon" :class="statusClass"/>
      <q-item-main>
        <q-input type="number" dark  :stack-label="xlabel" color="primary-light" ref="assetinput" :value="parseInput"  @input="update($event)"/>
      </q-item-main>
    </q-item>
  </div>
</template>

<script>
export default {
  name: 'assetInput',
  props:{
    value:'',

    label: String,
    icon: String,
    min: Number,
    max: Number
  },
  data () {
    return {
      xlabel: '',
      statusClass:'text-text2'
    }
  },
  computed:{

    parseInput(){
        console.log('vallllllll', this.value)
      if(this.value){
        let n = String(this.value).split(' ')[0];
        this.statusClass= 'text-positive';
        this.setLabel(this.label);

        if(this.min && (n < this.min) ){
          this.setLabel(`value less then set min ${this.min}`);
          this.statusClass= ['text-negative', 'animate-blink'];
        }

        if(this.max && (n > this.max) ){
          this.setLabel(`value greater then set max ${this.max}`);
          this.statusClass= ['text-negative', 'animate-blink'];
        }
        return n
      }

    }
  },
  methods:{
    update(e) {
      console.log('update',e)
      e = e || 0;
      let asset = `${e.toFixed(4)}`;
      this.$emit('input', asset)
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
