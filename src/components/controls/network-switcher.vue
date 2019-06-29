<template>
  <div>
    <q-select
      v-model="selected_network"
      :dark="getIsDark"
      stack-label="Select network"
      color="primary"
      :options="network_options"
      @input="switchNetwork($event)"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
      disable: false,
      selected_network: this.$store.state.global.active_network
    };
  },
  computed: {
    ...mapGetters({
      getActiveNetwork: "global/getActiveNetwork",
      getActiveNetworkName: "global/getActiveNetworkName",
      getNetworks: "global/getNetworks",
      getIsDark: "ui/getIsDark"
      // getCustodians: 'dac/getCustodians',
    }),
    network_options() {
      if (!this.getNetworks) return [];
      return this.getNetworks.map(netw => {
        return { value: netw.name, label: netw.name };
      });
    }
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
@import '~variables';
</style>
