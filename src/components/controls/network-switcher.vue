<template>
  <div>
    <q-btn
      :disable="disable"
      v-if="getActiveNetworkName != 'jungle'"
      label="switch to jungle"
      @click="switchNetwork('jungle')"
      color="primary"
    />
    <q-btn
      :disable="disable"
      v-if="getActiveNetworkName != 'mainnet'"
      label="switch to mainnet"
      @click="switchNetwork('mainnet')"
      color="primary"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Dialog } from "quasar";
import { Notify } from "quasar";

export default {
  name: "networkSwitcher",
  props: {
    enable_pin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      disable: false
    };
  },
  computed: {
    ...mapGetters({
      getActiveNetwork: "global/getActiveNetwork",
      getActiveNetworkName: "global/getActiveNetworkName"
      // getCustodians: 'dac/getCustodians',
    })
  },
  methods: {
    async switchNetwork(networkname) {
      this.disable = true;

      if (!this.enable_pin) {
        await this.$store.dispatch("global/switchNetwork", {
          networkname: networkname,
          vm: this
        });
        this.disable = false;
        return;
      }

      this.$q
        .dialog({
          title: `Switching To ${networkname}`,
          message: `Please enter pin code`,
          prompt: {
            model: "",
            type: "number" // optional
          },
          cancel: true,
          color: "primary-light"
        })
        .then(async input_data => {
          if (input_data == "1234") {
            await this.$store.dispatch("global/switchNetwork", {
              networkname: networkname,
              vm: this
            });
          } else {
            this.nofify_wrong_pin();
          }
        })
        .catch(() => {
          //cancel msg
        });

      this.disable = false;
    },

    nofify_wrong_pin() {
      Notify.create({
        message: `Wrong pin`,
        timeout: 1500, // in milliseconds; 0 means no timeout
        type: "negative",
        detail: `You need a pin for swwitching networks.`,
        position: "bottom-right" // 'top', 'left', 'bottom-left' etc.
      });
    }
  }
};
</script>

<style lang="stylus">
@import '~variables'

.modal-content{
  background-color: var(--q-color-warning);

}
</style>
