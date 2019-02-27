<style scoped>
table th {
    min-width: 360px;
}
table table th {
    background: #e7c797;
}
table table th:nth-child(1) {
    min-width: 180px;
}
table table th:nth-child(2) {
    min-width: 400px;
}
table table td {
    background-color: #fcffcb;
}
</style>

<template>
    <div class="block">  
        <div>
            <select v-model="form.setAddr.input.resolverId">
                <option v-for="resolver in resolvers" :key="resolver.contract._address">{{resolver.contract._address}}</option>
            </select>
            <br>
            <input type="text" v-model="form.setAddr.input.node" placeholder="node">
            <span>namehash(node) = {{form.setAddr.input.node | namehash}}</span>
            <br>
            <input type="text" v-model="form.setAddr.input.address" placeholder="address">
            <button v-on:click="setAddr()">Set Addr</button>
        </div>
        <div style="padding-top:15px">
            <button v-on:click="deployResolver()">Deploy Resolver</button>
        </div>
        <table>
            <tr>
                <th>Resolver 合約地址</th>
                <th></th>
            </tr>
            <tr v-for="resolver in resolvers" :key="resolver.contract._address">
                <td>{{resolver.contract._address}}</td>
                <td>
                    <table>
                        <tr>
                            <th>domain</th>
                            <th>value</th>
                        </tr>
                        <tr v-for="addr in resolver.addrs" :key="addr.domain">
                            <td>{{addr.domain}}</td>
                            <td>{{addr.value}}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
module.exports = {
    data: function() {

        return {
            resolvers: [],
            form: {
                setAddr: {
                    input: {
                        resolverId: '',
                        node: '',
                        address: ''
                    }
                }
            }
        }
    },
	methods: {
        deployResolver: function(){

            console.log("Deploy Resolver Contract");

            var _this = this;
            var newContract = new web3.eth.Contract(publicResolverAbi);
            
            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.$parent.account.defaultPassword, 600).then(function(value){
           
                newContract.deploy({
                    arguments: [_this.$parent.ens._address],
                    data: publicResolverByteCode
                })
                .send({
                    from: web3.eth.defaultAccount,
                    gas: 4700000,
                })
                .then(function(receipt){

                    _this.resolvers.push({
                        contract: receipt,
                        addrs: []
                    }); //更新合約物件

                    console.log("Deploy Resolver Contract success");
                    alert("Deploy Resolver Contract success");
                })
                .catch(function(error){

                    console.error("Deploy Resolver Contract error");
                    console.dir(error);
                    alert("Deploy Resolver Contract error");
                });
            }).catch(function(error){

                console.error("Unlock Account error");
                console.dir(error);
                alert("Unlock Account error");
            });
        },
        setAddr: function(){

            console.log("Resolver set Addr");

            var _this = this;
            var resolver = null;

            for(var i = 0 ; i < this.resolvers.length ; i++ ) {
                if(this.resolvers[i].contract._address == this.form.setAddr.input.resolverId){                    
                    resolver = this.resolvers[i];
                }
            }

            //防呆
            if(resolver == null){
                return;
            }

            var node = this.form.setAddr.input.node;
            var address = this.form.setAddr.input.address;

            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.$parent.account.defaultPassword, 600).then(function(value){
                
                resolver.contract.methods.setAddr(
                    namehash(node),
                    address
                ).send({
                    from: web3.eth.defaultAccount,
                    gas: 4700000
                })
                .on('transactionHash', function(hash){

                    console.log("transactionHash : " + hash);
                })
                .on('receipt', function(receipt){

                    resolver.addrs.push({
                        domain: node,
                        value: address
                    }); //更新合約物件

                    //呼叫事件 setResolver, ens 裡 node 位置應和 Resolver setAddr node 位置相同
                    _this.$bus.$emit('setResolver', {
                        node: node,
                        resolver: resolver.contract._address 
                    });

                    console.log("setAddr success");
                    alert("setAddr success");
                })
                .on('confirmation', function(confirmationNumber, receipt){ 
                    //重複觸發24次 
                })
                .on('error', function(error){

                    console.error("setAddr error");
                    console.dir(error);
                    alert("setAddr error");
                });

            }).catch(function(error){

                console.error("Unlock Account error");
                console.dir(error);
                alert("Unlock Account error");
            }); 
        },
        init: function(){

            this.resolvers = [];
            this.form = {
                setAddr: {
                    input: {
                        resolverId: '',
                        node: '',
                        address: ''
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