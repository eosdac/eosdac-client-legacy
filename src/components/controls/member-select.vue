<template>
  <q-item class="memberselector no-padding">
    <q-item-side left style="height:40px">
      <img
        v-if="getSelectedAvatarSrc"
        class="imgx animate-fade"
        :class="{ itsmeclass: checkItsMe }"
        :src="getSelectedAvatarSrc"
      />
    </q-item-side>
    <q-item-main>
      <q-select
        dark
        dense
        :placeholder="placeholder"
        color="primary-light"
        :value="selected"
        :options="getOptions"
        @change="updateSelected"
      ></q-select>
    </q-item-main>
  </q-item>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "memberSelect",
  props: {
    value: String,
    accountnames: {
      type: Array,
      default: () => {
        return [];
      }
    },
    placeholder: {
      type: String,
      default: ""
    },
    itsme: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      selected: this.value,
      profiles: []
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName"
    }),
    checkItsMe() {
      if (this.itsme) {
        return this.getAccountName === this.selected;
      } else {
        return false;
      }
    },
    getOptions() {
      if (this.profiles.length && this.accountnames.length) {
        return this.accountnames.map(ac => {
          let sublabel =
            this.itsme && this.getAccountName == ac ? this.itsme : "";
          return {
            label: ac,
            sublabel: sublabel,
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
      if (this.accountnames.length) {
        this.profiles = await this.$profiles.getProfiles(this.accountnames);
      }
    },
    updateSelected(v) {
      let old = this.selected;
      this.selected = v;
      this.$emit("change", { new: this.selected, old: old });
      this.$emit("input", this.selected);
    }
  },
  async mounted() {
    await this.getAvatars();
  },
  watch: {
    accountnames: function() {
      this.getAvatars();
    },
    value: function(v) {
      this.selected = v;
    }
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
.itsmeclass {
  filter: grayscale(90%);
}
</style>
