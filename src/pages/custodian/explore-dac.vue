<template>
  <q-page class="q-pa-md">
    <transfer-table />
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
