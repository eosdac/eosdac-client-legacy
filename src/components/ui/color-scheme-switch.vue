<template>
  <div>
    <q-select
      :dark="getIsDark"
      :options="getSchemeOptions"
      :value="getActiveTheme.name"
      @input="handleMode"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "colorSchemeSwitch",
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getIsDark: "ui/getIsDark",
      getThemes: "ui/getThemes",
      getActiveTheme: "ui/getActiveTheme"
    }),
    getSchemeOptions() {
      if (this.getThemes) {
        return this.getThemes.map(t => {
          return { label: t.name, value: t.name };
        });
      }
    }
  },
  mounted() {},
  methods: {
    handleMode(v) {
      console.log("toggle val", v);
      if (v) {
        this.$store.dispatch("ui/loadColorScheme", v);
      }
    }
  }
};
</script>

<style></style>
