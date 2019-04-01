<template>
<div>
<transition appear enter-active-class="animated flipInX" leave-active-class="animated flipOutX">
  <div appear class="bg-bg1 q-pa-sm round-borders q-ma-xs" >
    <q-btn v-if="viewable" size="sm" dense  class="q-mr-xs text-text1" icon="pageview" flat title="view action data">
      <q-popover :class="{'bg-dark': getIsDark}">
        <q-list>
          <q-item  v-for="(value, key) in action.data" :key="`_${key}`">
            <q-item-main>
              <q-item-tile label>{{key}}</q-item-tile>
              <q-item-tile v-if="(action.name == 'setcode' || action.name == 'setabi') && (key=='code' || key=='abi')" sublabel><q-icon name="mdi-code-not-equal-variant" class="q-mr-xs" />{{$helper.truncate(value, 10)}}</q-item-tile>
              <q-item-tile v-else sublabel>{{ value }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item v-if="action.authorization && action.authorization.length" >
            <q-item-main>
              <q-item-tile label><q-icon name="mdi-shield-account" class="text-text2" style="margin-right:3px"/>Authorization</q-item-tile>
              <q-item-tile sublabel>
                <div v-for="(auth, i) in action.authorization" :key="`auth${i}`" class="q-caption q-pl-xs">{{`${auth.actor}@${auth.permission}`}}</div>
              </q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </q-popover>
    </q-btn>
    <!-- <q-btn size="sm" dense  class="q-mr-xs text-text1" icon="edit" flat @click="edit_action_modal=true" title="edit action" /> -->
    <span class="text-text2">{{action.account}}</span>
    <div style="display:inline-block " class="fa-arrow-right text-text1">></div>
    <span class="text-text2">{{action.name}}</span>
    <q-btn v-if="closable" size="sm" dense  class="q-ml-xs text-negative" icon="close" flat @click="$emit('close')" title="delete action" />

  </div>
</transition>

    <q-modal minimized v-model="edit_action_modal">
      <div style="height:50px" class="bg-bg1 row items-center justify-between q-px-md text-text1">
        <span>ABI:</span>
        <q-btn icon="close" @click="edit_action_modal = false;" flat dense/>
      </div>
      <div class="q-pa-md bg-bg2 text-text1">
        <!-- <action-maker :account="getaction.account" :name="getaction.name" :prefill="getaction.data" /> -->
        <!-- <div v-html="prettyHtml(abi)" class="overflow-hidden" /> -->
      </div>
    </q-modal>


</div>
</template>

<script>
import {mapGetters} from 'vuex';
import actionMaker from 'components/controls/action-maker';
export default {
  name: 'displayAction',
  components:{
    actionMaker
  },
  props:{
    action: Object,
    closable: Boolean,
    viewable: Boolean
  },
  data () {
    return {
      edit_action_modal: false
    }
  },
  computed:{
    ...mapGetters({
      getIsDark: 'ui/getIsDark',
    }),
    getaction(){
      return this.action;
    }
  }

}
</script>

<style lang ="stylus">
@import '~variables'


</style>
