require("../assets/icon-fonts/eosdac-iconfont-v1-9/styles.css");
require("../assets/icon-fonts/extended_material_icons/css/materialdesignicons.css");

function styledConsoleLog() {
  let argArray = [];
  if (arguments.length) {
    const startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi;
    const endTagRe = /<\/span>/gi;
    let reResultArray;
    argArray.push(
      arguments[0].replace(startTagRe, "%c").replace(endTagRe, "%c")
    );
    while ((reResultArray = startTagRe.exec(arguments[0]))) {
      argArray.push(reResultArray[2]);
      argArray.push("");
    }
    for (var j = 1; j < arguments.length; j++) {
      argArray.push(arguments[j]);
    }
  }
  console.log.apply(console, argArray);
}

class ConfigLoader {
  constructor(networkname) {
    this.configFile = require(`../extensions/statics/config/config.${networkname}.json`);
    this.icon = require(`../extensions/statics/config/iconmap.json`);

    styledConsoleLog(
      `<span style="color:white;background-color:hsl(268, 87%, 53%); font-size:21px; padding:5px;">Welcome To the ${this.get(
        "dacname"
      )} Member Client </span><span style="color:black; font-size:12px;">Pasting code in the console can be dangerous </span>`
    );
  }

  get(configquery) {
    switch (configquery) {
      case "dacname":
        return this.configFile.dacName;
      case "dacscope":
        return this.configFile.dacScope.toLowerCase() || "";
      case "defaultnode":
        return this.configFile.api.default_eos_node;
      case "tokencontract":
        return this.configFile.contracts.token.name;
      case "tokendecimals":
        return this.configFile.contracts.token.decimals;
      case "custodianmemo":
        return this.configFile.contracts.custodian.memo;
      case "custodiancontract":
        return this.configFile.contracts.custodian.name;
      case "escrowcontract":
        return this.configFile.contracts.escrow.name;
      case "dactokensymbol":
        return this.configFile.contracts.token.symbol;
      case "systemtokensymbol":
        return this.configFile.contracts.system_token.symbol;
      case "systemtokendecimals":
        return this.configFile.contracts.system_token.decimals;
      case "systemtokencontract":
        return this.configFile.contracts.system_token.name;
      case "systemmsigcontract":
        return this.configFile.contracts.system_msig.name;
      case "dacmsigcontract":
        return this.configFile.contracts.dac_msig.name;
      case "botcontract":
        return this.configFile.contracts.bot.name;
      case "explorer":
        return this.configFile.external.explorer.replace(/\/+$/, "");
      case "memberclientstateapi":
        return this.configFile.api.memberclient_state_api.replace(/\/+$/, "");
      case "bpnodeapi":
        return this.configFile.api.bpnodes;
      case "firehoseapi":
        return this.configFile.api.firehose;
      // case "external":
      //   return this.configFile.external;
      case "authaccount":
        // backwards compatibility
        if (!this.configFile.contracts.auth) {
          return this.configFile.authAccount;
        }
        return this.configFile.contracts.auth;
      case "authaccountname":
        if (!this.configFile.contracts.auth) {
          return this.configFile.authAccount.name;
        }
        return this.configFile.contracts.auth.name;
      case "wpcontract":
        return this.configFile.contracts.wpproposal.name;
      case "treasuryaccount":
        if (!this.configFile.contracts.treasury) {
          return this.configFile.treasuryAccount.name;
        }
        return this.configFile.contracts.treasury.name;
      default:
        return `***${configquery} not yet subscribed in config-loader***`;
    }
  }

  setConfig(conf) {
    this.configFile = conf;
  }

  disable_ConsoleLog() {
    if (this.consoleLogBackup === undefined) {
      // alert('cl disabled')
      this.consoleLogBackup = window.console.log;
      window["console"]["log"] = function() {};
    }
  }

  enable_ConsoleLog() {
    if (this.consoleLogBackup) {
      // alert('cl enable')
      window["console"]["log"] = this.consoleLogBackup;
      this.consoleLogBackup = undefined;
    }
  }
}

export default ({ Vue, store }) => {
  let networkname = store.getters["global/getActiveNetworkName"];
  let config = new ConfigLoader(networkname);

  if (
    store.getters["user/getSettingByName"]("debug_console_log") &&
    !store.getters["user/getSettingByName"]("debug_console_log").value
  ) {
    config.disable_ConsoleLog();
  }
  store.commit("global/setNode", config.get("defaultnode"));
  Vue.prototype.$configFile = config;
};
