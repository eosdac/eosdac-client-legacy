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
        <token-statistics />
        <transfer-table />
      </q-tab-pane>
      <q-tab-pane name="members">coming soon...</q-tab-pane>
      <q-tab-pane name="votes">coming soon...</q-tab-pane>
    </q-tabs>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import transferTable from "components/ui/transfer-table";
import tokenStatistics from "components/ui/token-statistics";
export default {
  components: {
    transferTable,
    tokenStatistics
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({})
  },

  methods: {},

  mounted: async function() {},
  watch: {}
};
</script>

<style></style>
