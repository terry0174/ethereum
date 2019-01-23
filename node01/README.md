# 
# OS

https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum

# Docker

### Pull Image
```Bash
docker pull ethereum/client-go:alltools-stable
```
### Docker Run 
```Bash
docker run –it --name ethereum-docker -v $HOME/ethereum-docker:/ethereum -p 8545:8545 –p 8546:8546 -p 30303:30303 ethereum/client-go:alltools-stable
```
> $HOME/ethereum-docker 請自行更改
> 如果需要挖礦需加上最低配置: 
>> --cpus=4 --memory 2048MB

# 建立私有鍊 

### 建立創世區塊
```Bash
puppeth
```

### 初始化節點
```Bash
geth --datadir data init asgard01.json
```
> data 請改為自己的workspace
> asgard01.json 請改為自己的創世區塊

### Start
```Bash
geth --datadir ./data --networkid 123456 --rpc --rpcaddr=0.0.0.0 --rpccorsdomain="*" --rpcapi=db,eth,net,web3,personal --ws --wsaddr=0.0.0.0 --wsorigins="*" --wsapi=db,eth,net,web3,personal console
```
### End
```Bash
exit
```

# 其他指令

`檢查版本`
```Bash
geth version
```
`Help`
```Bash
geth help
```
`新增帳號`
```Bash
geth --datadir ./data account new
```
> data 請改為自己的workspace

`新建帳戶`
```javascript
personal.newAccount(password)
```
`當前節點持有帳戶列表`
```javascript
eth.accounts
```
`指定位置的餘額`
```javascript
eth.getBalance(address)
```
`wei換算成特定單位`
```javascript
web3.fromWei(wei,unit)

//example:
    web3.fromWei(eth.getBalance(eth.accounts[0])) 
```
`取得節點enode url `
```javascript
admin.nodeInfo.enode
```
`加入節點`
```javascript
admin.addPeer(enode)
```
`列舉節點狀態`
```javascript
admin.peers
```
`當前節點礦工`
```javascript
eth.coinbase
```
`設定礦工`
```javascript
miner.setEtherbase(address)
```
`開始挖礦`
```javascript
miner.start(threads)
```
`停止挖礦`
```javascript
miner.stop()
```
`挖礦，挖到一個礦即停止`
```javascript
miner.start(1);admin.sleepBlocks(1);miner.stop();
```
`檢視區塊數`
```javascript
eth.blockNumber
```
`取得區塊資訊`
```javascript
eth.getBlock(number)

//example:
    eth.getBlock(eth.blockNumber)
```
`默認帳戶`
```javascript
eth.defaultAccount
```
`解鎖帳戶`
```javascript
personal.unlockAccount(address,password)
```
`發送交易`
```javascript
eth.sendTransaction({from:address,to:address,value:number})

//example:
    eth.sendTransaction({
        from : eth.accounts[0],
        to : eth.accounts[1],
        value : web3.toWei(1, "ether")
    }) 
```
`檢視交易池`
```javascript
txpool.status
```
`檢視交易`
```javascript
eth.getTransaction(address)
```






