/* init web3 */
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.99.1:8546"));

//clipboard
var clipboard = new ClipboardJS('.btn');

clipboard.on('success', function(e) {
    console.info('copy text:', e.text);
    e.clearSelection();
});

clipboard.on('error', function(e) {
    console.info('copy error');
});

//bus
Object.defineProperty(Vue.prototype, '$bus', {
    get() {
        return this.$root.bus;
    }
});

var bus = new Vue({}) ;

//global filters

Vue.filter('namehash', function(value) {

    try{
        return namehash(value);
    }
    catch(e) {
        return null;
    }
});

Vue.filter('sha3', function(value) {
    return web3.utils.sha3(value);
});

/* init vue */
var app = new Vue({
    el: '#app',
    components: {
        'component-ens': httpVueLoader('vue/ens.vue'),
        'component-registrar': httpVueLoader('vue/registrar.vue'),
        'component-resolver': httpVueLoader('vue/resolver.vue'),
        'component-utils': httpVueLoader('vue/utils.vue'),
        'component-domain': httpVueLoader('vue/domain.vue')
    },
    data: {
        bus : bus,
        activetab: 1,
        account: {
            defaultAccount: null,
            defaultPassword: null,
            addresses: []
        },
        ens: {}
    },
    methods: {
        getAccounts: async function() {

            await web3.eth.getAccounts().then(function(value){

                app.account.addresses = value;
            }); 

            if(this.account.defaultAccount == null && this.account.addresses.length > 0){
                this.account.defaultAccount = this.account.addresses[0]
            }

            this.updateDefaultAccount();
        },
        updateDefaultAccount: function() {

            web3.eth.defaultAccount = this.account.defaultAccount;

            console.log("updateDefaultAccount: " + this.account.defaultAccount);
        },
        updateDomain: function() {
            this.$bus.$emit('update');
        }
    },
    mounted: function () {  

        //取得 Account 列表
        this.getAccounts();      
    }
})