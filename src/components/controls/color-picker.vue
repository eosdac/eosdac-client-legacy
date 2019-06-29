<template>
  <div>
    <div class="row justify-between q-mb-md">
      <div
        v-for="(color, i) in colornames.filter(cn => {
          return cn.indexOf('text') === -1;
        })"
        :key="`c${i}`"
        :class="`bg-${color}`"
        class="q-pa-sm round-borders q-caption q-mb-xs cursor-pointer"
        @click="colorvar = color"
      >
        {{ color }}
      </div>
    </div>
    <div class="row justify-between">
      <q-select
        class="q-mb-md"
        color="primary-light"
        :dark="getIsDark"
        v-model="colorvar"
        float-label="Select a color variable"
        :options="
          colornames.map(cv => {
            return { label: cv, value: cv };
          })
        "
      />
      <q-toggle
        label="track color?"
        :dark="getIsDark"
        color="primary-light"
        v-model="track_color"
      />
    </div>
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
      colornames: [
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
      color: colors.getBrand("primary"),
      track_color: false
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
    },
    colorvar(v) {
      if (this.track_color) {
        this.color = colors.getBrand(v);
      }
    }
  }
};
</script>
