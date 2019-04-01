<template>
      <q-collapsible  group="main-menu-sub" v-if="getSettingByName('debug_dev_tools').value" class="animate-pop" >
        <template slot="header">
          <q-item-side :icon="$configFile.icon.dev" color="negative"/>
          <q-item-main label="Dev Tools" class="text-text1"/>
        </template>
        <div class="bg-bg1">
          <q-item class="q-pl-lg" link to="/dev-tools/memberclient">
            <q-item-main label="Memberclient" class="text-text1 text-weight-light" />
          </q-item>
          <q-item class="q-pl-lg" link to="/dev-tools/transactions">
            <q-item-main label="Transactions" class="text-text1 text-weight-light" />
          </q-item>
          <q-item class="q-pl-lg" link to="/dev-tools/playground">
            <q-item-main label="Play Ground" class="text-text1 text-weight-light" />
          </q-item>
        </div>
      </q-collapsible>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'devMenu',
  data () {
    return {}
  },
  computed:{
    ...mapGetters({
      getSettingByName: 'user/getSettingByName'

    })
    
  },
}
</script>

<style>
</style>