# Function
```javascript
function (<parameter types>) {internal|external|public|private} [pure|constant|view|payable] [(modifiers)] [returns (<return types>)]
```

`Example 01`

```javascript
    function sayHello() public view returns (string memory) {
        return hello;
    }
```

`Example 02`

```javascript
    function sayHello() public view returns (string memory) {

        hello = "hello abc";

        return hello;
    }
```
> compile error

`Example 03`

```javascript
    function sayHello() public pure returns (string memory) {
        return hello;
    }
```
> compile error

`Example 04`

```javascript
    function sayHello() public payable returns (string memory) {
        return hello;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
```

`Example 05`

```javascript
    modifier enough() {
        require(address(this).balance > 10, "錢不夠");
        _;
    }
    
    function sayHello() public payable enough returns (string memory) {
        return hello;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
```

`Example 06`

```javascript
    function sayHello() public view returns (string memory helloWord) {
        helloWord = hello;
    }
```

`Example 07`

```javascript
    function sayHello(string memory name) public view returns (string memory, string memory) {
        return (name,hello);
    }
```

