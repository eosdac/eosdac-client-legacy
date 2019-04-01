<template>
  <div>
    <div
      class="animate-fade"
      style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:99999"
      v-if="getShowTransactionOverlay"
    >
      <div class="row justify-end q-pa-md">
        <q-btn
          round
          class="animate-pop"
          color="primary"
          icon="close"
          @click="close()"
        />
      </div>

      <div class="fixed-center">
        <div class="text-center " style="height:80px">
          <div v-if="getShowTransactionOverlay == 'loading'">
            <q-icon
              style="height:80px"
              name="vertical_align_bottom"
              color="primary-light"
              class="animate-bounce animate-fade"
              size="50px"
            />
            <div class=" text-white animate-fade" style="height:50px">
              loading
            </div>
          </div>

          <div v-if="getShowTransactionOverlay == 'sign'">
            <q-icon
              style="height:80px"
              name="vpn_key"
              color="primary-light"
              class="animate-bounce animate-fade"
              size="50px"
            />
            <div class=" text-white animate-fade" style="height:25px">
              waiting for signature
            </div>
            <div
              v-if="getSettingByName('trx_delay').value"
              class="q-caption text-text2"
            >
              <q-icon name="mdi-alarm" style="margin-right:3px" />
              <span
                >delay {{ getSettingByName('trx_delay').value }} seconds</span
              >
            </div>
          </div>

          <div v-if="getShowTransactionOverlay == 'success'">
            <q-icon
              style="height:80px"
              name="check_circle_outline"
              color="positive"
              class="animate-scale"
              size="70px"
            />
            <div class=" text-white animate-fade" style="height:50px">
              Transaction success
            </div>
            <!-- <div v-if="getLastTransaction" class="text-white animate-pop q-body-1" style="height:50px">{{getLastTransaction.transaction_id}}</div> -->
          </div>

          <div v-if="getShowTransactionOverlay == 'cancelled'">
            <q-icon
              style="height:80px"
              name="error_outline"
              color="negative"
              class="animate-scale"
              size="70px"
            />
            <div class=" text-white animate-fade" style="height:50px">
              Transaction cancelled
            </div>
          </div>

          <div v-if="getShowTransactionOverlay == 'error'">
            <q-icon
              style="height:80px"
              name="error_outline"
              color="negative"
              class="animate-scale"
              size="70px"
            />
            <div class=" text-white animate-fade" style="height:50px">
              Transaction cancelled
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'TransactionOverlay',
  components: {},
  data() {
    return {
      message: ''
    };
  },
  computed: {
    ...mapGetters({
      getShowTransactionOverlay: 'ui/getShowTransactionOverlay',
      getLastTransaction: 'user/getLastTransaction',
      getSettingByName: 'user/getSettingByName'
      // getTransactionDelay: 'usersettings/getTransactionDelay'
    })
  },

  methods: {
    close(delay = 0) {
      setTimeout(() => {
        this.$store.commit('ui/setShowTransactionOverlay', false);
      }, delay);
    }
  },
  created() {
    // this.$root.$on('showloader', this.close)
  },

  watch: {
    getShowTransactionOverlay(v) {
      switch (v) {
        case 'cancelled':
          this.close(1500);
          break;
        case 'error':
          this.close(1500);
          break;
        case 'success':
          this.close(1500);
          break;
      }
    }
  }
};
</script>

<style></style>
