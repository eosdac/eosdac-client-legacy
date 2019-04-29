import ScatterJS, { Network } from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs2";
import ScatterLynx from "scatterjs-plugin-lynx";

import { Notify } from "quasar";
import axios from "axios";

import { Api, JsonRpc } from "eosjs";
const { TextDecoder, TextEncoder } = require("text-encoding");
import { EosWrapper } from "../../modules/eoswrapper.js";

ScatterJS.plugins(
  new ScatterEOS(),
  new ScatterLynx({
    Api,
    JsonRpc,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  })
);

export async function connectScatter(
  { state, commit, dispatch, rootGetters },
  trigger_login = false
) {
  let network = await state.networks.find(n => n.name == state.active_network);

  ScatterJS.scatter
    .connect(this._vm.$configFile.get("dacname"), { network })
    .then(async connected => {
      if (!connected) {
        console.error("Could not connect to Scatter.");

        commit("user/setAccountName", false, { root: true });

        if (rootGetters["user/getSettingByName"]("notify_error_msg").value) {
          Notify.create({
            message: `Signature provider not found`,
            timeout: 2000,
            type: "negative",
            position: "bottom-right"
          });
        }

        return;
      }

      console.log("scatter connected");

      //eoslynx doesn't support suggest network... need to handle this
      // let token = {
      //   token: {
      //     symbol: this._vm.$configFile.get("systemtokensymbol"),
      //     contract: this._vm.$configFile.get("systemtokencontract")
      //   }
      // };
      // let networkwithtoken = Object.assign({}, network, token);
      // await ScatterJS.scatter
      //   .suggestNetwork(networkwithtoken)
      //   .then(res => console.log("suggestnetwork", res, networkwithtoken));

      commit("setScatter", ScatterJS.scatter);

      if (ScatterJS.scatter.identity) {
        //logged in
        console.log("logged in");
        dispatch("user/loggedInRoutine", state.scatter.identity, {
          root: true
        });

        if (rootGetters["user/getSettingByName"]("notify_info_msg").value) {
          Notify.create({
            message: `Welcome back ${state.scatter.identity.accounts[0].name}`,
            timeout: 2000,
            type: "info",
            position: "bottom-right"
          });
        }
      } else {
        //scatter connected but not logged in
        console.log("please log in.");
        if (trigger_login && state.scatter !== null) await dispatch("login");
      }

      ScatterJS = null;
    });
}

export async function login({ state, dispatch, rootGetters, commit }) {
  console.log("request login");
  if (state.scatter === null) {
    console.log("scatter not found, trying to connect scatter");
    if (rootGetters["user/getSettingByName"]("notify_info_msg").value) {
      Notify.create({
        message: `Trying to connect to signature provider`,
        timeout: 1500,
        type: "info",
        position: "bottom-right"
      });
    }
    await dispatch("connectScatter", true);
    return;
  }
  let account = await state.scatter.login().catch(e => {
    console.log(e);
    return false;
  });

  if (account && account.accounts[0]) {
    dispatch("user/loggedInRoutine", account, { root: true });
    console.log(
      `logged in ${account.accounts[0].name} on ${state.active_network}`
    );

    if (rootGetters["user/getSettingByName"]("notify_info_msg").value) {
      Notify.create({
        message: `Welcome ${account.accounts[0].name}`,
        timeout: 2000,
        type: "info",
        position: "bottom-right"
      });
    }
  }
}

export async function logout({ state, dispatch }) {
  console.log("request logout");
  if (!state.scatter) {
    console.log("scatter not found");
    return;
  }
  await state.scatter.logout().catch(e => console.log(e));
  dispatch("user/loggedOutRoutine", null, { root: true });

  console.log("loggedout");
}

export async function switchAccount({ state, dispatch }) {
  await dispatch("logout");
  await dispatch("login");
}

export async function getEosApi({ state, commit }, rebuild = false) {
  if (state.eosApi && !rebuild) {
    // console.log('got eos api from store');
    return state.eosApi;
  }

  console.log("build and store eos api");
  let n = Network.fromJson(
    state.networks.find(n => n.name == state.active_network)
  );
  let rpc = new JsonRpc(n.fullhost());
  let api = await new Api({
    rpc,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });
  commit("setEosApi", new EosWrapper(api, this._vm.$configFile));
  return state.eosApi;
}

export async function getEosScatter({ state, commit }, rebuild = false) {
  if (state.eosScatter && !rebuild) {
    // console.log('got scatter api from store');
    return state.eosScatter;
  }
  console.log("build and store scatter api");
  let network = Network.fromJson(
    state.networks.find(n => n.name == state.active_network)
  );
  let rpc = new JsonRpc(network.fullhost());
  let eos = state.scatter.eos(network, Api, { rpc, beta3: true });
  commit("setEosScatter", [eos]);
  return [eos];
}

export async function loadConfig({ Vue, state, commit }, payload) {
  console.log(`loading new config file ${payload.networkname}`);
  const config = require(`../../extensions/statics/config/config.${
    payload.networkname
  }.json`);

  if (payload.vm) {
    //setting new config in the plugin
    payload.vm.$configFile.setConfig(config);
  }
}

export async function switchNetwork(
  { state, commit, dispatch, rootGetters },
  payload
) {
  if (state.active_network == payload.networkname) {
    console.log(`already connected to ${payload.networkname}`);
    return true;
  }

  let network = state.networks.find(n => n.name == payload.networkname);
  if (!network) {
    console.log(`network ${payload.networkname} doesn't exists`);
    return false;
  }
  console.log("switching to " + payload.networkname);
  if (rootGetters["user/getSettingByName"]("notify_info_msg").value) {
    Notify.create({
      message: `Switching network`,
      timeout: 1500, // in milliseconds; 0 means no timeout
      type: "info",
      detail: `switching to ${payload.networkname}`,
      position: "bottom-right" // 'top', 'left', 'bottom-left' etc.
    });
  }
  commit("setActiveNetwork", payload.networkname);
  await dispatch("loadConfig", payload);
  await dispatch("logout");
  /////////////////////////////////////////
  console.log("resetting profilecache...");
  payload.vm.$profiles.delete();
  console.log("profile cache:", payload.vm.$profiles.cache);
  payload.vm.$profiles.config = this._vm.$configFile;
  /////////////////////////////////////////

  dispatch("dac/initRoutine", null, { root: true });
  await dispatch("connectScatter", true);
}

export async function testEndpoint({ state }, endpointurl = false) {
  if (!endpointurl) {
    let network = await state.networks.find(
      n => n.name == state.active_network
    );
    endpointurl = `${Network.fromJson(network).fullhost()}/v1/chain/get_info`;
    // endpointurl = `${Network.fromJson(network).fullhost()}/v1/chadddddin/get_info` ;
  }
  let timeout = 3000;
  console.log("testing", endpointurl);
  let res = await axios({
    method: "GET",
    url: `${endpointurl}`,
    timeout: timeout,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      console.log(res.data);
      return res.data;
    })
    .catch(error => {
      if (error.code == "ECONNABORTED") {
        console.log(`Slow endpoint. No response received after ${timeout}ms`);
      } else {
        console.log(`bad endpoint: ${endpointurl}`);
      }
      return false;
    });
  return res;
}
