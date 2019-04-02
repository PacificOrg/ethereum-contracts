const PacificToken = artifacts.require('PacificToken');
const EtherTransfers = artifacts.require('EtherTransfers');

contract('EtherTransfers', function(accounts) {
  it('check owner of contract', async() => {
    const instance = await EtherTransfers.new();

    assert.equal((await instance.owner.call()).toString(), accounts[0], 'Owner is different than ' + accounts[0]);
  });
  it('check sending ETH', async() => {
    const balances = ['100000000000000000100', '100000000000000000200', '100000000000000000300'];
    const instance = await EtherTransfers.new();
    await instance.sendEther([accounts[1], accounts[2], accounts[3]], [100, 200, 300], {from: accounts[0], value: 600});

    assert.equal([(await web3.eth.getBalance(accounts[1])), (await web3.eth.getBalance(accounts[2])), (await web3.eth.getBalance(accounts[3]))].join(', '), balances.join(', '), 'List of holders is different than [' + balances.join(', ') + ']');
  });
});
