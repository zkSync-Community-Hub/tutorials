import * as hre from "hardhat";
import { Provider, Wallet } from "zksync-web3";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { BigNumber, Contract, ethers } from "ethers";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { expect } from "chai";
import { DEPLOYER_WALLET_PK, SELLER_RICH_WALLET_PK, BUYER_RICH_WALLET_PK, deployContract } from "./common";

describe("Stable marketplace core functions test", function () {
  let stableMarketplaceContract: Contract,
    exampleNFTContract: Contract,
    nftContractAddress: string,
    marketplaceAddress: string,
    wrappedMarketplaceContract: Contract,
    seller: Wallet,
    buyer: Wallet;

  const tokenId = 1;

  it("Should deploy contracts", async function () {
    const provider = Provider.getDefaultProvider();
    const wallet = new Wallet(DEPLOYER_WALLET_PK, provider);
    const deployer = new Deployer(hre, wallet);

    // Deploy marketplace contract
    stableMarketplaceContract = await deployContract(deployer, "StableMarketplace")
    marketplaceAddress = stableMarketplaceContract.address;

    // Deploy NFT contract
    exampleNFTContract = await deployContract(deployer, "ExampleNFT")
    nftContractAddress = exampleNFTContract.address;

    // Should map users
    seller = new Wallet(SELLER_RICH_WALLET_PK, provider);;
    buyer = new Wallet(BUYER_RICH_WALLET_PK, provider);
  });

  it("Should mint NFT", async function () {
    // Mint first NFT
    const mintTx1 = await exampleNFTContract.mint();
    await mintTx1.wait();
  });

  it("Seller should post sell order for token 2 with stable USD price", async function () {
    // Approve NFT transfer
    const approveTx = await exampleNFTContract.approve(
      stableMarketplaceContract.address,
      tokenId
    );
    await approveTx.wait();

    // Post sell order
    const usdPrice = ethers.utils.parseEther("100");
    const postOrderTx = await stableMarketplaceContract.postSellOrder(
      nftContractAddress,
      tokenId,
      usdPrice
    );
    await postOrderTx.wait();

    // Check NFT owner (marketplace should own the NFT now)
    expect(await exampleNFTContract.ownerOf(tokenId)).to.equal(
      marketplaceAddress
    );
  });

  it("Should wrap marketplace contract with redstone wrapper", async function () {
    const contract = stableMarketplaceContract.connect(buyer);
    wrappedMarketplaceContract = WrapperBuilder.wrap(contract).usingDataService(
      {
        dataServiceId: "redstone-main-demo",
        uniqueSignersCount: 1,
        dataFeeds: ["ETH"],
      },
    );
  });

  it("Should get all orders", async function () {
    const allOrders = await stableMarketplaceContract.getAllOrders();
    expect(allOrders.length).to.equal(1);
    expect(allOrders[0].tokenId.toString()).to.equal("1");
  });

  it("Buying should fail with smaller amount then seller requested", async function () {
    const orderId = 0;

    // Get expected ETH amount
    const expectedEthAmount = await wrappedMarketplaceContract.getPrice(
      orderId
    );
    logExpectedAmount(expectedEthAmount);

    // Trying to buy (should fail)
    await expect(
      wrappedMarketplaceContract.buy(orderId, {
        value: expectedEthAmount.mul(99).div(100),
      })
    ).to.be.reverted;
  });

  it("Buyer should buy token for USD price expressed in ETH", async function () {
    const orderId = 0;

    // Get expected ETH amount
    const expectedEthAmount = await wrappedMarketplaceContract.getPrice(
      orderId
    );
    logExpectedAmount(expectedEthAmount);

    // Send buy tx from user 2 wallet
    const buyTx = await wrappedMarketplaceContract.buy(orderId, {
      value: expectedEthAmount.mul(101).div(100), // a buffer for price movements
    });
    await buyTx.wait();

    // Check NFT owner
    const nftOwner = await exampleNFTContract.ownerOf(tokenId);
    expect(nftOwner).to.equal(buyer.address);
  });
});

function logExpectedAmount(amount: BigNumber) {
  console.log(
    `Expected ETH amount: ${ethers.utils.formatEther(amount.toString())}`
  );
}
