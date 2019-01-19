/* init web3 */
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.99.1:8546"));

/* init smart contract */
var contract = new web3.eth.Contract(abi, contractAddress);

/* init vue */
var app = new Vue({
    el: '#app',
    data: {
        defaultAccount: null,
        defaultPassword: null,
        addresses: [],
        newContractValue: 0,
        myContract: {
            address: null,
            seller: null,
            value: 0,
            buyer: null,
            state: null
        }
    },
    filters: {
        stateFilter: function(value) {
            
            switch (value){
                case "0":
                    return "合約已生成";
                case "1":
                    return "合約鎖定(買家已購買)";
                case "2":
                    return "合約中止(交易結束或賣家中止合約)";
            }

            return "合約未生成";
        }
    },
    methods: {
        getAccounts: async function() {

            await web3.eth.getAccounts().then(function(value){

                app.addresses = value;
            }); 

            if(this.defaultAccount == null && this.addresses.length > 0){
                this.defaultAccount = this.addresses[0]
            }

            this.updateDefaultAccount();
        },
        updateDefaultAccount: function() {

            web3.eth.defaultAccount = this.defaultAccount;

            console.log("updateDefaultAccount: " + this.defaultAccount);
        },
        updateInformation: function(){

            this.myContract.address = contract._address;

            contract.methods.seller().call().then(function(value){
                app.myContract.seller = value;
            }); 

            contract.methods.buyer().call().then(function(value){
                app.myContract.buyer = value;
            }); 

            contract.methods.value().call().then(function(value){
                app.myContract.value = web3.utils.fromWei(value, 'ether');
            }); 

            contract.methods.state().call().then(function(value){
                app.myContract.state = value;
            }); 
        },
        createNewContract: function(){

            console.log("createNewContract");

            var newContract = new web3.eth.Contract(abi);
            
            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.defaultPassword, 600).then(function(value){
                
                newContract.deploy({
                    data: byteCode
                })
                .send({
                    from: web3.eth.defaultAccount,
                    gas: 1500000,
                    gasPrice: '30000000000000',
                    value: String(web3.utils.toWei(app.newContractValue, 'ether'))
                })
                .then(function(receipt){

                    contract = receipt; //更新合約物件
                    app.updateInformation();
                    app.contractEvents();
                    console.log("createNewContract success");
                    alert("新增合約成功");
                })
                .catch(function(error){

                    console.log("createNewContract error");
                    console.dir(error);
                    alert("新增合約失敗");
                });
            });
        },
        contractEvents: function(){

            console.log("contractEvents");
            
            contract.events.allEvents()
            .on('data', function(event){

                app.updateInformation();
                console.log("event happend: " + event.event);
            })
            .on('changed', function(event){

                console.log("event changed");
            })
            .on('error',function(error){

                console.log("event error");
                console.log(error);
            });

        }, 
        abort: function(){

            console.log("abort");

            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.defaultPassword, 600).then(function(value){

                contract.methods.abort().send({
                    from: web3.eth.defaultAccount,
                    gas: 1500000,
                    gasPrice: '30000000000000'
                })
                .on('transactionHash', function(hash){

                    console.log("transactionHash : " + hash);
                })
                .on('receipt', function(receipt){

                    console.log("abort success");
                    alert("abort success");
                })
                .on('confirmation', function(confirmationNumber, receipt){ 
                    //重複觸發24次 
                })
                .on('error', function(error){

                    console.log("abort error");
                    console.dir(error);
                    alert("abort failed");
                });
            });
        },
        confirmPurchase: function(){

            console.log("confirmPurchase");

            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.defaultPassword, 600).then(function(value){

                var cost = String(parseInt(app.myContract.value) * 2);
                
                contract.methods.confirmPurchase().send({
                    from: web3.eth.defaultAccount,
                    gas: 1500000,
                    gasPrice: '30000000000000',
                    value: String(web3.utils.toWei(cost, 'ether'))
                })
                .on('transactionHash', function(hash){

                    console.log("transactionHash : " + hash);
                })
                .on('receipt', function(receipt){

                    console.log("confirmPurchase success");
                    alert("confirmPurchase success");
                })
                .on('confirmation', function(confirmationNumber, receipt){ 
                    //重複觸發24次 
                })
                .on('error', function(error){

                    console.log("confirmPurchase error");
                    console.dir(error);
                    alert("confirmPurchase failed");
                });
            });
        },
        confirmReceived: function(){

            console.log("confirmReceived");

            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.defaultPassword, 600).then(function(value){

                contract.methods.confirmReceived().send({
                    from: web3.eth.defaultAccount,
                    gas: 1500000,
                    gasPrice: '30000000000000'
                })
                .on('transactionHash', function(hash){

                    console.log("transactionHash : " + hash);
                })
                .on('receipt', function(receipt){

                    console.log("confirmReceived success");
                    alert("confirmReceived success");
                })
                .on('confirmation', function(confirmationNumber, receipt){ 
                    //重複觸發24次 
                })
                .on('error', function(error){

                    console.log("confirmReceived error");
                    console.dir(error);
                    alert("confirmReceived failed");
                });
            });           
        }
    },
    mounted: function () {  

        this.getAccounts();    
        this.updateInformation();
        this.contractEvents();
    }
})