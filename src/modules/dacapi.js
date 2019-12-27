const { TextDecoder, TextEncoder } = require("text-encoding");
const { Serialize } = require("eosjs");

export class DacApi {
  constructor(eosApi, config) {
    this.eosapi = eosApi;
    this.eos = eosApi.rpc;
    // this.config = config.configFile;
    this.configobj = config;
  }

  async getAccount(accountname) {
    return this.eos
      .get_account(accountname)
      .then(x => x)
      .catch(e => false);
  }

  async getBalance(
    accountname,
    contract = this.configobj.get("tokencontract"),
    symbol = this.configobj.get("dactokensymbol")
  ) {
    return this.eos
      .get_currency_balance(contract, accountname, symbol)
      .then(res => {
        if (res[0]) {
          return parseFloat(res[0]);
        } else {
          return 0;
        }
      })
      .catch(e => false);
  }

  async getStaked(
    accountname,
    code = this.configobj.get("tokencontract"),
    symbol = this.configobj.get("dactokensymbol"),
    scope = this.configobj.get("dacscope")
  ) {
    return this.eos
      .get_table_rows({
        code,
        scope,
        table: "stakes",
        lower_bound: accountname,
        upper_bound: accountname
      })
      .then(res => {
        if (res.rows.length) {
          let [qty] = res.rows[0].stake.split(" ");
          //alert(`qty = ${qty}`);
          return parseFloat(qty);
        } else {
          return 0;
        }
      })
      .catch(e => false);
  }

  async getAgreedTermsVersion(accountname) {
    let res = await this.eos
      .get_table_rows({
        json: true,
        code: this.configobj.get("tokencontract"),
        scope: this.configobj.get("dacscope"),
        lower_bound: accountname,
        table: "members",
        limit: 1
      })
      .catch(e => false);

    if (res && res.rows[0] && res.rows[0].sender === accountname) {
      return res.rows[0].agreedtermsversion;
    } else {
      return false;
    }
  }

  async getMemberTerms() {
    let res = await this.eos
      .get_table_rows({
        json: true,
        code: this.configobj.get("tokencontract"),
        scope: this.configobj.get("dacscope"),
        table: "memberterms",
        limit: -1
      })
      .catch(e => false);

    if (res) {
      return res;
      // memberterms = memberterms.rows.sort(function(a, b) {
      //     return a.version - b.version;
      //   });
    } else {
      return false;
    }
  }

  async getTokenStats() {
    let res = await this.eos.get_table_rows({
      json: true,
      code: this.configobj.get("tokencontract"),
      scope: this.configobj.get("dactokensymbol"),
      table: "stat",
      limit: 1
    });
    console.log(res.rows[0]);

    const [amount, symbol] = res.rows[0].max_supply.split(" ");
    const [, decs] = amount.split(".");

    const stats = {
      maxSupply: res.rows[0].max_supply,
      supply: res.rows[0].supply,
      precision: decs.length,
      transferLocked: !!res.rows[0].transfer_locked,
      symbol
    };

    return stats;
    /*debugger;

    return {
      maxSupply: "1000000000.0000 SENSE",
      supply: "1000000000.0000 SENSE",
      precision: 4,
      symbol: "SENSE"
    };*/

    /*if (res.rows) {
      return res.rows[0];
    } else {
      return false;
    }*/
  }

  async getContractConfig(payload) {
    let contract;
    let scope;
    let table = "";
    if (payload == "custodian") {
      table = "config2";
      contract = this.configobj.get("custodiancontract");
      scope = this.configobj.get("dacscope");
    } else if (payload == "wp") {
      table = "config";
      contract = this.configobj.get("wpcontract");
      scope = this.configobj.get("dacscope");
    }
    let res = await this.eos
      .get_table_rows({
        json: true,
        code: contract,
        scope: scope,
        table: table
      })
      .catch(e => false);

    if (res.rows) {
      return res.rows[0];
    } else {
      return false;
    }
  }
  async getVotes(accountname) {
    let res = await this.eos
      .get_table_rows({
        json: true,
        code: this.configobj.get("custodiancontract"),
        scope: this.configobj.get("dacscope"),
        lower_bound: accountname,
        table: "votes",
        limit: 1
      })
      .catch(e => false);

    if (res && res.rows[0] && res.rows[0].voter === accountname) {
      return res.rows[0].candidates;
    } else {
      return false;
    }
  }

  async getCustodians(number_custodians_config = 12) {
    let res = await this.eos
      .get_table_rows({
        json: true,
        code: this.configobj.get("custodiancontract"),
        scope: this.configobj.get("dacscope"),
        table: "custodians",
        limit: number_custodians_config
      })
      .catch(e => false);

    if (res && res.rows[0]) {
      return res.rows;
    } else {
      return false;
    }
  }

