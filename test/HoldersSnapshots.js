const HoldersSnapshots = artifacts.require('HoldersSnapshots');
const PacificToken = artifacts.require('PacificToken');

contract('HoldersSnapshots', function(accounts) {
  it('check if snapshot of balance is correct in first snapshot', async() => {
    const tokenInstance = await PacificToken.new(['0x0000000000000000000000000000000000000000'], [0]);
    await tokenInstance.transfer(accounts[1], 1000000000000, {from: accounts[0]});

    const snapshotsInstance = await HoldersSnapshots.new(tokenInstance.address);
    await snapshotsInstance.snapshot();

    const snapshotIdentifier = await snapshotsInstance.getLatestSnapshotIdentifier();

    assert.equal((await snapshotsInstance.balanceOfAt(accounts[1], snapshotIdentifier)).toNumber(), 1000000000000, 'Balance is different than 1000000000000');
  });
  it('check if snapshot of balance is correct in second snapshot', async() => {
    const tokenInstance = await PacificToken.new(['0x0000000000000000000000000000000000000000'], [0]);
    await tokenInstance.transfer(accounts[1], 1000000000000, {from: accounts[0]});

    const snapshotsInstance = await HoldersSnapshots.new(tokenInstance.address);
    await snapshotsInstance.snapshot();

    await tokenInstance.transfer(accounts[1], 1000000000000, {from: accounts[0]});

    await snapshotsInstance.snapshot();

    const snapshotIdentifier = await snapshotsInstance.getLatestSnapshotIdentifier();

    assert.equal((await snapshotsInstance.balanceOfAt(accounts[1], snapshotIdentifier)).toNumber(), 2000000000000, 'Balance is different than 2000000000000');
  });
  it('check if snapshot of holders list is correct in first snapshot', async() => {
    const tokenInstance = await PacificToken.new(['0x0000000000000000000000000000000000000000'], [0]);
    await tokenInstance.transfer(accounts[1], 1000000000000, {from: accounts[0]});
    await tokenInstance.transfer(accounts[2], 1000000000000, {from: accounts[1]});
    await tokenInstance.transfer(accounts[1], 1000000000000, {from: accounts[2]});

    const snapshotsInstance = await HoldersSnapshots.new(tokenInstance.address);
    await snapshotsInstance.snapshot();

    const snapshotIdentifier = await snapshotsInstance.getLatestSnapshotIdentifier();
    const holders = await snapshotsInstance.getHoldersAt(snapshotIdentifier);

    assert.equal(holders.join(', '), accounts[0] + ', ' + accounts[1], 'List of holders is different than [' + accounts[0] + ', ' + accounts[1] + ']');
  });
  it('check if snapshot of holders list is correct in second snapshot', async() => {
    const tokenInstance = await PacificToken.new(['0x0000000000000000000000000000000000000000'], [0]);
    await tokenInstance.transfer(accounts[1], 1000000000000, {from: accounts[0]});
    await tokenInstance.transfer(accounts[2], 1000000000000, {from: accounts[1]});
    await tokenInstance.transfer(accounts[1], 1000000000000, {from: accounts[2]});

    const snapshotsInstance = await HoldersSnapshots.new(tokenInstance.address);
    await snapshotsInstance.snapshot();

    await tokenInstance.transfer(accounts[3], 1000000000000, {from: accounts[0]});

    await snapshotsInstance.snapshot();

    const snapshotIdentifier = await snapshotsInstance.getLatestSnapshotIdentifier();
    const holders = await snapshotsInstance.getHoldersAt(snapshotIdentifier);

    assert.equal(holders.join(', '), accounts[0] + ', ' + accounts[1] + ', ' + accounts[3], 'List of holders is different than [' + accounts[0] + ', ' + accounts[1] + ', ' + accounts[3] + ']');
  });
});
