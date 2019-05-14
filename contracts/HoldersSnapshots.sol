pragma solidity 0.5.0;

import "./PacificToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title HoldersSnapshots
 * @dev Contract for making snapshots of balances of PacificToken.
 */
contract HoldersSnapshots is Ownable {
  struct StateSnapshot {
    address[] accounts;
    uint256[] balances;
  }

  PacificToken _token;
  StateSnapshot[] _snapshots;

  event SnapshotCreated(uint256 identifier);

 /**
  * @dev Constructor.
  * @param token Address of PacificToken instance.
  */
  constructor (address token) public {
    _token = PacificToken(token);
  }

  /**
  * @notice Creates new snapshot.
  */
  function snapshot() public onlyOwner returns (uint256) {
    StateSnapshot memory state;
    state.accounts = _token.getHolders(1000000000000);
    state.balances = new uint256[](state.accounts.length);

    for (uint256 i = 0; i < state.accounts.length; ++i) {
      state.balances[i] = _token.balanceOf(state.accounts[i]);
    }

    _snapshots.push(state);

    emit SnapshotCreated(_snapshots.length - 1);

    return (_snapshots.length - 1);
  }

  /**
  * @notice Returns list of holders that have at least specified amount of tokens for given snapshot identifier.
  * @param identifier Identifier of the snapshot.
  */
  function getHoldersAt(uint256 identifier) public view returns (address[] memory) {
    require(identifier < _snapshots.length);

    return _snapshots[identifier].accounts;
  }

  /**
  * @notice Returns balance of given account for given snapshot identifier.
  * @param account Address of the account to check.
  * @param identifier Identifier of the snapshot.
  */
  function balanceOfAt(address account, uint256 identifier) public view returns (uint256) {
    require(identifier < _snapshots.length);

    StateSnapshot memory state = _snapshots[identifier];

    for (uint256 i = 0; i < state.accounts.length; ++i) {
      if (state.accounts[i] == account) {
        return state.balances[i];
      }
    }

    return 0;
  }

  /**
  * @notice Returns the latest snapshot identifier.
  */
  function getLatestSnapshotIdentifier() public view returns (uint256) {
    require(_snapshots.length > 0);

    return (_snapshots.length - 1);
  }
}
