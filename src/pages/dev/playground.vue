<template>
  <q-page padding>
    {{ test }}
    <member-select
      v-model="test"
      :accountnames="['piecesnbitss', 'evilmikehere', 'testtesttest']"
    />
    <abi-viewer />
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import abiViewer from "components/controls/abi-viewer";
import memberSelect from "components/controls/member-select";

export default {
  name: "playyard",
  components: {
    abiViewer,
    memberSelect
  },
  data() {
    return {
      abi: "",
      wasm: "",
      test: "evilmikehere"
    };
  },
  computed: {
    ...mapGetters({
      // getEosApi: 'global/getEosApi'
    })
  },
  methods: {}
};
</script>

<style></style>
