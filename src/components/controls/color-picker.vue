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
    <div class="row justify-between items-center">
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
      <div>
        <label
          style="display:block"
          for="myInput"
          class="cursor-pointer full-width"
        >
          load theme
        </label>
        <input
          id="myInput"
          type="file"
          style="display:none"
          ref="inputFile"
          accept=".json,application/json"
          @input="handleFileInput()"
        />
      </div>
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
    <div class="q-mt-md row justify-between">
      <q-btn label="save theme" color="primary" @click="getColorScheme" />
      <q-toggle
        label="is dark?"
        :dark="getIsDark"
        color="primary-light"
        :value="$store.state.ui.isDark"
        @input="change_is_dark_state"
      />
    </div>
  </div>
</template>

<script>
import { colors } from "quasar";
import { mapGetters } from "vuex";
import { saveAs } from "file-saver";

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
      track_color: false,
      is_dark: this.$store.state.ui.isDark
    };
  },

  methods: {
    setColor(v, cvar = false) {
      let cv = cvar || this.colorvar;
      console.log(v, cv);
      colors.setBrand(cv, v);
      if (cv == "primary") {
        colors.setBrand(
          "primary-light",
          colors.lighten(colors.getBrand("primary"), 20)
        );
      }
    },
    async handleFileInput() {
      let file = this.$refs.inputFile.files[0];
      console.log(file);
      // this.filename = file.name;
      // this.filesize = `${(file.size / 1024).toFixed(2)}KB`;

      let content = await new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = function(result) {
          return resolve(fr.result);
        };
        fr.readAsText(file, `utf8`);
      });

      try {
        content = JSON.parse(content);
      } catch (e) {
        alert("Malformed import file !!", e);
        return;
      }

      let filecolorvars = Object.keys(content.colors);

      for (let i = 0; i < filecolorvars.length; i++) {
        let cv = filecolorvars[i];

        this.setColor(content.colors[cv], cv.replace("$", ""));
      }
      this.change_is_dark_state(content.is_dark);
      document.getElementById("myInput").value = "";
    },
    getColorScheme() {
      let color_file = {
        is_dark: this.getIsDark,
        colors: {}
      };

      this.colornames.forEach(c => {
        color_file.colors[`$${c}`] = colors.getBrand(c);
      });

      let blob = new Blob([JSON.stringify(color_file, null, 2)], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, "theme.json");
      console.log(color_file);
    },
    change_is_dark_state(v) {
      this.$store.commit("ui/setIsDark", v);
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
