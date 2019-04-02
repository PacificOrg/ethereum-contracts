# Pacific.org's Smart Contracts

This repository hosts source code of on-chain part of [Pacific.org](https://www.pacific.org).
All smart contracts are located in the contracts folder.

[![Smart Contracts](https://raw.githubusercontent.com/PacificOrg/contracts/master/docs/contracts.jpg)](https://raw.githubusercontent.com/PacificOrg/contracts/master/docs/contracts.jpg)

## Development

Requirements:

 * [Node.js](https://nodejs.org/en/)
 * [git](https://git-scm.com/download/)

Setup:

 1. install truffle: `npm install -g truffle`
 2. clone the repository: `git clone https://github.com/PacificOrg/contracts`
 3. change into the root directory: `cd contracts`
 4. install all Node.js requirements from package.json: `npm install`

### Migrating and testing with truffle develop

 * run: `truffle develop`
 * compile: `compile`
 * migrate: `migrate`
 * run tests: `test`

## Contracts

### Contract `PacificToken`

ERC20 compatible token contract (see [wiki for documentation](https://theethereum.wiki/w/index.php/ERC20_Token_Standard)) with extra features allowing to freeze transfers from specified accounts before given time and to return list of the accounts having specified amount of tokens.

#### Methods

`getHolders(uint256 amount) public view returns (address[] memory)`

### Contract `EtherTransfers`

Contract responsible for sending Ether.

#### Events

`TransferDenied(address indexed to, uint256 value)`

#### Methods

`sendEther(address payable[] memory beneficiaries, uint256[] memory values) public payable onlyOwner`

### Contract `TokenTransfers`

Contract responsible for sending ERC20 compatible tokens.

#### Events

`TransferDenied(address indexed to, uint256 value)`

#### Methods

`sendToken(ERC20 token, address[] memory beneficiaries, uint256[] memory values) public onlyOwner`
