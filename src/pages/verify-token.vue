<template>
  <q-page class="text-text2 q-pa-md">
    <!-- <pre>{{actor}} {{getAccountName}}</pre> -->
    <h4 class="q-display-1 q-mb-sm q-mt-none">
      {{ $t("verify_token.title") }}
    </h4>

    <div
      v-if="enable_gui"
      class="q-pa-md bg-bg1 bg-logo shadow-5 round-borders"
    >
      <p class="text-text2">{{ $t("verify_token.description") }}</p>
      <div class="row justify-start full-width">
        <div style="display:inline-block;" class="bg-primary q-pa-sm">
          {{ $t("verify_token.token") }}:
        </div>
        <div
          style="width:50%;max-width:500px;display:inline-block;"
          class="bg-bg2 q-pa-sm"
        >
          <div style="overflow:hidden">{{ token }}</div>
        </div>
        <div
          class="bg-bg2 q-pa-sm cursor-pointer"
          style="display:inline-block"
          @click="copyToClipboard"
        >
          <q-icon style="margin-top:-3px" name="file_copy" />
        </div>
        <span
          v-if="copied_to_clipboard_msg != null"
          class="q-pa-sm animate-fade q-caption text-text2"
          >{{ copied_to_clipboard_msg }}</span
        >
      </div>
      <div class="row justify-end q-mt-md">
        <q-btn
          :label="$t('verify_token.validate')"
          color="primary"
          @click="sign_message"
        />
      </div>
    </div>

    <div
      v-if="!enable_gui"
      class="q-pa-md bg-bg1 shadow-5 round-borders text-text2"
    >
      Please login <span class="text-bold text-text1">{{ actor }}</span> to
      verify your token.
    </div>

    <input
      id="token_to_verify"
      style="position:absolute;left:-9999px"
      :value="token"
    />
  </q-page>
</template>

<script>
import { Notify } from "quasar";
import { mapGetters } from "vuex";

export default {
  name: "verify_token",
  components: {},
  data() {
    return {
      loading: false,
      loadingText: "",
      token: null,
      actor: undefined,
      copied_to_clipboard_msg: null
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName"
    }),

    enable_gui() {
      let enabled = false;
      if (this.getAccountName && this.actor == this.getAccountName) {
        enabled = true;
      }
      if (this.getAccountName && !this.actor) {
        enabled = true;
      }
      return enabled;
    }
  },
  methods: {
    init() {
      let [token, actor] = this.$route.params.token.split(":");
      this.token = token;
      this.actor = actor;
    },

    async sign_message() {
      let actions = [
        {
          account: this.$configFile.get("botcontract"),
          name: "pair",
          data: {
            token: this.token
          }
        }
      ];

      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        Notify.create({
          message: `Go back to discord`,
          detail: `type the command $verify`,
          timeout: 3000,
          type: "info",
          position: "bottom-right"
        });
      }
    },

    copyToClipboard: function() {
      var copyText = document.getElementById("token_to_verify");
      copyText.select();
      document.execCommand("copy");
      this.copied_to_clipboard_msg = this.$t(
        "verify_token.copied_to_clipboard"
      );
      setTimeout(() => (this.copied_to_clipboard_msg = null), 1500);
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    $route: function() {
      this.init();
    }
  }
};
</script>

<style></style>
