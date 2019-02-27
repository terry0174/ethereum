pragma solidity ^0.5.0;

contract Utils {
    
    function _keccak256(bytes memory data) public pure returns (bytes32){
        
        return keccak256(data);
    }
    
    function _abiEncodePacke(bytes32 node, bytes32 label) public pure returns (bytes memory){
        
        return abi.encodePacked(node, label);
    }
    
    function _keccak256AbiEncodePacke(bytes32 node, bytes32 label) public pure returns (bytes32){
        
        return keccak256(abi.encodePacked(node, label));
    }
}