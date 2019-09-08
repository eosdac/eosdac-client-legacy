<template>
  <q-page>
    <!--  -->
    <q-tabs color="primary">
      <q-tab
        default
        :label="`Token (${$configFile.get('dactokensymbol')})`"
        name="token"
        slot="title"
      />
      <q-tab label="Members" name="members" slot="title" />
      <q-tab label="Votes" name="votes" slot="title" />
      <!-- Targets -->
      <q-tab-pane name="token" class="q-pa-md">
        <token-statistics class="q-mb-md" />
        <transfer-table />
      </q-tab-pane>
      <q-tab-pane name="members">coming soon...</q-tab-pane>
      <q-tab-pane name="votes">
        <vote-timeline
          class="q-mt-sm bg-bg1 q-pa-md"
          :responsive="true"
          :height="400"
          :accounts="getCustNames"
          :legend="true"
        />
      </q-tab-pane>
    </q-tabs>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import transferTable from "components/ui/transfer-table";
import tokenStatistics from "components/ui/token-statistics";
import voteTimeline from "components/ui/vote-timeline";
export default {
  components: {
    transferTable,
    tokenStatistics,
    voteTimeline
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getCustodians: "dac/getCustodians",
      getAccountName: "user/getAccountName",
      getIsDark: "ui/getIsDark"
    }),
    getCustNames() {
      if (this.getCustodians) {
        return this.getCustodians.map(c => {
          return c.cust_name;
        });
      } else {
        return [];
      }
    }
  },

  methods: {},

  mounted: async function() {},
  watch: {}
};
</script>

<style></style>
