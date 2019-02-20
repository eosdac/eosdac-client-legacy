
export class EosWrapper {

    constructor(eosApi, config){
        this.eos = eosApi.rpc;
        this.config = config.configFile;
    }


    async getAccount(accountname){
        return this.eos.get_account(accountname).then(x => x).catch(e => false);
    }

    async getBalance(accountname, contract=this.config.contracts.token.name , symbol=this.config.contracts.token.symbol){
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
            code: this.config.contracts.token.name,
            scope: this.config.contracts.token.name,
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
            code: this.config.contracts.token.name,
            scope: this.config.contracts.token.name,
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
            code: this.config.contracts.token.name,
            scope: this.config.contracts.token.symbol,
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
            contract = this.config.contracts.custodian.name;
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
            code: this.config.contracts.custodian.name,
            scope: this.config.contracts.custodian.name,
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
            code: this.config.contracts.custodian.name,
            scope: this.config.contracts.custodian.name,
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
            code: this.config.contracts.custodian.name,
            scope: this.config.contracts.custodian.name,
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
            code: this.config.contracts.custodian.name,
            scope: this.config.contracts.custodian.name,
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
            code: this.config.contracts.system_msig.name,
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
            code: this.config.contracts.custodian.name,
            scope: this.config.contracts.custodian.name,
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

}

