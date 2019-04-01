<template>
  <div
    v-if="loaded"
    class="profile_image relative-position animate-fade"
    style="height:65px; width:65px;"
    v-bind:style="style"
  >
    <div
      v-if="is_custodian"
      style="position:absolute;bottom:-10px;right:-10px;"
    >
      <q-icon
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
import { mapGetters } from 'vuex';

export default {
  name: 'profilePic',
  props: {
    accountname: '',
    scale: Number
  },

  data() {
    return {
      profilePic: '',
      loaded: false
    };
  },

  computed: {
    ...mapGetters({
      getCustodians: 'dac/getCustodians'
    }),
    style() {
      return {
        transform: `scale(${this.scale})`,
        'background-image': `url(${this.profilePic})`
      };
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

      let preloaderImg = document.createElement('img');
      preloaderImg.src = this.profilePic;
      preloaderImg.addEventListener('load', event => {
        this.loaded = true;
        preloaderImg = null;
      });
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

<style>
/* #profilepic{
  width:50px;
  height:50px;
  background-color:blue;
}
.loading {
  opacity: 0;
  transition: opacity .4s ease-out;
}

.loaded {
  opacity: 1;
} */
</style>
