<template>
  <q-page class="q-pa-md">
    <q-tabs class="q-mb-md" @select="setActiveTab">
      <q-tab
        slot="title"
        name="pending_approval"
        label="pending approval 0"
        default
      />
      <q-tab slot="title" name="approved" label="Approved 3" />
      <q-tab slot="title" name="work_in_progress" label="work in progress 1" />
      <q-tab slot="title" name="pending_claim" label="Pending claim 2" />
      <q-tab slot="title" name="claimable" label="claimable 4" />
      <q-tab slot="title" name="claimed" label="completed 101" />
      <q-tab slot="title" name="cancelled" label="cancelled 100" />
    </q-tabs>

    <div
      class="row bg-bg1 q-pa-md q-mb-md shadow-4 round-borders justify-between"
      v-if="true"
    >
      <q-search
        :dark="getIsDark"
        color="primary"
        v-model="filter"
        :placeholder="$t('vote_custodians.search')"
      />
      <div class="row inline items-center q-mt-sm" style="font-size:12px;">
        <span>{{ $t("vote_custodians.rows_per_page") }}:</span>
        <q-select
          class="q-ml-sm"
          style="width:45px;"
          hide-underline
          v-model="pagination.items_per_page"
          :dark="getIsDark"
          :options="[
            { label: '1', value: 1 },
            { label: '4', value: 4 },
            { label: '8', value: 8 },
            { label: '16', value: 16 },
            { label: '24', value: 24 },
            { label: '48', value: 48 }
          ]"
        />
        <q-pagination
          color="primary-light"
          v-show="true"
          v-model="pagination.page"
          :min="1"
          :max="pagination.max"
          :max-pages="6"
          direction-links
          size="12px"
        />
      </div>
    </div>

    <div v-if="wps.length" class="row gutter-sm">
      <div class="col-xs-12 col-xl-6" v-for="(wp, i) in wps" :key="`wp${i}`">
        <wp-proposal
          :read_only="!getIsCustodian"
          :wp="wp"
          :array_index="i"
          @wp_expand="
            expanded_modal_index = Number($event);
            expanded_modal = true;
          "
          @delete="wps.splice(i, 1)"
        />
      </div>
    </div>
    <div
      v-else
      class="text-text2 bg-bg1 bg-logo q-pa-md round-borders shadow-4 capitalize"
    >
      <span v-if="loading" class="row items-center">
        <q-spinner class="on-left" color="primary-light" />Loading
      </span>
      <span v-else>No proposals available</span>
    </div>

    <q-modal maximized v-model="expanded_modal">
      <q-carousel
        color="text2"
        height="100%"
        quick-nav
        :quick-nav-icon="$configFile.icon.dactoken"
        quick-nav-position="top"
        arrows
        v-model="expanded_modal_index"
      >
        <q-carousel-slide
          class="no-padding "
          v-for="(wp, i) in wps"
          :key="`exp${i}`"
        >
          <div class="full-height bg-bg2">
            <div class=" text-text1" style="padding-top:38px; height:100%;">
              <wp-proposal
                :wp="wp"
                :expanded="true"
                @wp_compress="expanded_modal = false"
              />
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-modal>
  </q-page>
</template>

<script>
import wpProposal from "components/ui/wp-proposal";
import { mapGetters } from "vuex";
const stateEnum = require("../../modules/wp_state_enum.js");

export default {
  name: "ReviewWP",
  components: {
    wpProposal
  },
  data() {
    return {
      loading: false,
      expanded_modal: false,
      expanded_modal_index: 0,
      wps: [],
      active_tab: "",
      pagination: {
        page: 1,
        max: 1,
        items_per_page: 8
      },
      filter: ""
    };
  },
  computed: {
    ...mapGetters({
      getWpConfig: "dac/getWpConfig",
      getIsCustodian: "user/getIsCustodian",
      getIsDark: "ui/getIsDark",
      getAccountName: "user/getAccountName"
    })
  },
  methods: {
    async fetchWps(query) {
      this.loading = true;
      let res = await this.$store.dispatch("dac/fetchWorkerProposals", query);
      console.log(res);
      if (res.results) {
        this.wps = res.results;
        this.pagination.max = Math.ceil(
          res.count / this.pagination.items_per_page
        );
      }
      this.loading = false;
    },
    setActiveTab(tab) {
      //setting the active tab will trigger a watcher
      this.active_tab = tab;
    },
    managePagination() {
      let skip = (this.pagination.page - 1) * this.pagination.items_per_page;
      //make request
      this.fetchWps({
        status: stateEnum[this.active_tab],
        skip: skip,
        limit: this.pagination.items_per_page,
        proposer: this.getAccountName
      });
    }
  },

  created() {
    if (this.getWpConfig.service_account === null) {
      this.$store.dispatch("dac/fetchWpConfig");
    }
  },
  watch: {
    active_tab: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        //double check the tab has been changed

        if (this.pagination.page == 1) {
          this.managePagination();
        } else {
          this.pagination.page = 1; //this will trigger the watcher below
        }
      }
    },

    "pagination.items_per_page": function(newVal, oldVal) {
      this.managePagination();
    },

    "pagination.page": function(newVal, oldVal) {
      this.managePagination();
    }
  }
};
</script>
