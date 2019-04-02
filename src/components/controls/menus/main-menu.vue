<template>
  <q-list no-border link inset-delimiter>
    <custodian-menu />
    <member-menu />

    <q-item to="/constitution">
      <q-item-side :icon="$configFile.icon.constitution" color="text2" />
      <q-item-main
        :label="$t('default.sign_the_constitution')"
        class="text-text1"
      />
    </q-item>

    <q-item v-if="getAccountName" :to="`/profile/` + getAccountName">
      <q-item-side :icon="$configFile.icon.profile" color="text2" />
      <q-item-main :label="$t('default.profile')" class="text-text1" />
    </q-item>

    <q-item to="/vote-custodians">
      <q-item-side :icon="$configFile.icon.vote" color="text2" />
      <q-item-main
        v-if="getAccountName"
        :label="$t('default.custodians')"
        class="text-text1"
      />
      <q-item-main
        v-else
        :label="$t('default.view_custodians')"
        class="text-text1"
      />
    </q-item>

    <q-item
      v-if="getAccountName && (!getIsCandidate || !getIsCandidate.is_active)"
      to="/manage-candidateship"
    >
      <q-item-side :icon="$configFile.icon.cand_reg" color="text2" />
      <q-item-main
        :label="$t('default.register_as_candidate')"
        class="text-text1"
      />
    </q-item>
    <q-item
      v-if="getAccountName && (getIsCandidate && getIsCandidate.is_active)"
      to="/manage-candidateship"
    >
      <q-item-side :icon="$configFile.icon.cand_reg" color="text2" />
      <q-item-main
        :label="$t('default.unregister_as_candidate')"
        class="text-text1"
      />
    </q-item>

    <menu-extension />

    <q-item @click.native="openURL($configFile.get('external').dacexplorer)">
      <q-item-side :icon="$configFile.icon.explorer" color="text2" />
      <q-item-main :label="$t('default.token_explorer')" class="text-text1" />
      <q-item-side right icon="icon-transfer-out" color="text2" />
    </q-item>

    <q-item @click.native="openURL($configFile.get('external').discord)">
      <q-item-side :icon="$configFile.icon.support" color="text2" />
      <q-item-main :label="$t('default.support')" class="text-text1" />
      <q-item-side right icon="icon-transfer-out" color="text2" />
    </q-item>

    <q-item to="/settings">
      <q-item-side :icon="$configFile.icon.settings" color="text2" />
      <q-item-main :label="$t('default.settings')" class="text-text1" />
    </q-item>

    <q-item to="/credits">
      <q-item-side :icon="$configFile.icon.credits" color="text2" />
      <q-item-main :label="$t('default.credits')" class="text-text1" />
    </q-item>

    <q-item
      v-if="getSettingByName('debug_dev_tools').value"
      class="animate-pop"
      to="/dashboard"
    >
      <q-item-side :icon="$configFile.icon.dev" color="positive" />
      <q-item-main label="Dashboard" class="text-text1" />
    </q-item>

    <dev-menu />
  </q-list>
</template>

<script>
import { mapGetters } from "vuex";
import { openURL } from "quasar";
import custodianMenu from "./custodian-menu";
import memberMenu from "./member-menu";
import devMenu from "./dev-menu";
import menuExtension from "../../../extensions/components/menu/menu-extension";
export default {
  name: "MainMenu",
  components: {
    custodianMenu,
    memberMenu,
    devMenu,
    menuExtension
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName",
      getSettingByName: "user/getSettingByName",
      getIsCustodian: "user/getIsCustodian",
      getIsCandidate: "user/getIsCandidate"
    })
  },
  methods: {
    openURL
  }
};
</script>

<style></style>
