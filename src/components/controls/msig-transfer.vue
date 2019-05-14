<template>
  <div class="row gutter-sm">
    <div class="col-xs-12">
      <div>
        <q-field
          :error="$v.form.title.$error"
          error-label="Title is required and can't be longer then 230 chars"
        >
          <q-input
            stack-label="Title"
            v-model="form.title"
            :dark="getIsDark"
            @input="$v.form.title.$touch()"
          />
        </q-field>
      </div>
    </div>

    <div class="col-xs-12">
      <div>
        <q-field
          :error="$v.form.description.$error"
          error-label="Description is required and can't be longer then 900 chars"
        >
          <q-input
            class="no-padding"
            stack-label="Description"
            v-model="form.description"
            :dark="getIsDark"
            @input="$v.form.description.$touch()"
          />
        </q-field>
      </div>
    </div>

    <div class="col-xs-12 col-lg-6">
      <div>
        <q-field
          :error="$v.form.from.$error"
          error-label="Select a from account"
        >
          <q-select
            class="no-padding"
            v-model="form.from"
            stack-label="From"
            color="primary-light"
            :dark="getIsDark"
            :options="
              from_accounts.map(fa => {
                return { value: fa, label: fa };
              })
            "
          />
        </q-field>
      </div>
    </div>

    <div class="col-xs-12 col-lg-6">
      <div>
        <q-field
          :error="$v.form.to.$error"
          error-label="Please enter a valid accountname"
        >
          <q-input
            class="no-padding"
            stack-label="To"
            v-model.trim="form.to"
            :dark="getIsDark"
            @input="$v.form.to.$touch()"
          >
            <q-autocomplete
              :dark="getIsDark"
              @search="getAccountSuggestions"
              :min-characters="3"
              :delay="0"
              :max-results="7"
            />
          </q-input>
        </q-field>
      </div>
    </div>

    <div class="col-xs-12 col-lg-6">
      <div>
        <q-field
          :error="$v.form.asset.amount.$error"
          error-label="Please enter a valid pay amount"
        >
          <div class="row no-wrap items-end">
            <q-input
              class="full-width no-padding"
              type="number"
              :decimals="form.asset.precision"
              stack-label="Quantity"
              v-model="form.asset.amount"
              :dark="getIsDark"
              @input="$v.form.asset.amount.$touch()"
            />
            <div class="q-ml-xs">{{ form.asset.symbol }}</div>
          </div>
        </q-field>
      </div>
    </div>

    <div class="col-xs-12 col-lg-6">
      <div>
        <q-field
          class="no-padding"
          :error="$v.form.memo.$error"
          error-label="Memo can't be longer then 255 chars."
        >
          <q-input
            stack-label="Memo"
            v-model="form.memo"
            :dark="getIsDark"
            class="no-padding"
          />
        </q-field>
      </div>
    </div>

    <div class="col-xs-12">
      <div class="row justify-end">
        <q-btn color="primary" label="add" @click="processInputs" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { required, maxLength } from "vuelidate/lib/validators";
import { isEosName } from "../../modules/validators.js";
export default {
  name: "msigTransfer",
  components: {},
  props: {
    symbol: {
      type: String,
      default: "EOS"
    },
    decimals: {
      type: Number,
      default: 4
    },
    from_accounts: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      form: {
        from: "",
        to: "",
        asset: {
          symbol: "EOS",
          precision: 4,
          contract: "eosio.token",
          amount: ""
        },
        memo: "",
        title: "",
        description: ""
      }
    };
  },
  computed: {
    ...mapGetters({
      getIsDark: "ui/getIsDark",
      getAccountName: "user/getAccountName",
      getAccount: "user/getAccount",
      getEosApi: "global/getEosApi"
    })
  },
  methods: {
    processInputs() {
      this.$v.$touch();
      if (this.$v.$error) {
        return;
      }
      let formdata = JSON.parse(JSON.stringify(this.form));
      formdata.asset.amount = parseFloat(formdata.asset.amount).toFixed(
        formdata.asset.precision
      );
      this.$emit("onsubmit", formdata);
      this.clearForm();
    },
    clearForm() {
      this.form = {
        from: "",
        to: "",
        asset: {
          symbol: "EOS",
          precision: 4,
          contract: "eosio.token",
          amount: ""
        },
        memo: "",
        title: "",
        description: ""
      };
      this.$v.$reset();
      this.edit_flag = false;
    },
    setFormFieldsEdit(data) {
      //make clone

      let cloned = JSON.parse(JSON.stringify(data));
      this.form = cloned;
    },
    async getAccountSuggestions(terms, done) {
      let accounts = await this.getEosApi.eos.get_table_rows({
        json: true,
        code: "eosio",
        scope: "eosio",
        table: "voters",
        lower_bound: terms,
        limit: 7
      });
      accounts = accounts.rows.map(a => {
        return { label: a.owner, value: a.owner, icon: "person" };
      });
      done(accounts);
    }
  },

  validations() {
    return {
      form: {
        from: { required, isEosName },
        to: { required, isEosName },
        asset: {
          amount: { required },
          symbol: { required }
        },
        memo: { maxLength: maxLength(255) },
        title: { required, maxLength: maxLength(230) },
        description: { required, maxLength: maxLength(900) }
      }
    };
  }
};
</script>

<style></style>
