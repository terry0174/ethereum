pragma solidity >=0.4.22 <0.6.0;

contract helloWorld {

    string public hello = "hello world";

    function sayHello() public returns (string memory) {
        return hello;
    }
} 
