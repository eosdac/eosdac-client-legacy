<template>
  <div
    v-if="loaded"
    class="profile_image relative-position animate-fade"
    style="height:65px; width:65px;"
    v-bind:style="style"
  >
    <div v-if="show_role" style="position:absolute;bottom:-10px;right:-10px;">
      <q-icon
        v-if="is_custodian"
        size="34px"
        color="warning"
        :name="$configFile.icon.cust_symbol"
      />
    </div>
  </div>
  <div
    v-else
    v-bind:style="preloaderStyle"
    style="height:65px; width:65px;"
    class="row justify-center items-center"
  >
    <q-spinner size="30px" color="primary-light" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "profilePic",
  props: {
    accountname: "",
    scale: Number,
    show_role: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      profilePic: "",
      loaded: false
    };
  },

  computed: {
    ...mapGetters({
      getCustodians: "dac/getCustodians"
    }),
    style() {
      let style = {
        transform: `scale(${this.scale})`,
        "background-image": `url(${this.profilePic})`
      };
      if (this.border) {
        style["border"] = "2px solid var(--q-color-text2)";
      }
      return style;
    },
    preloaderStyle() {
      return {
        transform: `scale(${this.scale})`
      };
    },

    is_custodian() {
      if (this.getCustodians) {
        return this.getCustodians.find(c => c.cust_name == this.accountname);
      } else {
        return false;
      }
    }
  },
  methods: {
    async setProfilePic() {
      this.loaded = false;
      let p = await this.$profiles.getAvatars([this.accountname]);
      this.profilePic = p[0].image;

      let preloaderImg = document.createElement("img");
      preloaderImg.src = this.profilePic;
      preloaderImg.addEventListener("load", event => {
        this.loaded = true;
        preloaderImg = null;
      });
      setTimeout(() => {
        if (this.loaded == false) {
          this.profilePic = this.$profiles.default_avatar;
          this.loaded = true;
          preloaderImg = null;
        }
      }, 3000);
    }
  },
  mounted() {
    this.setProfilePic();
  },
  watch: {
    accountname: function() {
      this.setProfilePic();
    }
  }
};
</script>

<style></style>
