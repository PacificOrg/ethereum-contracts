pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract EtherTransfers is Ownable {
  event TransferDenied(address indexed to, uint256 value);

 /**
  * @dev Transfers ETH to given beneficiaries.
  * @param beneficiaries List of addresses that will receive ETH.
  * @param values List of values to send.
  */
  function sendEther(address payable[] memory beneficiaries, uint256[] memory values) public payable onlyOwner {
    require(beneficiaries.length == values.length);

    for (uint256 i = 0; i < beneficiaries.length; ++i) {
      if (beneficiaries[i] == address(0) || values[i] == 0) {
        emit TransferDenied(beneficiaries[i], values[i]);
      } else {
        beneficiaries[i].transfer(values[i]);
      }
    }
  }
}
