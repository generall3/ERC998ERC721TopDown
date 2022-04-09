const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC998ERC721TopDown", function () {
  let owner, addr1;

  before(async function () {
    this.ERC998ERC721TopDown = await ethers.getContractFactory('ERC998ERC721TopDown');
  });

  beforeEach(async function () { 
    [owner, addr1] = await ethers.getSigners();
    this.contract = await this.ERC998ERC721TopDown.deploy();
    await this.contract.deployed();

    parentContract = await ERC998ERC721TopDown.new()
    childContract = await ERC998ERC721TopDown.new()
  })

  // Test case
  it('should mint a 721 token, Composable', async () => {
    const tokenId = await parentContract.mint.call(alice)
    expect(tokenId).to.be.bignumber.equal(new BN("1"))
    await parentContract.mint(alice)
    const owner = await parentContract.ownerOf(tokenId)
    assert.equal(owner, alice)
  })
 
  it('should safeTransferFrom childContract to parentContract', async () => {
    await parentContract.mint(alice)
    await childContract.mint(alice)

    const receipt = await childContract.methods['safeTransferFrom(address,address,uint256,bytes)'](alice, parentContract.address, 1, bytes1, { from: alice });
    await expectEvent(receipt, 'ReceivedChild', {
      _from: alice, _tokenId: new BN('1'), _childContract: childContract.address, _childTokenId: new BN('1') })
    const owned = await parentContract.childExists(childContract.address, 1)
    assert(owned, 'parentContract does not own childContract')

    const result = await parentContract.ownerOfChild(childContract.address, 1)
    expect(result.parentTokenId).to.be.bignumber.equal(new BN("1"))

    const contracts = await parentContract.totalChildContracts.call(1)
    assert.equal(contracts.toNumber(), 1)

    const contract = await parentContract.childContractByIndex.call(1, 0)
    assert.equal(contract, childContract.address)

    const tokenId = await parentContract.childTokenByIndex.call(1,childContract.address,0)
    expect(tokenId).to.be.bignumber.equal(new BN("1"))
  })

  it('should transfer composable to bob', async () => {
    await parentContract.mint(alice)
    await childContract.mint(alice)
    await childContract.methods['safeTransferFrom(address,address,uint256,bytes)'](alice, parentContract.address, 1, bytes1, { from: alice });

    const receipt = await parentContract.transferFrom(alice, bob, 1, {from: alice})
    await expectEvent(receipt, 'Transfer', { from: alice, to: bob, tokenId: new BN('1') })

    const owner = await parentContract.ownerOf.call(1);
    assert.equal(owner, bob)
  })

  it('should transfer child to alice', async () => {
    await parentContract.mint(alice)
    await childContract.mint(alice)
    await childContract.methods['safeTransferFrom(address,address,uint256,bytes)'](alice, parentContract.address, 1, bytes1, { from: alice });
    await parentContract.transferFrom(alice, bob, 1, {from: alice})

    const receipt = await parentContract.transferChild(1, alice, childContract.address, 1, { from: bob })
    await expectEvent(receipt, 'TransferChild', {
      tokenId: new BN('1'), _to: alice, _childContract: childContract.address, _childTokenId: new BN('1') })

    const owner = await childContract.ownerOf.call(1)
    assert.equal(owner, alice)

    const contracts = await parentContract.totalChildContracts(1)
    assert.equal(contracts.toNumber(), 0)

    const owned = await parentContract.childExists(childContract.address, 1)
    assert.equal(owned, false)

    const tokns = await parentContract.totalChildTokens(1, childContract.address)
    assert.equal(tokns.toNumber(), 0)
  })
})