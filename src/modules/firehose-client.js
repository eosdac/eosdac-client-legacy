
const {Serialize} = require('eosjs');
const {TextDecoder, TextEncoder} = require('text-encoding');
const Int64 = require('int64-buffer').Int64BE;

export class FirehoseClient {
    constructor(config, eosapi){

        this.config = config;
        this.ready_cb = null;
        this.opened = false;

        this.websocket = window.WebSocket || window.MozWebSocket;

        this.api = eosapi;

        this.connect();
    }

    connect(){
        const connection = new this.websocket(this.config.server);

        connection.onopen =  () => {
            if (this.ready_cb){
                this.ready_cb(this)
            }
            this.opened = true
            // connection is opened and ready to use
            console.log('Firehose connected!')
        };

        connection.onerror = (error) => {
            // an error occurred when sending/receiving data
            console.error(error)
        };

        connection.onmessage = (message) => {
            try {
                // console.log('onmessage', message)
                const event = JSON.parse(message.data);
                this.deserialize(event).then((deserialized_event) => {
                    this.callback(event.type, deserialized_event)
                }).catch((e) => {
                    console.error('Error onmessage: ', message.data, e);
                })

            }
            catch (e) {
                console.error('Error onmessage: ', message.data, e);
                return;
            }
        };

        this.connection = connection
    }


    async getTableType (code, table){
        const contract = await this.api.getContract(code);
        const abi = await this.api.getAbi(code);

        let this_table, type;
        for (let t of abi.tables) {
            if (t.name == table) {
                this_table = t;
                break
            }
        }

        if (this_table) {
            type = this_table.type
        } else {
            console.error(`Could not find table "${table}" in the abi`);
            return
        }

        return contract.types.get(type)
    }

    arrayFromHex(hexString){
        return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    }

    async deserialize(raw){
        // console.log('Deserialize', raw)

        let resp = null
        const block_num = raw.block_num

        switch (raw.type){
            case 'action_trace':
            
                let action = JSON.parse(raw.data)
                // console.log(action.data)
                let parsed_action = (await this.api.deserializeActions([action])).pop()
                // console.log('Deserialize action_trace', raw, parsed_action)
                parsed_action.status = raw.status
                resp = parsed_action
                break;
            case 'contract_row':
                const sb = new Serialize.SerialBuffer({
                    textEncoder: new TextEncoder,
                    textDecoder: new TextDecoder,
                    array: this.arrayFromHex(raw.data)
                });

                sb.get() // Row version
                const code = sb.getName()
                const scope = sb.getName()
                const table = sb.getName()
                const primary_key = new Int64(sb.getUint8Array(8)).toString()
                const payer = sb.getName()
                const data_raw = sb.getBytes()

                const table_type = await this.getTableType(code, table);
                const data_sb = new Serialize.SerialBuffer({
                    textEncoder: new TextEncoder,
                    textDecoder: new TextDecoder,
                    array: data_raw
                });

                try {
                    const data = table_type.deserialize(data_sb)
                    resp = {
                        block_num, code, scope, table, primary_key, payer, data
                    }
                }
                catch (e){
                    console.error('Error in deserialize', e)
                }
                break;
            case 'fork':
                resp = raw
                break;
        }

        resp.block_num = block_num

        return resp
    }

    ready(cb){
        this.ready_cb = cb

        if (this.opened){
            cb(this)
        }

        return this
    }

    callback(cb){
        this.callback = cb

        return this
    }

     request(type, data){
        const msg_obj = {type, data}
        let msg = JSON.stringify(msg_obj)
        this.connection.send(msg)
        return this
    }
}


