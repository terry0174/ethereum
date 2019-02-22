# ENS
https://ens.readthedocs.io/en/latest/index.html  
https://github.com/ethereum/EIPs/blob/master/EIPS/eip-137.md
## Source
https://github.com/ensdomains/ens/tree/master/contracts  
https://github.com/ensdomains/resolvers/tree/master/contracts
## Contract
### ENS.sol
> 符合 EIP-137 規範的 Interface
### ENSRegistry.sol
> ENS 的實作
### FIFSRegistrar.sol
> 先到先得 (first-in-first-served) Registrar
### TestRegistrar.sol
> Example Registrar  
> 註冊後限期 4 weeks
### PublicResolver.sol
> Resolver
## JavaScript
### myEnsUtils.js
[ensutils.js]: https://github.com/ensdomains/ens/blob/master/ensutils.js
> 直接載入 geth console 介面使用  
> 修改自[ensutils.js]

`發佈 ENSRegistry`
```Javascript
deployEns()
```

`發佈 FIFSRegistrar`
> node 底下的 Domain 使用 FIFSRegistrar 分配所有權
```Javascript
deployFifsRegistrar(node)
```

`發佈 TestRegistrar`
> node 底下的 Domain 使用 TestRegistrar 分配所有權
```Javascript
deployTestRegistrar(node)
```

`發佈 PublicResolver`
```Javascript
deployPublicResolver()
```

`url 計算 hash`
```Javascript
namehash(name)
```
> 計算 keccak256(abi.encodePacked(node, label))
```Javascript 

    Example 1:
        node = "0x00" // namehash('') = "0x00"
        label = web3.sha3('com')
        // => namehash('com') == keccak256(abi.encodePacked(node, label))
        
    Example 2:
        node = namehash('com')
        label = web3.sha3('abc')
        // => namehash('abc.com') == keccak256(abi.encodePacked(node, label))
    
    Example 3:
        node = namehash('abc.com')
        label = web3.sha3('123')
        // => namehash('123.abc.com') == keccak256(abi.encodePacked(node, label))

```
`取得 address`
```Javascript
getAddr(name)
```

## Example
`load script`
```Javascript
loadScript('myEnsUtils.js')
```
`deploy`
> 發佈 Contract  
>> 發佈 Contract 成功後才可發佈下一個 Contract
> 
> 分配 test 底下的 Domain 給 TestRegistrar (也可替換為 FIFSRegistrar )
>> "0x00" = namehash('')
```Javascript
deployEns() 
deployTestRegistrar(namehash('test'))
ens.setSubnodeOwner(0x00, web3.sha3('test'), testRegistrar.address, {from: eth.accounts[0]})
deployPublicResolver()
```
`register`
> 將 test Domain 底下分配 myname 給 eth.accounts[0]
```Javascript
testRegistrar.register(web3.sha3('myname'), eth.accounts[0], {from: eth.accounts[0]})
```
`resolver`
> 分配 Resolver
> 設定 myname.test 解碼為 eth.accounts[0] 的 address
```Javascript
ens.setResolver(namehash('myname.test'), publicResolver.address, {from: eth.accounts[0]})
publicResolver.setAddr(namehash('myname.test'), eth.accounts[0], {from: eth.accounts[0]})
```
`get address`
> 取得 myname.test 解碼後的內容
```Javascript
getAddr('myname.test')
```