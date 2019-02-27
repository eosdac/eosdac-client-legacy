<template>
      <q-collapsible  v-if="getMemberStatus=='member'">
        <template slot="header">
          <q-item-side icon="mdi-folder-account" color="text2"/>
          <q-item-main :label="$t('default.member_tools')" class="text-text1"/>
        </template>
        <div class="bg-bg1">
          <q-item class="q-pl-lg" link to="/member/create-worker-proposal">
            <q-item-side icon="mdi-worker" color="text2" />
            <q-item-main label="Create Worker Proposal" class="text-text1" />
          </q-item>

        </div>
      </q-collapsible>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'memberMenu',
  data () {
    return {}
  },
  computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getMemberStatus: 'user/getMemberStatus'
    })
    
  },
}
</script>

<style>
</style>
