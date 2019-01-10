pragma solidity >=0.4.22 <0.6.0;

contract ERC20Interface{
    
    function totalSupply() public view returns (uint256);
    function balanceOf(address _owner) public view returns (uint256 balance);
    function transfer(address _to, uint256 _value) public returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
    function approve(address _spender, uint256 _value) public returns (bool success);
    function allowance(address _owner, address _spender) public view returns (uint256 remaining);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract ERC20Token is ERC20Interface{
    
    string public name; //token名稱
    string public symbol; //token符號   
    uint8 public decimals; //token使用小數點位數
    uint256 private _totalSupply; //token總發行量
    
    mapping(address=>uint256) balances; //帳戶餘額
    mapping(address=>mapping(address=>uint256)) allowances; //允許轉帳
    
    constructor(string _name,string _symbol, uint8 _decimals,uint256 _supply) public{ 
        
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        _totalSupply = _supply;
        balances[msg.sender] = _supply;
    }
    
    //取得總發行量
    function totalSupply() public view returns (uint256){
        return _totalSupply;
    }
    
    //取得帳戶餘額
    function balanceOf(address _owner) public view returns (uint256 balance){
        return balances[_owner];
    }
    
    //從自己帳戶轉移value token到to
    function transfer(address _to, uint256 _value) public returns (bool success){
        
        require(_value > 0, "value必須大於0"); 
        require(balances[msg.sender] > _value, "自己的帳戶餘額需大於value");
        
        balances[_to] += _value;
        balances[msg.sender] -= _value;
        
        emit Transfer(msg.sender, _to, _value);
        
        return true;
    }
    
    //由msg.sender替代,從from轉移value token到to
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        
        uint256 allowan = allowances[_from][msg.sender];
        
        require(_value >= 0, "value必須大於等於0"); 
        require(allowan >= _value, "授權提領數量需大於等於value");
        require(balances[_from] >= _value, "from帳戶餘額需大於value");
        
        allowances[_from][msg.sender] -= _value;
        balances[_from] -= _value;
        balances[_to] += _value;
        
        emit Transfer(_from, _to, _value);
        
        return true;
    }
    
    //授權spender從自己帳戶提領value token
    function approve(address _spender, uint256 _value) public returns (bool success){
        
        require(_value > 0, "value必須大於0");
        require(balances[msg.sender] >= _value, "自己的帳戶餘額需大於value");
        
        allowances[msg.sender][_spender] = _value;
        
        emit Approval(msg.sender, _spender, _value);
        
        return true;
    }
    
    //查詢owner允許spender提領的token
    function allowance(address _owner, address _spender) public view returns (uint256 remaining){
        return allowances[_owner][_spender];
    }
}

