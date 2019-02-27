<style scoped>
table {
    padding-top: 20px
}
table th:nth-child(1) {
    min-width: 200px;
}
table th:nth-child(2) {
    width: 100px;
}
table th:nth-child(3) {
    width: 350px;
}
</style>
<template>
    <div class="block">
        <div>
            <input type="text" v-model="form.deploy.input.node" placeholder="node">
            <span>namehash(node) = {{form.deploy.input.node | namehash}}</span>
            <br>
            <input type="text" v-model="form.deploy.input.label" placeholder="label" style="margin: 6px 5px 4px 0px">
            <span>web3.sha3(label) = {{form.deploy.input.label | sha3}}</span>
            <br>
            <select v-model="form.deploy.input.type">
                <option value="Test">Test</option>
                <option value="FIFS">FIFS</option>
            </select>
            <button v-on:click="deployRegistrar()" class="long-button">Deploy Registrar</button>
        </div>
        <div>
             <select v-model="form.register.input.registrarId">
                <option v-for="registrar in registrars" :key="registrar.contract._address">{{registrar.contract._address}}</option>
            </select>
            <br>
            <input type="text" v-model="form.register.input.label" placeholder="label" style="margin: 6px 5px 4px 0px">
            <span>web3.sha3(label) = {{form.register.input.label | sha3}}</span>
            <br>
            <input type="text" v-model="form.register.input.owner" placeholder="owner">
            <button v-on:click="register()" class="long-button">Register</button>
        </div>
        <table>
            <tr>
                <th>Domain</th>
                <th>Type</th>
                <th>Registrar 合約地址</th>
            </tr>
            <tr v-for="registrar in registrars" :key="registrar.contract._address">
                <td>{{registrar.domain}}</td>
                <td>{{registrar.type}}</td>
                <td>{{registrar.contract._address}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
module.exports = {
    data: function() {

        return {
            registrars: [],
            form: {
                deploy: {
                    input: {
                        node: '',
                        label: '',
                        type: 'Test'
                    }
                },
                register: {
                    input: {
                        registrarId: '',
                        label: '',
                        owner: ''
                    }
                }
            }
        }
    },
	methods: {
        deployRegistrar: function() {

            console.log("Deploy Registrar Contract");

            var _this = this;
            var type = this.form.deploy.input.type;
            var abi = (type == 'FIFS' ? fifsRegistrarAbi : testRegistrarAbi);
            var byteCode = (type == 'FIFS' ? fifsRegistrarByteCode : testRegistrarByteCode);
            var newContract = new web3.eth.Contract(abi);
            var node = this.form.deploy.input.node;
            var label = this.form.deploy.input.label;
            var rootNode = (node == '' ? label : label + '.' + node);
            var rootNodeHash = namehash(rootNode);

            console.log("rootNode = " + rootNode);
            console.log("namehash(rootNode) = " + rootNodeHash);
            
            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.$parent.account.defaultPassword, 600).then(function(value){
           
                newContract.deploy({
                    arguments: [_this.$parent.ens._address, rootNodeHash],
                    data: byteCode
                })
                .send({
                    from: web3.eth.defaultAccount,
                    gas: 4700000,
                })
                .then(function(receipt){

                    _this.registrars.push({
                        domain: rootNode,
                        type: type,
                        contract: receipt
                    }); //更新合約物件
                    
                    //呼叫事件 setSubnodeOwner, 假如 owner 不是 defaultAccount, 改為手動呼叫 setSubnodeOwner (owner 為 Registrar 時, 改呼叫 register)
                    _this.$parent.ens.methods.owner(namehash(node)).call().then(function(value){

                        if(value == web3.eth.defaultAccount) {

                            console.log("Node owner is default account, call setSubnodeOwner function automatic");

                            _this.$bus.$emit('setSubnodeOwner', {
                                node: node,
                                label: label, 
                                owner: receipt._address
                            });
                        }
                        else {
                            console.warn("Node owner is not default account, please call setSubnodeOwner(or register) function manual");
                        }
                    });

                    //新增 registrar 至 domain 頁面
                    _this.$bus.$emit('addRegistrar', {
                        address: receipt._address,
                        type: type
                    });
                    
                    console.log("Deploy Registrar Contract success");
                    alert("Deploy Registrar Contract success");
                })
                .catch(function(error){

                    console.error("Deploy Registrar Contract error");
                    console.dir(error);
                    alert("Deploy Registrar Contract error");
                });
            }).catch(function(error){

                console.error("Unlock Account error");
                console.dir(error);
                alert("Unlock Account error");
            });
        },
        register: function(){

            console.log("Register");

            var _this = this;
            var registrar = null;

            for(var i = 0 ; i < this.registrars.length ; i++ ) {
                if(this.registrars[i].contract._address == this.form.register.input.registrarId){   
                    registrar = this.registrars[i];
                }
            }

            //防呆
            if(registrar.contract == null || registrar.contract == undefined){
                return;
            }

            var label = this.form.register.input.label;

            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.$parent.account.defaultPassword, 600).then(function(value){
                
                registrar.contract.methods.register(
                    web3.utils.sha3(label),
                    _this.form.register.input.owner
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
                        url: label + '.' + registrar.domain
                    });

                    console.log("register success");
                    alert("register success");
                })
                .on('confirmation', function(confirmationNumber, receipt){ 
                    //重複觸發24次 
                })
                .on('error', function(error){

                    console.error("register error");
                    console.dir(error);
                    alert("register error");
                });

            }).catch(function(error){

                console.error("Unlock Account error");
                console.dir(error);
                alert("Unlock Account error");
            });    
        },
        init: function(){

            this.registrars = [];
            this.form = {
                deploy: {
                    input: {
                        node: '',
                        label: '',
                        type: 'Test'
                    }
                },
                register: {
                    input: {
                        registrarId: '',
                        label: '',
                        owner: ''
                    }
                }
            };
        }
    },
    mounted: function () {

        //接收事件

        //初始化頁面
		this.$bus.$on('init', event => {
			this.init();
        });  
    }
}
</script>