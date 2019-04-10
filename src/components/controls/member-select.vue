<template>
  <q-item class="memberselector">
    <q-item-side left>
      <img
        v-if="getSelectedAvatarSrc"
        class="imgx animate-fade"
        :src="getSelectedAvatarSrc"
      />
    </q-item-side>
    <q-item-main>
      <q-select
        dark
        color="primary-light"
        :value="selected"
        :options="getOptions"
        @change="updateSelected"
      ></q-select>
    </q-item-main>
  </q-item>
</template>

<script>
export default {
  name: "memberSelect",
  props: {
    value: String,
    accountnames: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      selected: this.value,
      profiles: []
    };
  },
  computed: {
    getOptions() {
      if (this.profiles.length && this.accountnames.length) {
        return this.accountnames.map(ac => {
          return {
            label: ac,
            value: ac,
            image:
              this.profiles.find(p => p.account == ac).profile.image ||
              this.$profiles.default_avatar
          };
        });
      }
      return [];
    },
    getSelectedAvatarSrc() {
      let sel = this.getOptions.find(p => p.value == this.selected);
      if (sel) {
        return sel.image;
      }
    }
  },
  methods: {
    async getAvatars() {
      this.profiles = await this.$profiles.getProfiles([this.accountnames]);
    },
    updateSelected(v) {
      this.selected = v;
      this.$emit("input", this.selected);
    }
  },
  mounted() {
    this.getAvatars();
  }
};
</script>

<style>
.q-item-image,
.imgx {
  min-height: 40px;
  height: 40px;
  min-width: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
