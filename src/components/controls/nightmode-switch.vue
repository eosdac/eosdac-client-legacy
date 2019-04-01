<template>
  <div>
    <q-toggle
      :dark="getIsDark"
      v-model="mode"
      label="mode"
      :left-label="true"
      checked-icon="brightness_3"
      unchecked-icon="brightness_5"
      @input="handleMode"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'nightModeSwitch',
  data() {
    return {
      mode: true
    };
  },
  computed: {
    ...mapGetters({
      getIsDark: 'ui/getIsDark'
    })
  },
  mounted() {
    this.mode = this.getIsDark;
  },
  methods: {
    handleMode(v) {
      console.log('toggle val', v);
      if (v) {
        this.$store.dispatch('ui/loadTheme', 'default');
      } else {
        this.$store.dispatch('ui/loadTheme', 'light');
      }
    }
  }
};
</script>

<style></style>
