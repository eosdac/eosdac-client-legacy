<template>
<div>
  <div class="row bg-bg2 items-center">
    <display-action :action="actions[activeSlide]"/>
    <span class="q-pa-sm bg-bg2">
      <span class="on-left">Authorization</span>
      <span class="text-text2">{{actions[activeSlide].authorization.map(a => a.actor+'@'+a.permission).join(', ')}}</span>
    </span>
  </div>
  <q-carousel class="text-text1 bg-bg2" v-model="activeSlide" @input="handleslide($event)">
    <q-carousel-slide v-for="(action, i) in actions" :key="i+'actionslide'">

      <div class="action_data_parser q-py-md" v-for="(key, i) in Object.keys(action.data)" :key="i+'actionkey'">
        <div><span>{{key}}: </span><span class="text-text2">{{action.data[key]}}</span></div>
      </div>

    </q-carousel-slide>

  </q-carousel>

  <!-- controls -->
  <div v-if="actions.length > 1" class="q-mt-sm">
    <q-btn  color="primary" @click="prevAction()" icon="arrow_left" size="sm" />
    <span class="q-mx-sm">{{activeSlide+1}}/{{actions.length}}</span>
    <q-btn  color="primary" @click="nextAction()" icon="arrow_right" size="sm" />
  </div>

</div>
</template>

<script>
import displayAction from 'components/ui/display-action'
export default {
  name: 'Actionparser',
  components: {
    displayAction
  },

  props: {
    actions: Array,
  },
  computed :{

  },

  data () {
    return {
      activeSlide: 0,
      seenAll: false

    }
  },

  methods: {
    nextAction(){
      if(this.activeSlide < this.actions.length-1) this.activeSlide++;
      
    },
    prevAction(){
      if(this.activeSlide > 0) this.activeSlide--;

    },
    parseActionData(actiondata){
      let keys = Object.keys(actiondata);
      let values = Object.values(actiondata);
      return values;
    },
    handleslide(e){
      // console.log('slide',e)
      this.activeSlide = e;
      if(this.activeSlide === this.actions.length-1 && !this.seenAll){
        this.seenAll = true;
        this.$emit('seenAllActions')
      }
    }

  },

  mounted:function(){
    if(this.actions.length === 1) this.$emit('seenAllActions');
  }

}
</script>

<style lang ="stylus">
@import '~variables'
.action_data_parser{
  border-bottom: 1px solid grey;
}

.action_data_parser:last-of-type{
  border-bottom:none;
}


</style>
