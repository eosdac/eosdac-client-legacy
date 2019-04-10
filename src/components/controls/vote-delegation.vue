<template>
  <div
    v-if="getAccountName"
    class="relative-position bg-bg1 q-pa-md round-borders shadow-5"
  >
    <div class="row gutter-md ">
      <div
        class="col-xs-12 col-lg-6"
        v-for="(cat, i) in wpcats"
        :key="`wpcat${i}`"
      >
        <q-item class="no-padding">
          <q-item-main>
            <q-item-tile class="text-text2" label>{{
              $t(`wp_categories.${cat.label}`)
            }}</q-item-tile>
            <member-select
              @change="handleCatDelegation(cat.value, $event)"
              v-model="cat.delegatee"
              :accountnames="getCustNames"
              placeholder="Select to Delegate"
            />
          </q-item-main>
        </q-item>
      </div>
    </div>
    <!-- <div class="row justify-end q-mt-md">
      <q-btn label="test" color="primary" @click="delegateVotes" />
    </div> -->
  </div>
</template>

<script>
import memberSelect from "components/controls/member-select";
import wpcats from "../../extensions/statics/config/wp_categories.json";
import { mapGetters } from "vuex";
export default {
  // name: 'ComponentName',
  components: {
    memberSelect
  },
  data() {
    return {
      wpcats: []
    };
  },
  computed: {
    ...mapGetters({
      getCustodians: "dac/getCustodians",
      getAccountName: "user/getAccountName",
      getIsDark: "ui/getIsDark",
      getAuth: "user/getAuth"
    }),
    getCustNames() {
      if (this.getCustodians) {
        return this.getCustodians.map(c => {
          return c.cust_name;
        });
      } else {
        return [];
      }
    }
  },
  methods: {
    setWpCats() {
      this.wpcats = JSON.parse(JSON.stringify(wpcats)).map(wpc => {
        wpc.delegatee = this.getAccountName;
        return wpc;
      });
    },
    async handleCatDelegation(cat_id, delegatee) {
      let actions = [];

      let delegate = {
        account: this.$configFile.get("wpcontract"),
        name: "delegatecat",
        authorization: [
          { actor: this.getAccountName, permission: this.getAuth },
          {
            actor: this.$configFile.get("authaccountname"),
            permission: "one"
          }
        ],
        data: {
          custodian: this.getAccountName,
          category: cat_id,
          dalegatee_custodian: delegatee,
          dac_scope: "dacauthority"
        }
      };
      let undelegate = {
        account: this.$configFile.get("wpcontract"),
        name: "undelegateca",
        authorization: [
          { actor: this.getAccountName, permission: this.getAuth },
          {
            actor: this.$configFile.get("authaccountname"),
            permission: "one"
          }
        ],
        data: {
          custodian: this.getAccountName,
          category: cat_id,
          dac_scope: "dacauthority"
        }
      };

      if (this.getAccountName === delegatee) {
        actions.push(undelegate);
      } else {
        actions.push(delegate);
      }

      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
      }
    }
  },

  created() {
    console.log(this.getCustodians);
    this.setWpCats();
  }
};
</script>

<style></style>
