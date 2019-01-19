# step 1 佈署purchase.sol

# step 2 新增contract.js

`contract.js`
```javascript
var contractAddress = /* your contract address */;
var abi = /* your abi */;
```
`index.html`
```html
    <script src="./contract.js"></script>
```
# step 3 取得contract

`app.js`
```javascript
/* init smart contract */
var contract = new web3.eth.Contract(abi, contractAddress);
```
# step 4 顯示contract資訊

`app.js`
```javascript
var app = new Vue({
    el: '#app',
    data: {
        myContract: {
            address: null,
            seller: null,
            value: 0,
            buyer: null,
            state: null
        }
    },
```
`app.js`
```javascript
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
        }
```
`app.js`
```javascript
    mounted: function () {  

        this.updateInformation();
    }
```
`app.js`
```javascript
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
```
`index.html`
```html
        <div>
            <table>
                <tr>
                    <th>合約地址</th>
                    <td>{{myContract.address}}</td>
                </tr>
                <tr>
                    <th>賣家</th>
                    <td>{{myContract.seller}}</td>
                </tr>
                <tr>
                    <th>售價</th>
                    <td>{{myContract.value}} ether</td>
                </tr>
                <tr>
                    <th>買家</th>
                    <td>{{myContract.buyer}}</td>
                </tr>
                <tr>
                    <th>狀態</th>
                    <td>{{myContract.state | stateFilter}}</td>
                </tr>
            </table>
        </div>
```
`app.css`
```css
#app {
    padding: 15px;   
}
#app div{
    padding: 5px; 
}
table{
    width: 660px;
}
th, td {
    padding: 10px;   
}
th {
    width: 35%;
    font-size: 14pt;
    background: #a8badc;
}
td {
    width: 65%;
    text-align: right;
    background-color: #cbecff;
}
```
# step 5 取得帳戶

`app.js`
```javascript
var app = new Vue({
    el: '#app',
    data: {
        addresses: [],
        myContract: {
            address: null,
            seller: null,
            value: 0,
            buyer: null,
            state: null
        }
    },
```
`app.js`
```javascript
        getAccounts: async function() {

            await web3.eth.getAccounts().then(function(value){

                app.addresses = value;
            }); 
        },
```
`app.js`
```javascript
    mounted: function () {  

        this.getAccounts();    
        this.updateInformation();
    }
```
`index.html`
```html
        <div>
            <div>
                <span>Default Accounts:</span>
                <select>
                    <option v-for="address in addresses" :key="address">{{address}}</option>
                </select>
                <button v-on:click="getAccounts()">refresh</button>
            </div>
        </div>    
```
`app.css`
```css
#app div div{
    padding: 2px; 
}
#app div div button{
    margin-left: 10px;
}
span {
    display: inline-block;
    width: 120px;
    padding: 5px; 
}
select {
    width: 350px;
    -ms-box-sizing:content-box;
    -moz-box-sizing:content-box;
    -webkit-box-sizing:content-box; 
    box-sizing:content-box;
}
```
`app.css`        
```css
button {
    width: 140px;
    height: 30px;
    border-width: 0px;
    border-radius: 5px;
    background: #0c30b7;
    color: white;
}
button:active {
    background: #51b1ff;
    color: black;
}
```
# step 6 設定帳戶與密碼

`app.js`
```javascript
var app = new Vue({
    el: '#app',
    data: {
        defaultAccount: null,
        defaultPassword: null,
        addresses: [],
        myContract: {
            address: null,
            seller: null,
            value: 0,
            buyer: null,
            state: null
        }
    },
```
`app.js`
```javascript
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
```
`index.html`
```html
            <div>
                <span>Default Accounts:</span>
                <select v-model="defaultAccount" v-on:change="updateDefaultAccount()">
                    <option v-for="address in addresses" :key="address">{{address}}</option>
                </select>
                <button v-on:click="getAccounts()">refresh</button>
            </div>
            <div>
                <span>Password:</span>
                <input type="password" v-model="defaultPassword" placeholder="password">
            </div>
```
`app.css`   
```css
select, input {
    width: 350px;
    -ms-box-sizing:content-box;
    -moz-box-sizing:content-box;
    -webkit-box-sizing:content-box; 
    box-sizing:content-box;
}
```
# step 7 新增合約

`contract.js`
```javascript
var byteCode = /* your byte code */;
```
`app.js`
```javascript
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
```    
`app.js`
```javascript
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
                    console.log("createNewContract success");
                    alert("新增合約成功");
                })
                .catch(function(error){

                    console.log("createNewContract error");
                    console.dir(error);
                    alert("新增合約失敗");
                });
            });
        }
```    
`index.html`
```html
            <div>  
                <span>New contract :</span>
                <input type="number" v-model="newContractValue" placeholder="ether">
                <button v-on:click="createNewContract()">Create</button>
            </div>
```
# step 8 新增合約事件 
    
`app.js`
```javascript
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
```    
`index.html`
```html
        <div>
            <button v-on:click="abort()">abort</button>
            <button v-on:click="confirmPurchase()">confirmPurchase</button>
            <button v-on:click="confirmReceived()">confirmReceived</button>
        </div>       
```
# step 9 監聽合約事件     

`app.js`
```javascript
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.99.1:8546"));
```    
`app.js`
```javascript
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
```    
`app.js`
```javascript
                .then(function(receipt){

                    contract = receipt; //更新合約物件
                    app.updateInformation();
                    app.contractEvents();
                    console.log("createNewContract success");
                    alert("新增合約成功");
                })     
```    
`app.js`
```javascript
    mounted: function () {  

        this.getAccounts();    
        this.updateInformation();
        this.contractEvents();
    }
```