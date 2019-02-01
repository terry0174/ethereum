pragma solidity >=0.5.0 <0.6.0;

contract Purchase {
    
    uint public value; //商品售價
    address payable public seller; //賣家
    address payable public buyer; //買家
    
    /**
     * Created - 合約已生成(可由買家購買或賣家中止合約)
     * Locked - 合約鎖定(買家已購買)
     * Inactive - 合約中止(交易結束或賣家中止合約)
     */
    enum States { Created, Locked, Inactive }
    States public contractState;

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyer, "只有買家可以呼叫");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "只有賣家可以呼叫");
        _;
    }

    modifier inState(States _state) {
        require(contractState == _state, "當前狀態無法呼叫此函式");
        _;
    }

    event Aborted();
    event PurchaseConfirmed();
    event ItemReceived();

    //建立合約,賣家存放2倍商品售價作為押金
    //以太幣由合約帳戶鎖定。
    constructor() public payable {
        
        seller = msg.sender;
        value = msg.value / 2;
        
        require((2 * value) == msg.value, "Value必須為偶數");
    }

    //賣家中止合約並回收押金。
    //只能在合約鎖定前,並由賣家調用。
    function abort() public onlySeller inState(States.Created) {
        
        contractState = States.Inactive;
        seller.transfer(address(this).balance);
        
        emit Aborted();
    }

    //買家購買商品,並支付2倍售價以太幣(含押金)。
    //以太幣由合約帳戶鎖定。
    function confirmPurchase() public inState(States.Created) condition(msg.value == (2 * value)) payable {
        
        buyer = msg.sender;
        contractState = States.Locked;
        
        emit PurchaseConfirmed();
    }

    //買家通知合約已收到商品。
    //釋放合約鎖定的以太幣。
    function confirmReceived() public onlyBuyer inState(States.Locked) {
        
        contractState = States.Inactive;
        
        buyer.transfer(value);
        seller.transfer(address(this).balance);
        
        emit ItemReceived();
    }
}