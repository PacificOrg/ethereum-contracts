const PacificToken = artifacts.require('PacificToken');
const Transfers = artifacts.require('Transfers');

contract('Transfers', function(accounts) {
  it('check owner of contract', async() => {
    const instance = await Transfers.new();

    assert.equal((await instance.owner.call()).toString(), accounts[0], 'Owner is different than ' + accounts[0]);
  });
  it('check sending ETH', async() => {
    const balances = ['100000000000000000100', '100000000000000000200', '100000000000000000300'];
    const instance = await Transfers.new();
    await instance.sendEther([accounts[1], accounts[2], accounts[3]], [100, 200, 300], {from: accounts[0], value: 600});

    assert.equal([(await web3.eth.getBalance(accounts[1])), (await web3.eth.getBalance(accounts[2])), (await web3.eth.getBalance(accounts[3]))].join(', '), balances.join(', '), 'List of holders is different than [' + balances.join(', ') + ']');
  });
  it('check sending tokens', async() => {
    const balances = ['100', '200', '300'];
    const tokenInstance = await PacificToken.new(['0x0000000000000000000000000000000000000000'], 0);
    const transfersInstance = await Transfers.new();

    await tokenInstance.transfer(transfersInstance.address, 600, {from: accounts[0]});

    await transfersInstance.sendToken(tokenInstance.address, [accounts[1], accounts[2], accounts[3]], [100, 200, 300], {from: accounts[0]});

    assert.equal([(await tokenInstance.balanceOf.call(accounts[1])), (await tokenInstance.balanceOf.call(accounts[2])), (await tokenInstance.balanceOf.call(accounts[3]))].join(', '), balances.join(', '), 'List of holders is different than [' + balances.join(', ') + ']');
  });
});
