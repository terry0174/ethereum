<style scoped>
th {
    width: 150px;
}
td {
    width: 550px;
    text-align: right;
}
td div {
    padding: 2px 10px 2px 20px;   
}
</style>

<template>
    <div class="block">
        <div>
            <table>
                <tr> 
                    <th>ENS 合約地址</th>
                    <td>
                        {{contract._address}} 
                        <div>
                            <button v-on:click="deployENS()">Deploy</button>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <input type="text" v-model="form.getOwner.input" placeholder="namehash(label.node)">
            <button v-on:click="getOwner()">Owner</button>
            <span>{{form.getOwner.output}}</span>
        </div>
        <div>
            <input type="text" v-model="form.getResolver.input" placeholder="namehash(label.node)">
            <button v-on:click="getResolver()">Resolver</button>
            <span>{{form.getResolver.output}}</span>
        </div>
        <div>
            <input type="text" v-model="form.getAddr.input" placeholder="label.node">
            <button v-on:click="getAddr()">Addr</button>
            <span>{{form.getAddr.output}}</span>
        </div>
        <div>
            <input type="text" v-model="form.setSubnodeOwner.input.node" placeholder="node">
            <span>namehash(node) = {{form.setSubnodeOwner.input.node | namehash}}</span>
            <br>
            <input type="text" v-model="form.setSubnodeOwner.input.label" placeholder="label" style="margin: 6px 5px 4px 0px">
            <span>web3.sha3(label) = {{form.setSubnodeOwner.input.label | sha3}}</span>
            <br>
            <input type="text" v-model="form.setSubnodeOwner.input.owner" placeholder="owner">
            <button v-on:click="setSubnodeOwner(null, null, null)">Set Subnode Owner</button>
            <span>{{form.setSubnodeOwner.output}}</span>
        </div>
        <div>
            <input type="text" v-model="form.setResolver.input.node" placeholder="node">
            <span>namehash(node) = {{form.setResolver.input.node | namehash}}</span>
            <br>
            <input type="text" v-model="form.setResolver.input.resolverAddress" placeholder="resolver">
            <button v-on:click="setResolver(null, null)">Set Resolver</button>
        </div>  
    </div>
</template>  

