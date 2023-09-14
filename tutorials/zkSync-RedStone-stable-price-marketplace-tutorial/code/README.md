# Example dApp - Stable price NFT marketplace

This repo is designed to show how to build a dApp that uses [RedStone oracles](https://redstone.finance/) on [zkSync](https://zksync.io/).

The repo contains an implementation of an NFT marketplace dApp with so-called "stable" price. It means that sellers can create sell orders (offers), specifying the price amount in USD. But buyers are able to pay with native coins, the required amount of which is calculated dynamically at the moment of the order execution. Repo lacks few crucial parts which will demonstrate how to integrate RedStone oracles and deploy dApp on zkSync Era Testnet.

## 🧑‍💻 Implementation

We use [hardhat](https://hardhat.org/), version prepared for working on [zkSync](https://github.com/matter-labs/hardhat-zksync), and [ethers.js](https://docs.ethers.io/v5/) for deployment scripts and contract tests. Frontend is implemented in [React](https://reactjs.org/).

### Code structure

```bash
├── contracts                   # Solidity contracts
│   ├── ExampleNFT.sol          # Example ERC721 contract
│   ├── Marketplace.sol         # Simple NFT marketplace contract
│   ├── StableMarketplace.sol   # NFT marketplace contract with stable price
│   └── ...
├── public                      # Folder with public html files and images for React app
├── deploy                      # Contract deployment script
├── src                         # React app source code
│   ├── components
│   │   ├── App.tsx             # Main React component
│   ├── core
│   │   ├── blockchain.ts       # TS module responsible for interaction with blockchain and contracts
│   ├── config/                 # Folder with contract ABIs and deployed contract addresses
│   └── ...
├── test                        # Contract tests
└── ...
```

### Contracts

#### ExampleNFT.sol

`ExampleNFT` is a simple ERC721 contract with automated sequential token id assignment

```js
function mint() external {
    _mint(msg.sender, nextTokenId);
    nextTokenId++;
}
```

This contract extends `ERC721Enumerable` implementation created by the `@openzeppelin` team, which adds view functions for listing all tokens and tokens owned by a user.

#### Marketplace.sol

`Marketplace` is an NFT marketplace contract, which allows to post sell orders for any NFT token that follows [EIP-721 non-fungible token standard](https://eips.ethereum.org/EIPS/eip-721). It has the following functions:

```js

// Created a new sell order
// This function requires approval for transfer on the specified NFT token
function postSellOrder(address nftContractAddress, uint256 tokenId, uint256 price) external {}

// Only order creator can call this function
function cancelOrder(uint256 orderId) external {}

// Allows to get info about all orders (including canceled, and executed ones)
function getAllOrders() public view returns (SellOrder[] memory) {}

// Returns expected price in ETH for the given order
function getPrice(uint256 orderId) public view returns (uint256) {}

// Requires sending at least the minimal amount of ETH
function buy(uint256 orderId) external payable {}

```

The implementation is quite straightforward, so we won't describe it here. You can check the full contract code in the [contracts/Marketplace.sol.](contracts/Marketplace.sol)

#### StableMarketplace.sol

`StableMarketplace` is the marketplace contract with the stable price support. It extends the `Marketplace.sol` implementation and only overrides its `_getPriceFromOrder` function.
This contract will integrate RedStone oracles functionalities and will be described later.

### Frontend

You can check the code of the React app in the `src` folder. We tried to simplify it as much as possible and leave only the core marketplace functions.

The main UI logic is located in the `App.tsx` file, and the contract interaction logic is in the `blockchain.ts` file.

If you take a look into the `blockchain.ts` file code, you'll notice that each contract call that needs to process RedStone data is made on a contract instance, that was wrapped by [@redstone-finance/evm-connector](https://www.npmjs.com/package/@redstone-finance/evm-connector).

### Tests

We've used hardhat test framework to contract tests. All the tests are located in the [test](test/) folder.

## 🌎 Useful links

- [Repo with examples](https://github.com/redstone-finance/redstone-evm-examples)
- [RedStone Documentation](https://docs.redstone.finance/)
- [RedStone Price Feeds](https://docs.redstone.finance/docs/smart-contract-devs/price-feeds)
- [Data from any URL](https://docs.redstone.finance/docs/smart-contract-devs/custom-urls)
- [NFT Data Feeds](https://docs.redstone.finance/docs/smart-contract-devs/nft-data-feeds)
- [Randomness](https://docs.redstone.finance/docs/smart-contract-devs/randomness)

## 🙋‍♂️ Need help?

Please feel free to contact the RedStone team [on Discord](https://redstone.finance/discord) if you have any questions.
