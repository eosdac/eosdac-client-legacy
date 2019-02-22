// const {TextDecoder, TextEncoder} = require('text-encoding');

export class EosWrapper {

    constructor(eosApi, serialize, config){
        this.eosapi = eosApi;
        this.eos = eosApi.rpc;
        this.Serialize = serialize;
        this.textDecoder = eosApi.textDecoder;
        this.textEncoder = eosApi.textEncoder;
        // this.config = config.configFile;
        this.configobj = config
    }


    async getAccount(accountname){
        return this.eos.get_account(accountname).then(x => x).catch(e => false);
    }

    async getBalance(accountname, contract= this.configobj.get('tokencontract') , symbol= this.configobj.get('dactokensymbol') ){
        return this.eos.get_currency_balance( contract, accountname, symbol ).then(res =>{
            if(res[0]){
                return parseFloat(res[0]);
            }
            else{
                return 0;
            }
        }).catch(e=> false) ;
    }

    async getAgreedTermsVersion(accountname){
        let res =  await this.eos.get_table_rows({
            json: true,
            code: this.configobj.get('tokencontract'), 
            scope: this.configobj.get('tokencontract'),
            lower_bound: accountname,
            table: 'members',
            limit: 1
        }).catch(e=> false);

        if(res && res.rows[0].sender === accountname){
            return res.rows[0].agreedtermsversion;
        }
        else{
            return false;
        }
    }

    async getMemberTerms(){
        let res =  await this.eos.get_table_rows({
            json: true,
            code: this.configobj.get('tokencontract'),
            scope: this.configobj.get('tokencontract'),
            table: 'memberterms',
            limit: -1
        }).catch(e=> false);

        if(res){
            return res;
            // memberterms = memberterms.rows.sort(function(a, b) {
            //     return a.version - b.version;
            //   });
        }
        else{
            return false;
        }
    }

    async getTokenStats(){
        let res =  await this.eos.get_table_rows({
            json: true,
            code: this.configobj.get('tokencontract'),
            scope: this.configobj.get('dactokensymbol'),
            table: 'stat',
            limit: 1
        }).catch(e=> false );

        if(res.rows){
            return res.rows[0];
        }
        else{
            return false;
        }
    }

    async getContractConfig(payload){
        let contract;
        if(payload == 'custodian'){
            contract = this.configobj.get('custodiancontract');
        }
        let res =  await this.eos.get_table_rows({
            json: true,
            code: contract,
            scope: contract,
            table: 'config',
        }).catch(e=> false);

        if (!res.rows.length) {
            return false
        }
        else {
            return res.rows[0];
        }

    }
    async getVotes(accountname){
        let res =  await this.eos.get_table_rows({
            json: true,
            code: this.configobj.get('custodiancontract'),
            scope: this.configobj.get('custodiancontract'),
            lower_bound: accountname,
            table: 'votes',
            limit: 1
        }).catch(e=> false );

        if(res && res.rows[0].voter === accountname){
            return res.rows[0].candidates;
        }
        else{
            return false;
        }
    }

    async getCustodians(){
        let res =  await this.eos.get_table_rows({
            json: true,
            code: this.configobj.get('custodiancontract'),
            scope: this.configobj.get('custodiancontract'),
            table: 'custodians',
            limit: 12
        }).catch(e=> false);

        if(res && res.rows[0]){
            return res.rows;
        }
        else{
            return false;
        }
    }

    async isCustodian(accountname){
        let custodians = (await this.getCustodians() ).map(c => c.cust_name);
        return custodians.includes(accountname);
    }

    async isCandidate(accountname){
        let res =  await this.eos.get_table_rows({
            json: true,
            code: this.configobj.get('custodiancontract'),
            scope: this.configobj.get('custodiancontract'),
            lower_bound: accountname,
            table: 'candidates',
            limit: 1
        }).catch(e=> false);

        if(res && res.rows[0].candidate_name === accountname){
            return res.rows[0];
        }
        else{
            return false;
        }
        
    }

    async getCandidates(){
        let res =  await this.eos.get_table_rows({
            json: true,
            code: this.configobj.get('custodiancontract'),
            scope: this.configobj.get('custodiancontract'),
            table: 'candidates',
            limit: -1
        }).catch(e=> false);

        if(res && res.rows[0]){
            return res.rows;
        }
        else{
            return false;
        }
    }

    async getApprovalsFromProposal(payload){
        try{
        let approvals = (await this.eos.get_table_rows({
            code: this.configobj.get('systemmsigcontract'),
            json: true,
            limit: 1,
            lower_bound: payload.proposal_name,
            scope: payload.proposer,
            table: 'approvals'
            }) ).rows[0];
            
            return approvals;

        } catch(e){
        console.log(e);
        return [];
        }
    }

    async getPendingPay(accountname){

        let pendingpays = await this.eos.get_table_rows({
            json : true,
            code: this.configobj.get('custodiancontract'),
            scope: this.configobj.get('custodiancontract'),
            table: 'pendingpay',
            lower_bound : accountname,
            upper_bound : accountname,
            index_position : 2,
            key_type : 'name',
            limit: -1,
        });
        if (!pendingpays.rows.length) {
            return [];
        } 
        else {
            return pendingpays.rows;
        }
    }

    async getControlledAccounts(accountname){
        let ctrl = await this.eos.history_get_controlled_accounts(accountname);
        return ctrl;
    }

}

