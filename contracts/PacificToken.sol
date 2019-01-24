pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

/**
 * @title PacificToken
 * @dev ERC20 Token contract, where all tokens are pre-assigned to the creator.
 */
contract PacificToken is ERC20, ERC20Detailed {
  address[] private _holdersList;
  mapping (address => bool) private _holdersMapping;

  mapping (address => bool) private _vestingHolders;
  uint256 private _vestingEnd;

 /**
  * @dev Constructor that gives msg.sender all of existing tokens.
  * @param vestingHolders List of addresses that will be vesting tokens.
  * @param vestingEnd The time (as Unix timestamp) at which point vesting ends.
  */
  constructor (address[] memory vestingHolders, uint256 vestingEnd) public ERC20Detailed("Pacific", "PCF", 8) {
    _vestingEnd = vestingEnd;

    for (uint256 i = 0; i < vestingHolders.length; ++i) {
      _vestingHolders[vestingHolders[i]] = true;
    }

    _mint(msg.sender, 100000000000000000);

    _holdersList.push(msg.sender);

    _holdersMapping[msg.sender] = true;
  }

  /**
  * @dev Transfer token for a specified addresses
  * @param from The address to transfer from.
  * @param to The address to transfer to.
  * @param value The amount to be transferred.
  */
  function _transfer(address from, address to, uint256 value) internal {
    require(_canTransfer(from));

    if (!_holdersMapping[to]) {
      _holdersList.push(to);

      _holdersMapping[to] = true;
    }

    super._transfer(from, to, value);
  }

  /**
  * @dev Return list of holders that have at least amount of tokens
  * @param amount The required amount of tokens.
  */
  function getHolders(uint256 amount) public view returns (address[] memory) {
    address[] memory result = new address[](_holdersList.length);
    uint256 index = 0;
    uint256 i = 0;

    for (i = 0; i < _holdersList.length; ++i) {
      if (balanceOf(_holdersList[i]) >= amount) {
        result[index] = _holdersList[i];

        ++index;
      }
    }

    if (index < result.length) {
      address[] memory temporaryResult = new address[](index);

      for (i = 0; i < index; ++i) {
        temporaryResult[i] = result[i];
      }

      result = temporaryResult;
    }

    return result;
  }

  /**
  * @dev Check if given address is allowed to transfer tokens
  * @param from The address of account to transfer from.
  */
  function _canTransfer(address from) internal view returns (bool) {
    return (!_vestingHolders[from] || block.timestamp >= _vestingEnd);
  }
}
