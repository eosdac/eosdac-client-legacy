<template>
  <q-item class="memberselector">
    <q-item-side left>
      <img class="imgx" :src="getSelectedAvatarSrc" />
    </q-item-side>
    <q-item-main>
      <q-select
        dark
        color="primary-light"
        v-model="selected"
        :options="getOptions"
      ></q-select>
    </q-item-main>
  </q-item>
</template>

<script>
export default {
  name: "memberSelect",
  props: {
    accountnames: {
      type: Array,
      default: () => {
        return ["piecesnbitss", "evilmikehere", "testtesttest"];
      }
    }
  },
  data() {
    return {
      selected: "",
      profiles: []
    };
  },
  computed: {
    getOptions() {
      if (this.profiles.length) {
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
      console.log(this.profiles);
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