  async isCustodian(accountname) {
    let custodians = (await this.getCustodians()).map(c => c.cust_name);
    return custodians.includes(accountname);
  }

  async isCandidate(accountname) {
    let res = await this.eos
      .get_table_rows({
        json: true,
        code: this.configobj.get("custodiancontract"),
        scope: this.configobj.get("dacscope"),
        lower_bound: accountname,
        table: "candidates",
        limit: 1
      })
      .catch(e => false);

    if (res && res.rows[0] && res.rows[0].candidate_name === accountname) {
      return res.rows[0];
    } else {
      return false;
    }
  }

  async getCandidates() {
    let res = await this.eos
      .get_table_rows({
        json: true,
        code: this.configobj.get("custodiancontract"),
        scope: this.configobj.get("dacscope"),
        table: "candidates",
        limit: -1
      })
      .catch(e => false);

    if (res && res.rows[0]) {
      return res.rows;
    } else {
      return false;
    }
  }

  async getCandidatePermissions() {
    let res = await this.eos
      .get_table_rows({
        json: true,
        code: this.configobj.get("custodiancontract"),
        scope: this.configobj.get("custodiancontract"),
        table: "candperms",
        limit: -1
      })
      .catch(e => false);

    if (res && res.rows[0]) {
      return res.rows;
    } else {
      return [];
    }
  }

  async getApprovalsFromProposal(payload) {
    try {
      let approvals = (
        await this.eos.get_table_rows({
          code: this.configobj.get("systemmsigcontract"),
          json: true,
          limit: 1,
          lower_bound: payload.proposal_name,
          scope: payload.proposer,
          table: "approvals"
        })
      ).rows[0];

      return approvals;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getPendingPay(accountname) {
    let pendingpays = await this.eos.get_table_rows({
      json: true,
      code: this.configobj.get("custodiancontract"),
      scope: this.configobj.get("custodiancontract"),
      // scope: this.configobj.get("dacscope"),
      table: "pendingpay",
      lower_bound: accountname,
      upper_bound: accountname,
      index_position: 2,
      key_type: "name",
      limit: -1
    });
    if (!pendingpays.rows.length) {
      return [];
    } else {
      return pendingpays.rows;
    }
  }

  async getPendingPay2(accountname) {
    let pendingpays = await this.eos.get_table_rows({
      json: true,
      code: this.configobj.get("custodiancontract"),
      scope: this.configobj.get("dacscope"),
      table: "pendingpay2",
      lower_bound: accountname,
      upper_bound: accountname,
      index_position: 2,
      key_type: "name",
      limit: -1
    });
    if (!pendingpays.rows.length) {
      return [];
    } else {
      return pendingpays.rows;
    }
  }

  async getControlledAccounts(accountname) {
    let ctrl = await this.eos.history_get_controlled_accounts(accountname);
    return ctrl;
  }

  async getWps(payload) {
    let wps = await this.eos.get_table_rows({
      json: true,
      code: this.configobj.get("wpcontract"),
      scope: payload.dac_scope,
      table: "proposals",
      // lower_bound : payload.account,
      // upper_bound : accountname,
      // index_position : 2,
      // key_type : 'name',
      limit: -1
    });
    if (!wps.rows || !wps.rows.length) {
      return [];
    } else {
      return wps.rows;
    }
  }

  async getCustodianContractState() {
    let res = await this.eos
      .get_table_rows({
        json: true,
        code: this.configobj.get("custodiancontract"),
        scope: this.configobj.get("dacscope"),
        table: "state",
        limit: 1
      })
      .catch(e => false);

    if (res.rows) {
      return res.rows[0];
    } else {
      return false;
    }
  }

  async getCurrencyStats(contract, symbol) {
    let res = await this.eos.get_currency_stats(contract, symbol);
    return res;
  }

  async getCatDelegations(accountname) {
    let catvotes = await this.eos.get_table_rows({
      json: true,
      code: this.configobj.get("wpcontract"),
      scope: this.configobj.get("dacscope"),
      table: "propvotes",
      lower_bound: accountname,
      upper_bound: accountname,
      index_position: 2,
      key_type: "name",
      limit: -1
    });
    if (!catvotes.rows.length) {
      return [];
    } else {
      return catvotes.rows;
    }
  }

  async serializeActionData(action) {
    try {
      let account = action.account;
      let name = action.name;
      let data = action.data;
      const contract = await this.eosapi.getContract(account);
      let hex = Serialize.serializeActionData(
        contract,
        account,
        name,
        data,
        new TextEncoder(),
        new TextDecoder()
      );
      return hex;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
