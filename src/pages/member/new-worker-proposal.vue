<template>
  <q-page class="q-pa-md">
    <!-- content -->

    <div class="bg-bg1 round-borders shadow-5 q-pa-md bg-logo">
      <div class="text-text1 q-title q-mb-md">Submit Worker Proposal</div>
      <div class="q-mb-md text-text2">
        Please fill in the form to explain your worker proposal. There need to
        be more text here to guide the potential worker.
      </div>
      <div class="row gutter-md">
        <div class="col-xs-12 col-lg-8">
          <q-field
            :error="$v.wp_data.title.$error"
            error-label="A title is required"
          >
            <q-input
              type="text"
              stack-label="Title"
              color="primary-light"
              :dark="getIsDark"
              v-model="wp_data.title"
            />
          </q-field>
        </div>
        <div class="col-xs-12 col-lg-4">
          <q-field
            :error="$v.wp_data.category.$error"
            error-label="Please select a category"
          >
            <q-select
              color="primary-light"
              v-model="wp_data.category"
              :dark="getIsDark"
              stack-label="Category"
              :options="getWpCategoriesOptions"
            />
          </q-field>
        </div>
        <div class="col-xs-12 col-lg-6">
          <q-field
            :error="$v.wp_data.pay_amount.$error"
            error-label="Please enter a valid pay amount"
            icon="icon-ui-19"
          >
            <div class="row no-wrap">
              <q-input
                class="full-width"
                type="number"
                stack-label="Pay Amount"
                color="primary-light"
                :dark="getIsDark"
                v-model="wp_data.pay_amount"
              />
              <q-select
                stack-label="&nbsp"
                hide-underline
                v-model="wp_data.symbol"
                :dark="getIsDark"
                color="primary-light"
                :options="
                  allowed_currencies.map(c => {
                    return { label: c.symbol, value: c.symbol };
                  })
                "
              />
            </div>
          </q-field>
        </div>
        <div class="col-xs-12 col-lg-6">
          <q-field
            :error="$v.wp_data.arbitrator.$error"
            error-label="Fill in a valid accountname"
            icon="mdi-teach"
          >
            <div class="row no-wrap">
              <q-input
                class="full-width"
                type="text"
                stack-label="Arbitrator"
                color="primary-light"
                :dark="getIsDark"
                v-model="wp_data.arbitrator"
              />

              <help-btn
                title="Arbitrator"
                content="An arbitrator is a crazy person..."
              />
            </div>
          </q-field>
        </div>
      </div>

      <div class="q-caption q-mb-xs q-mt-md">Description</div>
      <MarkdownViewer
        :tags="[
          'h1',
          'h2',
          'h3',
          'italic',
          'bold',
          'underline',
          'strikethrough',
          'subscript',
          'superscript',
          'anchor',
          'orderedlist',
          'unorderedlist'
        ]"
        :edit="true"
        :dark="getIsDark"
        :text="wp_data.summary"
        v-on:update="updateText"
      />

      <div class="row justify-end q-mt-md">
        <q-btn
          label="submit"
          color="primary"
          @click="submitProposal"
          class="animate-pop"
        />
      </div>
    </div>

    <debug-data
      :data="[
        {
          wp_data: wp_data
        }
      ]"
    />
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import debugData from "components/ui/debug-data";
import MarkdownViewer from "components/ui/markdown-viewer";
import helpBtn from "components/controls/help-btn";
import { required, minValue } from "vuelidate/lib/validators";
const isEosName = accountname => {
  const re = /^[a-z1-5.]{1,12}$/;
  return re.test(accountname);
};

export default {
  name: "newWorkerProposal",

  components: {
    helpBtn,
    MarkdownViewer,
    debugData
  },
  data() {
    return {
      allowed_currencies: [
        {
          symbol: this.$configFile.get("systemtokensymbol"),
          contract: this.$configFile.get("systemtokencontract")
        },
        {
          symbol: this.$configFile.get("dactokensymbol"),
          contract: this.$configFile.get("tokencontract")
        }
      ],
      wp_data: {
        title: "",
        summary: "",
        arbitrator: "",
        pay_amount: "",
        category: "",
        symbol: this.$configFile.get("systemtokensymbol")
      }
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName",
      getIsDark: "ui/getIsDark",
      getSettingByName: "user/getSettingByName",
      getWpCategories: "dac/getWpCategories"
    }),
    getWpCategoriesOptions: function() {
      return this.getWpCategories.map(wpc => {
        wpc.label = this.$t(`wp_categories.${wpc.label}`);
        return wpc;
      });
    }
  },
  methods: {
    updateText(val) {
      this.wp_data.summary = val;
    },
    async submitProposal() {
      this.$v.wp_data.$touch();

      if (this.$v.wp_data.$error) {
        this.$q.notify("Please review fields again.");
        return;
      }
      let extended_asset = {
        quantity: `${Number(this.wp_data.pay_amount).toFixed(4)} ${
          this.wp_data.symbol
        }`,
        contract: this.allowed_currencies.find(
          ac => ac.symbol == this.wp_data.symbol
        ).contract
      };
      let actions = [
        {
          account: this.$configFile.get("wpcontract"),
          name: "createprop",
          data: {
            proposer: this.getAccountName,
            title: this.wp_data.title,
            summary: this.wp_data.summary,
            arbitrator: this.wp_data.arbitrator,
            pay_amount: extended_asset,
            content_hash: "00000000000000000000000000000000",
            id: this.$helper.randomIntFromInterval(1, 999999999999999999),
            category: this.wp_data.category,
            dac_scope: "dacauthority" //WARNING HARDCODED NEED TO FETCH FROM CONFIG XXXXXXXXXXXXXXXXXXXXX
          }
        }
      ];
      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        // this.$store.commit('user/setIsCandidate', false );
        console.log(result);
      }
    }
  },

  validations: {
    wp_data: {
      arbitrator: { required, isEosName },
      title: { required },
      pay_amount: {
        required,
        minValue: minValue(0)
      },
      category: { required }
    }
  }
};
</script>

<style></style>
