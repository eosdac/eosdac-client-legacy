<template>
      <q-list no-border link inset-delimiter>
      <q-collapsible  v-if="getIsCustodian">
        <template slot="header">
          <q-item-side icon="person_pin" color="text2"/>
          <q-item-main :label="$t('default.custodian_tools')" class="text-text1"/>
        </template>
        <div class="bg-bg1">
          <q-item class="q-pl-lg" link to="/custodian/msig-proposals">
            <q-item-side icon="list_alt" color="text2" />
            <q-item-main label="Msig Proposals" class="text-text1" />
          </q-item>
          <q-item class="q-pl-lg" link to="/custodian/claim-pay">
            <q-item-side icon="attach_money" color="text2" />
            <q-item-main label="Claim Payments" class="text-text1" />
          </q-item>
        </div>
      </q-collapsible>

        <q-item to="/constitution" >
          <q-item-side icon="receipt" color="text2"/>
          <q-item-main :label="$t('default.sign_the_constitution')" class="text-text1"/>
        </q-item>

        <q-item v-if="getAccountName" :to="`/profile/`+getAccountName" >
          <q-item-side icon="perm_identity" color="text2"/>
          <q-item-main :label="$t('default.profile')" class="text-text1"/>
        </q-item>

        <q-item to="/vote-custodians" >
          <q-item-side icon="how_to_vote" color="text2"/>
          <q-item-main :label="$t('default.custodians')" class="text-text1"/>
        </q-item>

      <q-item v-if="getAccountName && (!getIsCandidate || !getIsCandidate.is_active)" to="/manage-candidateship">
        <q-item-side icon="perm_contact_calendar" color="text2"/>
        <q-item-main :label="$t('default.register_as_candidate')" class="text-text1"/>
      </q-item>
      <q-item v-if="getAccountName && (getIsCandidate && getIsCandidate.is_active)" to="/manage-candidateship">
        <q-item-side icon="perm_contact_calendar" color="text2"/>
        <q-item-main :label="$t('default.unregister_as_candidate')" class="text-text1"/>
      </q-item>
      <!-- <q-item v-if="getMemberRoles.candidate" to="/managecandidateship" :disabled="!getAccountName">
        <q-item-side icon="icon-menu-12" />
        <q-item-main :label="$t('default.unregister_as_candidate')" sublabel="" />
      </q-item> -->
  

        <q-item @click.native="openURL('http://google.com')">
          <q-item-side icon="icon-menu-4" color="text2" />
          <q-item-main :label="$t('default.token_explorer')" class="text-text1" />
          <q-item-side right icon="icon-transfer-out" color="text2" />
        </q-item>

        <q-item @click.native="openURL('http://google.com')">
          <q-item-side icon="contact_support" color="text2" />
          <q-item-main :label="$t('default.support')" class="text-text1" />
          <q-item-side right icon="icon-transfer-out" color="text2" />
        </q-item>

        <q-item to="/settings">
          <q-item-side icon="settings" color="text2"/>
          <q-item-main :label="$t('default.settings')"  class="text-text1" />
        </q-item>

        <q-item to="/credits">
          <q-item-side icon="favorite" color="text2" />
          <q-item-main :label="$t('default.credits')" class="text-text1" />
        </q-item>

        <q-item v-if="getSettingByName('debug_dev_tools').value" class="animate-pop" to="/dev-tools" >
          <q-item-side icon="bug_report" color="negative"/>
          <q-item-main label="Dev Tools" sublabel="debug and test playyard" class="text-text1"/>
        </q-item>

      </q-list>
      
</template>

<script>
import {mapGetters} from 'vuex';
import {openURL} from 'quasar'
export default {
  name: 'MainMenu',
  data () {
    return {}
  },
  computed:{
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getSettingByName: 'user/getSettingByName',
      getIsCustodian: 'user/getIsCustodian',
      getIsCandidate: 'user/getIsCandidate'
    })
    
  },
  methods:{
    openURL,
  }
}
</script>

<style>
</style>
