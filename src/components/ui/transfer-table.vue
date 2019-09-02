<template>
  <div class="round-borders shadow-4">
    <q-table
      ref="table"
      class="bg-bg1 "
      color="primary-light"
      :dark="getIsDark"
      :rows-per-page-options="[3, 5, 7, 10, 20, 50, 100]"
      :title="title"
      :data="serverData"
      :columns="columns"
      :filter="filter"
      row-key="name"
      :pagination.sync="serverPagination"
      :loading="loading"
      @request="request"
    >
      <q-td slot="body-cell-from" slot-scope="props" :props="props">
        {{ props.value }}
        <!-- <router-link :to="{ path: '/account/' + props.value }">{{
          props.value
        }}</router-link> -->
      </q-td>

      <q-td slot="body-cell-to" slot-scope="props" :props="props">
        {{ props.value }}
        <!-- <router-link :to="{ path: '/account/' + props.value }">{{
          props.value
        }}</router-link> -->
      </q-td>

      <q-td slot="body-cell-trx_id" slot-scope="props" :props="props">
        <a
          target="_blank"
          :href="$configFile.get('explorer') + `/transaction/${props.value}`"
        >
          {{ $helper.truncate(props.value, 10) }}
        </a>
      </q-td>

      <template slot="top-right" slot-scope="props">
        <q-search hide-underline v-model.trim="filter" />
        <q-btn
          flat
          round
          dense
          color="brand"
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        />
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
var IntlRelativeFormat = require("intl-relativeformat");
// if (!global.Intl) {
//   global.Intl = require("intl"); // polyfill for `Intl`
// }
var rf = new IntlRelativeFormat("en");
export default {
  name: "TransferTable",
  data() {
    return {
      title: "Transfers",
      serverData: [],
      filter: "",
      loading: false,
      serverPagination: {
        page: 0,
        rowsPerPage: 10,
        rowsNumber: 5 // specifying this determines pagination is server-side
      },
      columns: [
        {
          name: "from",
          label: "FROM",
          field: "from",
          align: "left",
          searchable: true
        },
        {
          name: "to",
          label: "TO",
          field: "to",
          align: "left",
          searchable: true
        },
        {
          name: "quantity",
          label: "QUANTITY",
          field: "quantity",
          align: "left"
        },

        {
          name: "block_time",
          label: "TIME",
          field: "block_time",
          align: "left",
          format: val => rf.format(new Date(val))
        },
        {
          name: "trx_id",
          label: "TRXID",
          field: "trx_id",
          align: "right",
          searchable: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      getIsDark: "ui/getIsDark"
    })
  },
  methods: {
    async request(props) {
      this.loading = true;
      console.log(props);
      let res = await this.$store.dispatch("dac/fetchDACTokenTransfers", {
        limit: props.pagination.rowsPerPage,
        skip: props.pagination.rowsPerPage * (props.pagination.page - 1)
      });
      this.serverPagination = props.pagination;
      this.serverPagination.rowsNumber = res.count;
      this.serverData = res.results.map(r => {
        let transfer = r.action.data;
        transfer.block_time = r.block_timestamp;
        transfer.trx_id = r.trx_id;
        return transfer;
      });
      this.loading = false;
    }
  },
  mounted: async function() {
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    });
  }
};
</script>

<style>
.q-table-top {
  border-top: 0px !important;
}
</style>
