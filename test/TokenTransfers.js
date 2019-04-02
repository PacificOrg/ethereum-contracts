const PacificToken = artifacts.require('PacificToken');
const TokenTransfers = artifacts.require('TokenTransfers');

contract('TokenTransfers', function(accounts) {
  it('check owner of contract', async() => {
    const instance = await TokenTransfers.new();

    assert.equal((await instance.owner.call()).toString(), accounts[0], 'Owner is different than ' + accounts[0]);
  });
  it('check sending tokens', async() => {
    const balances = ['100', '200', '300'];
    const tokenInstance = await PacificToken.new(['0x0000000000000000000000000000000000000000'], 0);
    const transfersInstance = await TokenTransfers.new();

    await tokenInstance.transfer(transfersInstance.address, 600, {from: accounts[0]});

    await transfersInstance.sendToken(tokenInstance.address, [accounts[1], accounts[2], accounts[3]], [100, 200, 300], {from: accounts[0]});

    assert.equal([(await tokenInstance.balanceOf.call(accounts[1])), (await tokenInstance.balanceOf.call(accounts[2])), (await tokenInstance.balanceOf.call(accounts[3]))].join(', '), balances.join(', '), 'List of holders is different than [' + balances.join(', ') + ']');
  });
});
