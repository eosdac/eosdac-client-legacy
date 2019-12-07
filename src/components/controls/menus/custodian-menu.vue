<template>
  <div>
    <q-collapsible
      group="main-menu-sub"
      v-if="getIsCustodian"
      class="animate-fade"
    >
      <template slot="header">
        <q-item-side :icon="$configFile.icon.cust_tools" color="text2" />
        <q-item-main :label="$t('menu.custodian_tools')" class="text-text1" />
      </template>
      <div class="bg-bg1">
        <q-item
          class="q-pl-lg animate-fade"
          link
          to="/custodian/dac-management"
        >
          <q-item-main
            label="Manage DAC"
            class="text-text1 text-weight-light"
          />
        </q-item>

        <q-item class="q-pl-lg animate-fade" link to="/custodian/review-msigs">
          <q-item-main
            :label="$t('menu.vote_msigs')"
            class="text-text1 text-weight-light"
          />
        </q-item>
        <!--
        <q-item
          class="q-pl-lg animate-fade"
          link
          to="/custodian/review-worker-proposals"
        >
          <q-item-main
            :label="$t('menu.vote_worker_proposals')"
            class="text-text1 text-weight-light"
          />
        -->
        <!-- <q-item-side right>
            <q-chip round dense color="negative" class="shadow-2">7</q-chip>
          </q-item-side> -->
        <!--
        </q-item>
        -->

        <q-item
          v-if="getEnableCustPayments"
          class="q-pl-lg animate-fade"
          link
          to="/custodian/my-payments"
        >
          <q-item-main
            :label="$t('menu.my_payments')"
            class="text-text1 text-weight-light"
          />
        </q-item>
        <q-item class="q-pl-lg animate-fade" link to="/custodian/explore-dac">
          <q-item-main
            :label="$t('menu.explore')"
            class="text-text1 text-weight-light"
          />
        </q-item>
      </div>
    </q-collapsible>

    <q-collapsible v-else group="main-menu-sub" class="animate-fade">
      <template slot="header">
        <q-item-side :icon="$configFile.icon.dactoken" color="text2" />
        <q-item-main
          :label="
            $t('menu.dac_activity', { dacname: $configFile.get('dacname') })
          "
          class="text-text1"
        />
      </template>
      <div class="bg-bg1">
        <q-item
          class="q-pl-lg animate-fade"
          link
          to="/dac-activity/review-msigs"
        >
          <q-item-main
            :label="$t('menu.view_msigs')"
            class="text-text1 text-weight-light"
          />
        </q-item>

        <!--
        <q-item
          class="q-pl-lg animate-fade"
          link
          to="/dac-activity/review-worker-proposals"
        >
          <q-item-main
            :label="$t('menu.view_worker_proposals')"
            class="text-text1 text-weight-light"
          />
        </q-item>
        -->
        <q-item class="q-pl-lg animate-fade" link to="/dac-activity/financials">
          <q-item-main
            :label="$t('menu.view_financials')"
            class="text-text1 text-weight-light"
          />
        </q-item>
        <q-item
          class="q-pl-lg animate-fade"
          link
          to="/dac-activity/explore-dac"
        >
          <q-item-main :label="$t('menu.explore')" class="text-text1" />
        </q-item>
      </div>
    </q-collapsible>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "custodianMenu",
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName",
      getIsCustodian: "user/getIsCustodian",
      getEnableCustPayments: "dac/getEnableCustPayments"
    })
  }
};
</script>
