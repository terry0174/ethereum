<style scoped>
table{
    min-width: 1200px;
}
td:nth-child(1) {
    text-align: right;
    padding-right: 20px;
}
</style>
<template>
    <div class="block">
        <div>
            <button v-on:click="update()">Update</button>
        </div>
        <table>
            <tr>
                <th>Url</th>
                <th>Registry</th>
                <th>Resolver</th>
                <th>Owner</th>
                <th>Addr</th>
            </tr>
            <tr v-for="node in nodes" :key="node.url">
                <td>{{node.url}}</td>
                <td>{{node.registry | zeroCheck}}</td>
                <td>{{node.resolver | zeroCheck}}</td>
                <td>{{node.owner | zeroCheck}}</td>
                <td>{{node.addr | zeroCheck}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
module.exports = {
    data: function() {

        return {
            nodes: [],
            registrars: []
        }
    },
    filters: {
        zeroCheck: function(value){
            
            if(value =='' || value == '0x0000000000000000000000000000000000000000'){
                return '-';
            }

            return value;
        }
    },
	methods: {
        addNode: function(url){

            var i = this.nodes.findIndex(function(node) {
                return node.url == url;
            });

            if(i < 0){
                this.nodes.push({
                    url: url,
                    registry: '',
                    resolver: '',
                    owner: '',
                    addr: ''
                });
            }
        },
        update: async function(){

            //防呆
            if(this.$parent.ens._address == null || this.$parent.ens._address == undefined){
                return;
            }

            var _this = this;

            for(var i = 0; i < this.nodes.length; i++){

                var hash = namehash(_this.nodes[i].url);

                await this.$parent.ens.methods.owner(hash).call().then(function(value){
                    _this.nodes[i].owner = value;
                });  

                var j = this.registrars.findIndex(function(registrar){
                    return registrar.address == _this.nodes[i].owner;
                });

                if(j >= 0) {
                    _this.nodes[i].registry = this.registrars[j].type;
                }

                await this.$parent.ens.methods.resolver(hash).call().then(function(value){
                    _this.nodes[i].resolver = value;
                });    

                _this.nodes[i].addr = await getAddr(this.$parent.ens, _this.nodes[i].url);
            }

            //排序
            this.nodes.sort(function(a, b) {

                var strA = '';
                var strB = '';
                var listA = a.url.split(".");
                var listB = b.url.split(".");

                for(var i = listA.length-1; i >= 0; i--){
                    strA += listA[i]; 
                    strA += '.'; 
                }

                for(var i = listB.length-1; i >= 0; i--){
                    strB += listB[i]; 
                    strB += '.'; 
                }

                if(strA > strB){
                    return 1;
                }

                if(strA < strB){
                    return -1;
                }

                return 0;
            });
        },
        init: function(){

            this.nodes = [];
            this.registrars = [];
        }
    },
    mounted: function () {

        //接收事件

        //新增Url
		this.$bus.$on('addNode', event => {
			this.addNode(event.url);
        });  

        //新增Registrar
		this.$bus.$on('addRegistrar', event => {

            if(this.registrars.indexOf(event.address) < 0){

                this.registrars.push({
                    address: event.address,
                    type: event.type
                });
            }
        });  

        //頁面更新
		this.$bus.$on('update', event => {
            this.update();
        });  

        //初始化頁面
		this.$bus.$on('init', event => {
			this.init();
        });  
    }
}
</script>