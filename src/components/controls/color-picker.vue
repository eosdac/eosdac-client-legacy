<template>
  <div>
    <q-select
      class="q-mb-md"
      color="primary-light"
      :dark="getIsDark"
      v-model="colorvar"
      float-label="Select a color variable"
      :options="
        colorvars.map(cv => {
          return { label: cv, value: cv };
        })
      "
    />
    <q-color-picker
      :dark="getIsDark"
      no-parent-field
      inverted
      format-model="hex"
      class="bg-bg1"
      v-model="color"
    />
  </div>
</template>

<script>
import { colors } from "quasar";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      colorvars: ["primary", "bg1", "bg2", "text1", "text2"],
      colorvar: "primary",
      color: "#C7044B"

      // and the other types of models:
      // modelHexa: '#F0FF1CBF',
      // modelRgb: { r: 112, g: 204, b: 55 },
      // color: { r: 138, g: 36, b: 138, a: 64 }
    };
  },

  methods: {
    setColor(v) {
      colors.setBrand(this.colorvar, v);
      if (this.colorvar == "primary") {
        colors.setBrand(
          "primary-light",
          colors.lighten(colors.getBrand("primary"), 20)
        );
      }
      // colors.setBrand('bg1', '#babdbe');
      // colors.setBrand('bg2', '#eceff1');
      // colors.setBrand('text1', 'black');
      // colors.setBrand('text2', 'rgba(0,0,0,0.7)');
    }
  },
  computed: {
    ...mapGetters({
      getIsDark: "ui/getIsDark",
      getThemes: "ui/getThemes"
    })
  },
  watch: {
    color(v) {
      this.setColor(v);
    }
  }
};
</script>

<style></style>
