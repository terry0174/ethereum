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
.tips{
    padding-top: 15px;
}
.tips span {
    display: inline;
    padding: 0px;
    min-width: 10px; 
    font-style: italic;  
}
</style>

<template>
    <div class="block">
        <div>
            <table>
                <tr> 
                    <th>Util 合約地址</th>
                    <td>
                        {{contract._address}} 
                        <div>
                            <button v-on:click="deployUtils()">Deploy</button>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <input type="text" v-model="form.namehash.input" placeholder="node" style="margin: 6px 5px 2px 0px">
            <span>namehash(node) = {{form.namehash.input | namehash}}</span>
            <br>
            <input type="text" v-model="form.sha3.input" placeholder="label" style="margin: 6px 5px 2px 0px">
            <span>web3.sha3(label) = {{form.sha3.input | sha3}}</span>
        </div>
        <div>
            <input type="text" v-model="form.keccak256.input.node" placeholder="namehash(node)">
            <br>
            <input type="text" v-model="form.keccak256.input.label" placeholder="sha3(label)">
            <button v-on:click="keccak256()" class="long-button">keccak256(abi.encodePacked)</button>
            <span>{{form.keccak256.output}}</span>
        </div>
        <div class="tips">
            <span>keccak256(</span>
            <span>abi.encodePacked(</span>
            <span>namehash(node),</span>
            <span>sha3(label)</span>
            <span>)</span>
            <span>)</span>
            <span>=</span>
            <span>namehash(label.node)</span>
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function() {

        return {
            contract: {},
            form: {
                sha3: {
                    input: ''
                },
                namehash: {
                    input: ''
                },
                keccak256: {
                    input: {
                        node: '',
                        label: ''
                    },
                    output: ''
                }
            }
        }
    },
	methods: {
        deployUtils: function() {

            console.log("Deploy Utils Contract");

            var _this = this;
            var newContract = new web3.eth.Contract(utilsAbi);
            
            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.$parent.account.defaultPassword, 600).then(function(value){
           
                newContract.deploy({
                    data: utilsByteCode
                })
                .send({
                    from: web3.eth.defaultAccount,
                    gas: 4700000,
                })
                .then(function(receipt){

                    _this.contract = receipt; //更新合約物件
                    console.log("Deploy Utils Contract success");
                    alert("Deploy Utils Contract success");
                })
                .catch(function(error){

                    console.error("Deploy Utils Contract error");
                    console.dir(error);
                    alert("Deploy Utils Contract error");
                });
            }).catch(function(error){

                console.error("Unlock Account error");
                console.dir(error);
                alert("Unlock Account error");
            });
        },
        keccak256: function() {

            //防呆
            if(this.contract._address == null || this.contract._address == undefined){
                
                this.form.keccak256.output = '';
                return;
            }
            
            var _this = this;
            
            this.contract.methods._keccak256AbiEncodePacke(this.form.keccak256.input.node, this.form.keccak256.input.label).call().then(function(value){
                _this.form.keccak256.output = value;
            });
        }
    }
}
</script>