<template>
  <q-collapsible group="main-menu-sub" v-if="getMemberStatus == 'member'">
    <template slot="header">
      <q-item-side :icon="$configFile.icon.mem_tools" color="text2" />
      <q-item-main :label="$t('default.member_tools')" class="text-text1" />
    </template>
    <div class="bg-bg1">
      <q-item class="q-pl-lg" link to="/member/new-worker-proposal">
        <q-item-main
          label="New Worker Proposal"
          class="text-text1 text-weight-light"
        />
      </q-item>
      <q-item class="q-pl-lg" link to="/member/my-worker-proposals">
        <q-item-main
          label="My Worker Proposals"
          class="text-text1 text-weight-light"
        />
      </q-item>
    </div>
  </q-collapsible>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'memberMenu',
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getMemberStatus: 'user/getMemberStatus'
    })
  }
};
</script>

<style>
</style>
