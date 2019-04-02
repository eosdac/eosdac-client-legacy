<template>
  <div>
    <q-btn
      v-if="!firehose_active"
      @click="start"
      label="start firehose"
      color="primary"
    />
    <q-btn v-else @click="stop" label="stop firehose" color="primary" />
  </div>
</template>

<script>
var FIREHOSE = null;
import { FirehoseClient } from "../../modules/firehose-client.js";
import { Notify } from "quasar";
import { mapGetters } from "vuex";

export default {
  name: "firehose",
  data() {
    return {
      firehose_active: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName",
      getSettingByName: "user/getSettingByName"
    })
  },
  methods: {
    stop() {
      FIREHOSE.close();
      FIREHOSE = null;
      this.firehose_active = false;
    },
    async start() {
      if (FIREHOSE !== null) {
        console.log("firehose already started");
        return;
      }
      console.log("starting firehose...");
      const api = await this.$store.dispatch("global/getEosApi");

      FIREHOSE = new FirehoseClient(
        { server: this.$configFile.get("firehoseapi") },
        api.eosapi
      );

      FIREHOSE.ready(firehose => {
        this.firehose_active = true;
        firehose
          .request("action_trace", {
            code: this.$configFile.get("custodiancontract"),
            name: "votecust"
          })
          .request("contract_row", {
            code: this.$configFile.get("custodiancontract"),
            table: "candidates"
          });
      }).callback((type, data) => {
        if (type == "contract_row") {
          console.log("contract_row", data);
          this.$store.commit("dac/setCandidateVote", {
            candidate_name: data.data.candidate_name,
            total_votes: data.data.total_votes
          });
        }
        if (this.getSettingByName("notify_dac_msg").value) {
          if (type == "action_trace" && data.name == "votecust") {
            Notify.create({
              message: `${data.data.voter} has casted new votes`,
              timeout: 0, // in milliseconds; 0 means no timeout
              color: "primary",
              icon: "icon-dac-balance",
              detail: data.data.newvotes.join(", "),
              position: "bottom-left", // 'top', 'left', 'bottom-left' etc.
              closeBtn: true // or string as button message e.g. 'dismiss'
            });
          }
        }
      });
    }
  },
  mounted() {}
};
</script>

<style></style>
