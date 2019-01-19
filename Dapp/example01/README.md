# step 1 建立變數account,並建立table

`app.js`
```javascript
var app = new Vue({
    el: '#app',
    data: {
        accounts: []
    },
```
`index.html`
```html
        <table>
            <tr>
                <th>address</th>
                <th>ether</th>
            </tr>
            <tr v-for="account in accounts" :key="account.address">
                <td>{{account.address}}</td>
                <td>{{account.ether}} ether</td>
            </tr>
        </table>
```
# step 2 建立function負責更新accounts,設定async同步處理promise

`app.js`
```javascript
    methods: {
        update: async function() {

        }
    },
```
# step 3 update function更新accounts

`app.js`
```javascript
            console.log("update start");

            newAccounts = [];

            await web3.eth.getAccounts().then(function(value){
                
                for (i = 0; i < value.length; i++) { 

                    newAccounts.push({address:value[i], ether:0});
                    console.log("address(" + i + "):" + value[i]);
                }
            });

            console.log("getAccounts end");

            this.accounts = newAccounts;

            console.log("update end");
```
# step 4 新增update按鈕

`index.html`
```html
        <button v-on:click="update()">update</button>
```
`app.css`
```css
#app {
    padding: 15px;   
}
tr:nth-child(even) {
    background: #d5def1
}
tr:nth-child(odd) {
    background-color: #cbecff;
}
tr:first-child {
    background: #a8badc;
}
th, td {
    padding: 10px;   
}
th {
    font-size: 14pt;
}
td:nth-child(2) {
    text-align: right;
}
button {
    width: 150px;
    height: 30px;
    border-width: 0px;
    border-radius: 5px;
    background: #0c30b7;
    color: white;
    margin-top: 10px
}
button:active {
    background: #51b1ff;
    color: black;
}
```
# step 5 載入時自動執行update function

`app.js`
```javascript
    mounted: function () {     
        this.update(); 
    }
```
# step 6 查詢每個帳戶的餘額

`app.js`
```javascript
            for (j = 0; j < newAccounts.length; j++) { 

                await web3.eth.getBalance(newAccounts[j].address).then(function(value){
                    
                    newAccounts[j].ether =  web3.utils.fromWei(value, 'ether');
                    console.log("ether(" + j + "):" + newAccounts[j].ether);
                });

                console.log("getBalance(" + j + ") end");
            }  
```