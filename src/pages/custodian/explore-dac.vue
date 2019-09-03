<template>
  <q-page>
    <!--  -->
    <q-tabs color="primary">
      <q-tab default label="Transfers" name="transfers" slot="title" />
      <q-tab label="Votes" name="votes" slot="title" />
      <!-- Targets -->
      <q-tab-pane name="transfers" class="q-pa-md">
        <transfer-table />
      </q-tab-pane>
      <q-tab-pane name="votes">coming soon...</q-tab-pane>
    </q-tabs>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import transferTable from "components/ui/transfer-table";
export default {
  components: {
    transferTable
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
