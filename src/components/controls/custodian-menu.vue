<template>
      <q-collapsible  v-if="getIsCustodian">
        <template slot="header">
          <q-item-side icon="mdi-folder-star" color="text2"/>
          <q-item-main :label="$t('default.custodian_tools')" class="text-text1"/>
        </template>
        <div class="bg-bg1">
          <q-item class="q-pl-lg" link to="/custodian/review-msigs">
            <q-item-side icon="mdi-shield-key" color="text2" />
            <q-item-main label="Review Msigs" class="text-text1" />
          </q-item>
          <q-item class="q-pl-lg" link to="/custodian/create-msigs">
            <q-item-side icon="mdi-shield-key-outline" color="text2" />
            <q-item-main label="Create Msigs" class="text-text1" />
          </q-item>
          <q-item class="q-pl-lg" link to="/custodian/my-payments">
            <q-item-side icon="attach_money" color="text2" />
            <q-item-main label="My Payments" class="text-text1" />
          </q-item>
        </div>
      </q-collapsible>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'custodianMenu',
  data () {
    return {}
  },
  computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getIsCustodian: 'user/getIsCustodian',
    })
    
  },
}
</script>

<style>
</style>
