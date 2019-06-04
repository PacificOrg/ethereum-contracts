const PacificToken = artifacts.require('PacificToken');

contract('PacificToken', function(accounts) {
  it('check name of PacificToken', async() => {
    const instance = await PacificToken.new(['0x0000000000000000000000000000000000000000'], [0]);

    assert.equal((await instance.name.call()).toString(), 'Pacific', 'Name is different than Pacific');
  });
  it('check symbol of PacificToken', async() => {
    const instance = await PacificToken.new(['0x0000000000000000000000000000000000000000'], [0]);

    assert.equal((await instance.symbol.call()).toString(), 'PCF', 'Symbol is different than PCF');
  });
  it('check total supply of PacificToken', async() => {
    const instance = await PacificToken.new(['0x0000000000000000000000000000000000000000'], [0]);

    assert.equal((await instance.totalSupply.call()).toString(), '100000000000000000', 'Total supply is different than 100000000000000000');
  });
  it('check decimals of PacificToken', async() => {
    const instance = await PacificToken.new(['0x0000000000000000000000000000000000000000'], [0]);

    assert.equal((await instance.decimals.call()).toNumber(), 8, 'Decimals is different than 8');
  });
  it('check if holders list is correct', async() => {
    const instance = await PacificToken.new(['0x0000000000000000000000000000000000000000'], [0]);
    await instance.transfer(accounts[1], 1000000000000, {from: accounts[0]});
    await instance.transfer(accounts[2], 1000000000000, {from: accounts[1]});
    await instance.transfer(accounts[1], 1000000000000, {from: accounts[2]});

    const holders = await instance.getHolders.call(1000000000000);

    assert.sameMembers(holders, [accounts[0], accounts[1]], 'List of holders is different than [' + accounts[0] + ', ' + accounts[1] + ']');
  });
  it('check if vested account of PacificToken can transfer tokens after end of vesting time using transfer()', async() => {
    const instance = await PacificToken.new([accounts[1]], [(Math.round(new Date().getTime() / 1000) - 3600)]);
    await instance.transfer(accounts[1], 1000000000000);

    assert.isOk(await instance.transfer(accounts[0], 1, {from: accounts[1]}), 'Account was unable to transfer tokens');
  });
  it('check if vested account of PacificToken can transfer tokens before end of vesting time using transferFrom()', async() => {
    const instance = await PacificToken.new([accounts[1]], [(Math.round(new Date().getTime() / 1000) - 3600)]);
    await instance.transfer(accounts[1], 1000000000000);
    await instance.approve(accounts[2], 1, {from: accounts[1]});

    assert.isOk(await instance.transferFrom(accounts[1], accounts[2], 1, {from: accounts[2]}), 'Account was unable to transfer tokens');
  });
  it('check if vested account of PacificToken cannot transfer tokens before end of vesting time using transfer()', async() => {
    try {
      const instance = await PacificToken.new([accounts[1]], [(Math.round(new Date().getTime() / 1000) + 3600)]);
      await instance.transfer(accounts[1], 1000000000000);
      await instance.transfer(accounts[0], 1, {from: accounts[1]});

      assert.fail('Account was able to transfer tokens');
    } catch (error) {
      return;
    }
  });
  it('check if vested account of PacificToken cannot transfer tokens before end of vesting time using transferFrom()', async() => {
    try {
      const instance = await PacificToken.new([accounts[1]], [(Math.round(new Date().getTime() / 1000) + 3600)]);
      await instance.transfer(accounts[1], 1000000000000);
      await instance.approve(accounts[2], 1, {from: accounts[1]});
      await instance.transferFrom(accounts[1], accounts[2], 1, {from: accounts[2]});

      assert.fail('Account was able to transfer tokens');
    } catch (error) {
      return;
    }
  });
});
