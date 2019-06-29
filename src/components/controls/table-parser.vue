<template>
  <div>
    <div class="q-mb-sm">
      <q-item>
        <q-item-main>
          <q-input
            :dark="getIsDark"
            v-model="contract"
            type="text"
            stack-label="Contract"
            placeholder="input a contract name"
            @keyup.enter.native="getAbi(contract)"
          />
        </q-item-main>
        <q-item-side right>
          <q-btn
            color="primary-light"
            flat
            label="load"
            @click="getAbi(contract)"
          />
        </q-item-side>
      </q-item>

      <q-select
        :dark="getIsDark"
        stack-label="Tables"
        :options="getTableOptions"
        v-model="selected_table"
      />
      <q-table
        class="bg-bg1"
        :dark="getIsDark"
        color="primary-light"
        :title="table_config.title"
        :data="table_config.rows"
        :columns="table_config.columns"
        row-key="scope"
      />
      <pre>{{ abi.tables }}</pre>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "tableParser",
  data() {
    return {
      contract: "",
      selected_table: "",
      isLoading: false,
      abi_load_error: "",
      abi: false,
      table_config: {
        title: "test",
        columns: [],
        rows: []
      }
    };
  },
  computed: {
    ...mapGetters({
      getIsDark: "ui/getIsDark",
      getDacApi: "global/getDacApi"
    }),
    getTableOptions() {
      if (!this.abi || !this.abi.tables) return [];
      return this.abi.tables.map(at => {
        return { label: at.name, value: at.name };
      });
    }
  },
  methods: {
    async getAbi(contract) {
      this.abi = {};
      if (!this.getDacApi) return;
      this.abi_load_error = "";
      this.isLoading = true;

      let abi = await this.getDacApi.eos.get_abi(contract).catch(e => {
        console.log(e);
      });

      this.isLoading = false;
      if (abi && abi.abi) {
        this.abi = abi.abi;
      } else {
        this.abi_load_error = `ABI for ${contract} not found`;
        return false;
      }
    },
    async getTableByScope() {
      let options = {
        code: this.contract,
        table: this.selected_table,
        lower_bound: "",
        upper_bound: "",
        limit: 10
      };
      let res = await this.getDacApi.eos
        .get_table_by_scope(options)
        .catch(e => {
          console.log(e);
        });
      console.log(res);
      if (res.rows.length === 0) {
        console.log("table is not scoped");
        return false;
      }

      this.table_config.title = `Scopes for ${this.selected_table}`;
      this.table_config.columns = Object.keys(res.rows[0]).map(col => {
        return {
          name: col,
          required: true,
          label: col,
          align: "left",
          field: col,
          sortable: true
          // classes: "my-class",
          // style: "width: 500px"
        };
      });
      this.table_config.rows = res.rows;
      // code: "eosio"
      // count: 1
      // payer: "1234asdfasdf"
      // scope: "1234asdfasdf"
      // table: "refunds"
    }
  },
  watch: {
    selected_table: function() {
      this.getTableByScope();
    }
  }
};
</script>

<style></style>
