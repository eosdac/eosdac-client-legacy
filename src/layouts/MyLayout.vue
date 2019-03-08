<template>
  <q-layout view="hHh Lpr lff" > 

    <q-layout-header class="no-shadow" :reveal="getSettingByName('toolbar_reveal').value">
      <q-toolbar  color="bg1" >

        <q-btn size="md" flat dense round class="q-mr-sm" style="margin-top:-4px" @click="leftDrawerOpen = !leftDrawerOpen" :aria-label="$t('default.menu')">
          <q-icon color="text1" v-if="leftDrawerOpen" name="close" />
          <q-icon color="text1" v-else name="menu" />
        </q-btn>

        <q-toolbar-title>
          <span v-if="getIsDark">
            <img class="cursor-pointer gt-xs" @click="$router.push('/')" src="~assets/images/logo-main-light.svg" style="height:48px;" :title="$t('default.member_client')">
            <img class="cursor-pointer lt-sm" @click="$router.push('/')" src="~assets/images/logo-notext-light.svg" style="height:48px;" :title="$t('default.member_client')">
          </span>
          <span v-if="!getIsDark">
            <img class="cursor-pointer gt-xs" @click="$router.push('/')" src="~assets/images/logo-main-dark.svg" style="height:48px;" :title="$t('default.member_client')">
            <img class="cursor-pointer lt-sm" @click="$router.push('/')" src="~assets/images/logo-notext-dark.svg" style="height:48px;" :title="$t('default.member_client')">
          </span>
        </q-toolbar-title>
        <!-- <div v-if="getIsloaded" class="bg-positive" style="width:30px;height:30px;"></div> -->
        <toolbar-menu v-if="!loading" />

      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer v-model="leftDrawerOpen" @show="handleDrawerEvent(true)" @hide="handleDrawerEvent(false)" content-class="bg-bg1 relative-position overflow-hidden" ref="leftdrawer">
      <main-menu />
    </q-layout-drawer>

    <q-page-container class="bg-bg2 text-text1 relative-position">
      <request-signature />
      <router-view />
      <transactionOverlay />
    </q-page-container>

<q-btn
  v-back-to-top.animate="{offset: 500, duration: 200}"
  round
  size="18px"
  color="primary"
  class="fixed-bottom-right animate-pop"
  style="margin: 0 15px 15px 0"
>
  <q-icon name="keyboard_arrow_up" />
</q-btn>



  </q-layout>
  
</template>

<script>
import { openURL } from 'quasar';
import {mapGetters} from 'vuex';

import transactionOverlay from 'components/ui/transaction-overlay';
import toolbarMenu from 'components/controls/menus/toolbar-menu';
import mainMenu from 'components/controls/menus/main-menu';
import requestSignature from 'components/ui/request-signature';



export default {
  name: 'MyLayout',
  components: {
      transactionOverlay,
      toolbarMenu,
      mainMenu,
      requestSignature
  },
  data() {
    return {
      leftDrawerOpen: true,
      loading: false,
 
      // dacloaded : false

    }
  },
  computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getIsDark: 'ui/getIsDark',
      getIsloaded : 'dac/getIsLoaded',
      getSettingByName: 'user/getSettingByName'
    })
    
  },
  created(){
    // this.$root.$on('dac_loaded', ()=>{this.dacloaded = true})
  },

  methods:{
    openURL,
    handleDrawerEvent(e){
      this.$store.commit('ui/setDrawerIsOpen', e);
    }
  },

  async mounted(){
    this.$store.commit('ui/setDrawerIsOpen', this.$refs.leftdrawer.showing);
  },

  watch: {
    getAccountName: function(v){
      if(this.$route.fullPath.startsWith('/custodian/') && !this.getAccountName){
        this.$router.push({ path: '/' })
      }
    }
  },

}
</script>

<style>
</style>