<script>
module.exports = {
    data: function() {

        return {
            contract: {},
            form: {
                getOwner: {
                    input: '',
                    output: ''
                },
                getResolver: {
                    input: '',
                    output: ''
                },
                getAddr: {
                    input: '',
                    output: ''
                },
                setSubnodeOwner: {
                    input: {
                        label: '',
                        node: '',
                        owner: ''
                    },
                    output: ''
                },
                setResolver: {
                    input: {
                        node: '',
                        resolverAddress: ''
                    }
                }
            }
        }
    },
	methods: {
        deployENS: function() {

            console.log("Deploy ENS Contract");

            var _this = this;
            var newContract = new web3.eth.Contract(ensAbi);
            
            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.$parent.account.defaultPassword, 600).then(function(value){
           
                newContract.deploy({
                    data: ensByteCode
                })
                .send({
                    from: web3.eth.defaultAccount,
                    gas: 4700000,
                })
                .then(function(receipt){

                    _this.init(); //初始化所有欄位
                    _this.$bus.$emit('init'); //發送事件,初始化其他頁面 (utils 頁面不聯動 ens contract, 不用初始化)
                    _this.contract = receipt; //更新合約物件
                    _this.$parent.ens = receipt; //同步更新app

                    //新增 node 至 domain 頁面
                    _this.$bus.$emit('addNode',{
                        url: ''
                    });

                    console.log("Deploy ENS Contract success");
                    alert("Deploy ENS Contract success");
                })
                .catch(function(error){

                    console.error("Deploy ENS Contract error");
                    console.dir(error);
                    alert("Deploy ENS Contract error");
                });
            }).catch(function(error){

                console.error("Unlock Account error");
                console.dir(error);
                alert("Unlock Account error");
            });
        },
        getOwner: function() {

            //防呆
            if(this.contract._address == null || this.contract._address == undefined){
                
                console.error("ENS contract is not deploy");
                this.form.getOwner.output = '';
                return;
            }

            var _this = this;
            
            this.contract.methods.owner(this.form.getOwner.input).call().then(function(value){
                _this.form.getOwner.output = value;
            });            
        },
        getResolver: function() {

            //防呆
            if(this.contract._address == null || this.contract._address == undefined){
                
                console.error("ENS contract is not deploy");
                this.form.getResolver.output = '';
                return;
            }

            var _this = this;
            
            this.contract.methods.resolver(this.form.getResolver.input).call().then(function(value){
                _this.form.getResolver.output = value;
            });            
        },
        getAddr: async function() {

            //防呆
            if(this.contract._address == null || this.contract._address == undefined){
                
                console.error("ENS contract is not deploy");
                this.form.getAddr.output = '';
                return;
            }

            this.form.getAddr.output = await getAddr(this.contract, this.form.getAddr.input);
        },
        setSubnodeOwner: function(node, label, owner){

            console.log("Set ENS Subnode Owner");

            //防呆
            if(this.contract._address == null || this.contract._address == undefined){
                console.error("ENS contract is not deploy");
                return;
            }

            var _this = this;
            node = (node == null ? this.form.setSubnodeOwner.input.node : node);
            label = (label == null ? this.form.setSubnodeOwner.input.label : label);
            owner = (owner == null ? this.form.setSubnodeOwner.input.owner : owner);
            
            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.$parent.account.defaultPassword, 600).then(function(value){
                
                _this.contract.methods.setSubnodeOwner(
                    namehash(node),
                    web3.utils.sha3(label),
                    owner
                ).send({
                    from: web3.eth.defaultAccount,
                    gas: 4700000
                })
                .on('transactionHash', function(hash){

                    console.log("transactionHash : " + hash);
                })
                .on('receipt', function(receipt){

                    //新增 node 至 domain 頁面
                    _this.$bus.$emit('addNode',{
                        url: (node == '' ? label : label + '.' + node)
                    });

                    console.log("setSubnodeOwner success");
                    alert("setSubnodeOwner success");
                })
                .on('confirmation', function(confirmationNumber, receipt){ 
                    //重複觸發24次 
                })
                .on('error', function(error){

                    console.error("setSubnodeOwner error");
                    console.dir(error);
                    alert("setSubnodeOwner error");
                });

            }).catch(function(error){

                console.error("Unlock Account error");
                console.dir(error);
                alert("Unlock Account error");
            });    
        },
        setResolver: function(node, resolver){

            console.log("Set ENS resolver");

            //防呆
            if(this.contract._address == null || this.contract._address == undefined){
                console.error("ENS contract is not deploy");
                return;
            }

            var _this = this;
            node = (node == null ? _this.form.setResolver.input.node : node);
            resolver = (resolver == null ? _this.form.setResolver.input.resolverAddress : resolver);

            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.$parent.account.defaultPassword, 600).then(function(value){
                
                _this.contract.methods.setResolver(
                    namehash(node),
                    resolver
                ).send({
                    from: web3.eth.defaultAccount,
                    gas: 4700000
                })
                .on('transactionHash', function(hash){

                    console.log("transactionHash : " + hash);
                })
                .on('receipt', function(receipt){

                    //新增 node 至 domain 頁面
                    _this.$bus.$emit('addNode',{
                        url: node
                    });

                    console.log("setResolver success");
                    alert("setResolver success");
                })
                .on('confirmation', function(confirmationNumber, receipt){ 
                    //重複觸發24次 
                })
                .on('error', function(error){

                    console.error("setResolver error");
                    console.dir(error);
                    alert("setResolver error");
                });

            }).catch(function(error){

                console.error("Unlock Account error");
                console.dir(error);
                alert("Unlock Account error");
            }); 
        },
        init: function() {

            this.contrac = {};
            this.form = {
                getOwner: {
                    input: '',
                    output: ''
                },
                getResolver: {
                    input: '',
                    output: ''
                },
                getAddr: {
                    input: '',
                    output: ''
                },
                setSubnodeOwner: {
                    input: {
                        label: '',
                        node: '',
                        owner: ''
                    },
                    output: ''
                },
                setResolver: {
                    input: {
                        node: '',
                        resolverAddress: ''
                    }
                }
            };
        }
    },
    mounted: function () {

        //接收事件

        //Registrar deploy 後呼叫
		this.$bus.$on('setSubnodeOwner', event => {
			this.setSubnodeOwner(event.node, event.label, event.owner);
        });  
        
        //Resolver setAddr 後呼叫
		this.$bus.$on('setResolver', event => {
			this.setResolver(event.node, event.resolver);
		});    
    }
}
</script>