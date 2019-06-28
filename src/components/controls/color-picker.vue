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
      colorvars: [
        "primary",
        "bg1",
        "bg2",
        "text1",
        "text2",
        "info",
        "positive",
        "negative",
        "dark"
      ],
      colorvar: "primary",
      color: "#C7044B"
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
      getIsDark: "ui/getIsDark"
    })
  },
  watch: {
    color(v) {
      this.setColor(v);
    }
  }
};
</script>
