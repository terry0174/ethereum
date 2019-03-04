# Tools
https://github.com/FranckFreiburger/http-vue-loader  
https://vuejsexamples.com/tabbed-content-with-vue-js/  
https://github.com/zenorocha/clipboard.js

# Contract
https://github.com/terry0174/ethereum/tree/master/Solidity/ens

# Tabs
`Ens`

* Deply Contract 
    * 呼叫 JavaScript 事件 - 重整頁面 (Ens, Registrar, Resolver, Domain)  
    * 呼叫 JavaScript 事件 - Domain 新增節點
* View 
    * Owner
        * 查詢節點 Owner Address
    * Resolver
        * 查詢節點 Resolver Address
    * Addr
        * 查詢節點 Addr Value
* Function 
    * Set Subnode Owner
        * 設定子節點 Owner
        * 呼叫 JavaScript 事件 - Domain 新增節點
    * Set Resolver
        * 設定節點 Resolver
        * 呼叫 JavaScript 事件 - Domain 新增節點

`Registrar`

* Deply Contract 
    * 呼叫 JavaScript 事件 - Ens Set Subnode Owner  
    * 呼叫 JavaScript 事件 - Domain 新增 Registrar
* Function 
    * Register
        * 註冊 Registrar 底下節點
        * 呼叫 JavaScript 事件 - Domain 新增節點  

`Resolver`

* Deply Contract 
* Function 
    * Set Addr
        * 設定節點 address value  
        * 呼叫 JavaScript 事件 - Ens Set Resolver  

`Utils`

* Deply Contract 
* View 
    * keccak256(abi.encodePacked)
* JavaScript
    * web3.sha3
        * web3.utils.sha3 (for web3.js 1.0.0)
    * namehash
        ```javascript
        function namehash(name) {

            var node = '0x0000000000000000000000000000000000000000000000000000000000000000';
            
            if (name != '') {

                var labels = name.split(".");

                for(var i = labels.length - 1; i >= 0; i--) {
                    node = web3.utils.sha3(node + web3.utils.sha3(labels[i]).slice(2), {encoding: 'hex'});
                }
            }

            return node.toString();
        }
        ```
    > namehash(label.node) = keccak256( abi.encodePacked( namehash(node), sha3(label) ) )

`Domain`
* JavaScript
    * Add
        * 手動新增節點
    * Delete
        * 刪除節點
    * Update
        * 更新table
        * 每次切入 Domain 頁面自動呼叫一次

# Example
1. Deploy Ens Contract
    * Deploy Success 才可進下個步驟
2. Deploy Registrar Contract
    * Input
        * node = ''
        * label = 'com'
    * Set Subnode Owner 事件結束才可進下個步驟  
        * ens.owner(namehash('com')) = */\*registrar.address\*/*
3. Use Registrar to Register
    * Input
        * label = 'test'
        * owner = */\*default account\*/*
    * ens.owner(namehash('test.com')) = */\*default account\*/*
4. Deploy Reolver Contract
    * Deploy Success 才可進下個步驟
5. Use Reolver to Set Addr
    * Input
        * node = 'test.com'
        * address = '0x1111111111111111111111111111111111111111'
    * Set Resolver 事件結束才可進下個步驟  
        * ens.resolver(namehash('test.com')) = */\*resolver.address\*/*  
        * ens.addr('test.com') = '0x1111111111111111111111111111111111111111'
6. See Domain

    | - | Url | Registry | Resolver | Owner | Addr |
    | :---------: | --------: | :---------: | :--------: | :---------: | :--------: |
    | X |  | -  | - | 0xa0fE35dE81216D0dbc1A96d595228307b05A4490  | - |
    | X | com | Test  | - | 0xf92F06946796880EC724015664A6507304e7eA71  | - |
    | X | test.com | -  | 0x4a2185b002e2E03BB60863dDe0827C0B8026B249 | 0xa0fE35dE81216D0dbc1A96d595228307b05A4490  | 0x1111111111111111111111111111111111111111 |

    > default account = '0xa0fE35dE81216D0dbc1A96d595228307b05A4490'  
    > registrar.address = '0xf92F06946796880EC724015664A6507304e7eA71'  
    > resolver.address = '0x4a2185b002e2E03BB60863dDe0827C0B8026B249'  