# Deploy a zkSync Subgraph Tracking a Specific Address

### Introduction

In this tutorial, you will learn how to deploy a subgraph that tracks a specific address on zkSync Era mainnet. Deploying graphs is a great way to query data from network historically and in real-time.  

The Graph is a decentralized protocol for indexing and querying data from blockchains. The Graph serves queries over data that is easily stored, decentralized, and secured by the blockchain. You will learn how to deploy a subgraph that tracks a specific address on zkSync Era mainnet. You can use this subgraph to query data from zkSync Era mainnet.

## Prerequisites

- Node.js (^16.20.1) and NPM
- Yarn (^1.22.19)
- An account with ETH on zkSync Era testnet

## Build time

### Step 1 — Visit theGraph Studio and Connect Wallet

- Visit https://thegraph.com/studio/ 
- Connect your wallet

### Step 2 — Create a new Subgraph

- Click on the button to create a new subgraph 
- Enter the name of the subgraph
- Select the network you want to deploy the subgraph on, in this case: `zkSync Era (Subgraph Only)`

### Step 3 — Install the Graph CLI

- Install the Graph CLI with `npm install -g @graphprotocol/graph-cli`
- Initialize the Graph project with `graph init --studio zksync-thegraph-tutorial`
  - Select `Ethereum` as the protocol
  - Select `zksync-era` as the Ethereum network
  - Provide an abi filepath for the contract you want to track (in this case, the `usdc_abi.json` file, as path: `./usdc_abi.json`)
  - Approve the next steps and skip adding another contract

### Step 4 — Authenticate and Deploy the Subgraph

- Authenticate with `graph auth --studio <ACCESS_TOKEN>` (you can find this command with the access token in the studio, which you can copy and paste)
- Change directory to the subgraph with `cd zksync-thegraph-tutorial`
- Build the subgraph with `graph codegen && graph build`
- Deploy the subgraph with `graph deploy --studio zksync-thegraph-tutorial`


## Conclusion

In this tutorial, you learned how to deploy a subgraph that tracks a specific address on zkSync Era testnet. You can now use this subgraph to query data from zkSync Era mainnet. 