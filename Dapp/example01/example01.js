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
        accounts: []
    },
    methods: {
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
        }
    },
    mounted: function () {     
        this.update(); 
    }
})