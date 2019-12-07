<template>
  <q-list no-border link inset-delimiter>
    <q-item v-if="getAccountName" :to="`/profile/` + getAccountName">
      <q-item-side :icon="$configFile.icon.profile" color="text2" />
      <q-item-main :label="$t('menu.profile')" class="text-text1" />
    </q-item>

    <q-item to="/vote-custodians">
      <q-item-side :icon="$configFile.icon.vote" color="text2" />
      <q-item-main
        v-if="getAccountName"
        :label="$t('menu.custodians')"
        class="text-text1"
      />
      <q-item-main
        v-else
        :label="$t('menu.view_custodians')"
        class="text-text1"
      />
    </q-item>

    <q-item
      v-if="getAccountName && (!getIsCandidate || !getIsCandidate.is_active)"
      to="/manage-candidateship"
    >
      <q-item-side :icon="$configFile.icon.cand_reg" color="text2" />
      <q-item-main
        :label="$t('menu.register_as_candidate')"
        class="text-text1"
      />
    </q-item>
    <q-item
      v-if="getAccountName && getIsCandidate && getIsCandidate.is_active"
      to="/manage-candidateship"
    >
      <q-item-side :icon="$configFile.icon.cand_reg" color="text2" />
      <q-item-main
        :label="$t('menu.unregister_as_candidate')"
        class="text-text1"
      />
    </q-item>

    <q-item to="/constitution">
      <q-item-side :icon="$configFile.icon.constitution" color="text2" />
      <q-item-main
        v-if="getAccountName"
        :label="$t('default.sign_the_constitution')"
        class="text-text1"
      />
      <q-item-main
        v-else
        :label="$t('default.read_the_constitution')"
        class="text-text1"
      />
    </q-item>

    <custodian-menu />
    <member-menu />

    <menu-extension />

    <q-item to="/settings">
      <q-item-side :icon="$configFile.icon.settings" color="text2" />
      <q-item-main :label="$t('menu.settings')" class="text-text1" />
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
  }
};
</script>
