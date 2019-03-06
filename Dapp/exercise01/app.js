/* init web3 */
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.99.1:8545"));
}

/* init vue */
var app = new Vue({
    el: '#app',
    data: {
        defaultAccount: null,
        defaultPassword: null,
        addresses: [],
        accounts: [],
        transation: {
            to: '',
            value: ''
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
        update: async function() {

            console.log("update start");

            newAccounts = [];

            await web3.eth.getAccounts().then(function(value){
                
                for (i = 0; i < value.length; i++) { 

                    newAccounts.push({address:value[i], ether:0});
                    console.log("address(" + i + "):" + value[i]);
                }
            });

            console.log("getAccounts end");

            for (j = 0; j < newAccounts.length; j++) { 

                await web3.eth.getBalance(newAccounts[j].address).then(function(value){
                    
                    newAccounts[j].ether =  web3.utils.fromWei(value, 'ether');
                    console.log("ether(" + j + "):" + newAccounts[j].ether);
                });

                console.log("getBalance(" + j + ") end");
            }  

            this.accounts = newAccounts;

            console.log("update end");
        },
        sentTransation: function() {

            console.log("sentTransation");

            var _this =this;

            web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.defaultPassword, 600).then(function(value){
                
                console.log("unlockAccount");

                web3.eth.sendTransaction({
                    from: web3.eth.defaultAccount,
                    to: _this.transation.to,
                    value: web3.utils.toWei(_this.transation.value, 'ether')
                })
                .then(function(receipt){

                    _this.update();
                    console.log("sentTransation success");
                    alert("傳送以太幣成功");
                })
                .catch(function(error){

                    console.log("sentTransation error");
                    console.dir(error);
                    alert("傳送以太幣失敗");
                });

            }).catch(function(error){

                console.error("Unlock Account error");
                console.dir(error);
                alert("Unlock Account error");
            });
        }
    },
    mounted: function () {     

        this.getAccounts();    
        this.update(); 
    }
})