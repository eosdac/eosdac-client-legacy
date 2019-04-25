<template>
  <q-item class="memberselector no-padding">
    <q-item-side left v-if="show_selected" style="height:40px">
      <profile-pic
        style="margin-top:-10px; margin-left:-8px"
        :border="false"
        :show_role="false"
        :class="{ itsmeclass: checkItsMe }"
        :accountname="selected"
        :scale="0.69"
      />
    </q-item-side>
    <q-item-main>
      <q-select
        :dark="getIsDark"
        :placeholder="placeholder"
        color="primary-light"
        :stack-label="label"
        :value="selected"
        :options="getOptions"
        @change="updateSelected"
        :hide-underline="!underline"
      ></q-select>
    </q-item-main>
  </q-item>
</template>

<script>
import { mapGetters } from "vuex";
import profilePic from "components/ui/profile-pic";
export default {
  name: "memberSelect",
  components: {
    profilePic
  },
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
    },
    show_selected: {
      type: Boolean,
      default: true
    },
    underline: {
      type: Boolean,
      default: true
    },
    label: {
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
      getAccountName: "user/getAccountName",
      getIsDark: "ui/getIsDark"
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

<style lang="stylus">
 @import '~variables'
.q-item-image{
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
