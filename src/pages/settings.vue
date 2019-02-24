<template>
  <q-page class="q-pa-md">

    <div class="q-display-1 q-mb-md">{{$t('settings.settings')}}</div>

    <div class="row gutter-sm">
      <div v-for="(group, j) in groups" class="col-xs-12  col-xl-6" :key="`group_${j}`">
        <div  class="bg-bg1 round-borders shadow-5 relative-position overflow-hidden full-height " >

          <q-list no-border>
            <q-list-header class="text-text2 q-headline capitalize">{{group}}</q-list-header>

            <div v-for="(setting, i) in getSettings.filter(s=> s.group == group)" :key="`setting_${i}`">

              <q-item v-if="setting.type=='boolean' ">
                <q-item-main>
                  <q-item-tile class="text-text1" label>{{setting.label}}</q-item-tile>
                  <q-item-tile class="text-text2" sublabel>{{setting.sublabel}}</q-item-tile>
                </q-item-main>
                <q-item-side right>
                  <q-toggle  :dark="getIsDark"  class="animate-pop" :value="setting.value"  color="primary-light"  @input="handle($event, setting.name)" />
                </q-item-side>
              </q-item>

              <!-- setting components -->
              <div v-if="setting.type=='component'">

                <q-item v-if="setting.value=='langselector'" >
                  <q-item-main >
                    <q-item-tile class="text-text1" label>{{ $t(setting.label) }}</q-item-tile>
                    <lang-selector :label="false" />
                  </q-item-main>
                </q-item>

              </div>
            </div>
          </q-list>
        </div> 
      </div><!-- end v-for = setting group -->

    </div>

    

    <debug-data :data="[{'getSettings': getSettings}]" />
  </q-page>
  
</template>

<style lang="stylus">
@import '~variables'

</style>

<script>


import Vue from 'vue';
import {mapGetters} from 'vuex';
import langSelector from 'components/controls/lang-selector';
import debugData from 'components/ui/debug-data';

export default {
  name: 'settings',
  components: {
    debugData,
    langSelector
  },
  data() {
    return {
      groups: ['toolbar', 'notify', 'locale', 'debug'],
      vue : Vue
    }
  },
  computed:{
    ...mapGetters({
      getSettings: 'user/getSettings',
      getIsDark: 'ui/getIsDark',
      getSettingByName: 'user/getSettingByName'

    })

    
  },

  methods:{
    handle(v,t){
      this.$store.commit('user/setSettingItem', {name: t, value: v})
    }

  },
  beforeMount(){
    this.$store.subscribe((mutation, state) => {
      // console.log('dddddd', mutation.type)
      // console.log('dddddd',mutation.payload)
      if(mutation.type !='user/setSettingItem') return;
      switch (mutation.payload.name) {
        case 'debug_data_structure':
            if(mutation.payload.value){
              console.log(`${mutation.payload.name} on`);
            }
            else{
              console.log(`${mutation.payload.name} off`);
            }
            
          break;
      
        default:
          break;
      }
    })
    
  }


}
</script>
