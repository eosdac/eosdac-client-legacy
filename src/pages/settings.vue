<template>
  <q-page class="q-pa-md bg-logo">

    <div class="row gutter-sm">
      <div v-for="(group, j) in groups" class="col-xs-12  col-xl-6" :key="`group_${j}`">
        <div  class="bg-bg1 round-borders shadow-5 relative-position overflow-hidden full-height " >

          <q-list no-border>
            <q-list-header class=" q-headline capitalize">
              <q-icon class="text-text1" :name="group.icon"  />
              <span class="text-text2 on-right">{{group.name}}</span>
            </q-list-header>

            <div v-for="(setting, i) in getSettings.filter(s=> s.group == group.name)" :key="`setting_${i}`">

              <!-- setting bool -->
              <q-item v-if="setting.type=='boolean' ">
                <q-item-main>
                  <q-item-tile class="text-text1" label>{{setting.label}}</q-item-tile>
                  <q-item-tile class="text-text2" sublabel>{{setting.sublabel}}</q-item-tile>
                </q-item-main>
                <q-item-side right>
                  <q-toggle  :dark="getIsDark"  class="animate-pop" :value="setting.value"  color="primary-light"  @input="handle($event, setting.name)" />
                </q-item-side>
              </q-item>

              <!--- setting number --->
              <q-item v-if="setting.type=='number' ">
                <q-item-main>
                  <q-item-tile class="text-text1" label>{{setting.label}}</q-item-tile>
                  <q-input :dark="getIsDark" type="number" :value="setting.value" @input="handle($event, setting.name)" />
                </q-item-main>
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
      groups:[
        {name: 'toolbar', icon:'mdi-set-top-box'},
        {name: 'notify', icon:'mdi-message-text-outline'},
        {name: 'locale', icon:'mdi-globe-model'},
        {name: 'debug', icon:'mdi-bug-outline'},
        {name: 'advanced', icon:'mdi-code-braces'},
      ]
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
        case 'debug_console_log':
            if(mutation.payload.value){
              this.$configFile.enable_ConsoleLog();
            }
            else{
              this.$configFile.disable_ConsoleLog();
            }
            
          break;
      
        default:
          break;
      }
    })
    
  }


}
</script>
