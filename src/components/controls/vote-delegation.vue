<template>
  <div v-if="getAccountName && wpcats.length">
    <!-- <div class="bg-bg1 round-borders shadow-5 q-pa-md q-mb-md">
      My Category Delegations
    </div> -->
    <div
      class="relative-position bg-bg1 bg-logo q-pa-md round-borders shadow-5"
    >
      <div class="row gutter-sm ">
        <div
          class="col-xs-12 col-md-6 col-xl-4"
          v-for="(cat, i) in wpcats"
          :key="`wpcat${i}`"
        >
          <q-item
            class=" bg-bg2 q-pa-md round-borders full-height animate-pop "
          >
            <q-item-main>
              <q-icon
                v-if="
                  getAccountName &&
                    cat.delegatee &&
                    getAccountName != cat.delegatee
                "
                :name="$configFile.icon.check"
                size="24px"
                color="positive"
                class="q-pa-sm absolute-top-right"
              />
              <q-item-tile class="text-text1" label>{{
                $t(`wp_categories.${cat.label}`)
              }}</q-item-tile>
              <div class="q-caption text-text2 q-my-xs">
                {{ $t(`wp_categories.${cat.desc}`) }}
              </div>
              <member-select
                itsme="UNDELEGATE"
                @change="handleCatDelegation(cat.value, $event)"
                v-model="cat.delegatee"
                :accountnames="getCustNames"
                placeholder="Select to Delegate"
              />
            </q-item-main>
          </q-item>
        </div>
      </div>
    </div>
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
      getAuth: "user/getAuth",
      getCatDelegations: "user/getCatDelegations"
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
    async setWpCats(force_reload = false) {
      let mycatvotes;
      if (!this.getCatDelegations || force_reload) {
        mycatvotes = await this.$store.dispatch(
          "user/fetchCatDelegations",
          this.getAccountName
        );
        console.log("my catvotes", mycatvotes);
      } else {
        mycatvotes = this.getCatDelegations;
        console.log("my stored catvotes", mycatvotes);
      }

      this.wpcats = JSON.parse(JSON.stringify(wpcats)).map(wpc => {
        let checkdelegation = mycatvotes.find(
          cv => cv.category_id == wpc.value
        );
        if (checkdelegation) {
          wpc.delegatee = checkdelegation.delegatee;
        } else {
          wpc.delegatee = this.getAccountName;
        }

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
          delegatee_custodian: delegatee.new,
          dac_scope: this.$configFile.get("dacscope")
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
          dac_scope: this.$configFile.get("dacscope")
        }
      };

      if (this.getAccountName === delegatee.new) {
        actions.push(undelegate);
      } else {
        actions.push(delegate);
      }

      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
      } else {
        this.wpcats.find(w => w.value == cat_id).delegatee = delegatee.old;
      }
    }
  },

  mounted() {
    if (this.getAccountName) {
      this.setWpCats(true);
    }
  },
  watch: {
    getAccountName: function() {
      this.setWpCats(true);
    }
  }
};
</script>

<style></style>
