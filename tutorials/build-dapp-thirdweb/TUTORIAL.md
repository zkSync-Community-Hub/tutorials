# Build a dapp using thirdweb

### Introduction

This guide will walk you through the process of creating and deploying a dapp using thirdweb. We will be using the thirdweb CLI to create a dapp, connect it to our contract on zkSync Era, and deploy it to decentralized storage using thirdweb Deploy.

## Build time!

### Step 1 — Create Application

Thirdweb offers SDKs for a range of programming languages, such as React, React Native, TypeScript, Python, Go, and Unity.

1. In your CLI run the following command:

   ```bash
   npx thirdweb create --app
   ```

2. Input your preferences for the command line prompts:
   1. Give your project a name
   2. Choose your network: We will choose EVM for zkSync Era
   3. Choose your preferred framework: Next.js, CRA, Vite, React Native, Node.js, or Express
   4. Choose your preferred language: JavaScript or TypeScript
3. Use the React or TypeScript SDK to interact with your application’s functions. See section on “interact with your contract”

### Step 2 — Interact With a Contract

thirdweb provides several SDKs to allow you to interact with your contract including: [React](https://portal.thirdweb.com/react?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs), [React Native](https://portal.thirdweb.com/react-native?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs), [TypeScript](https://portal.thirdweb.com/typescript?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs), [Python](https://portal.thirdweb.com/python?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs), [Go](https://portal.thirdweb.com/go?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs), and [Unity](https://portal.thirdweb.com/unity?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs).

This document will show you how to interact with your contract deployed to zkSync Era using React

> View the [full React SDK reference](https://portal.thirdweb.com/react?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs) in thirdweb’s documentation.

To create a new application pre-configured with thirdweb’s SDKs run and choose your preferred configurations:

```jsx
npx thirdweb create app --evm
```

or install it into your existing project by running:

```jsx
npx thirdweb install
```

#### Initialize SDK On zkSync Era

Wrap your application in the `ThirdwebProvider` component and change the `activeChain` to zkSync Era

```jsx
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ZksyncEra } from "@thirdweb-dev/chains";

const App = () => {
  return (
    <ThirdwebProvider activeChain={ZksyncEra}>
      <YourApp />
    </ThirdwebProvider>
  );
};
```

#### Get Contract

To connect to your contract, use the SDK’s [`getContract`](https://portal.thirdweb.com/typescript/sdk.thirdwebsdk.getcontract?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs) method.

```jsx
import { useContract } from "@thirdweb-dev/react";

function App() {
  const { contract, isLoading, error } = useContract("{{contract_address}}");
}
```

#### Calling Contract Functions

- For extension based functions, use the built-in supported hooks. The following is an example using the NFTs extension to access a list of NFTs owned by an address- `useOwnedNFTs`

  ```jsx
  import { useOwnedNFTs, useContract, useAddress } from "@thirdweb-dev/react";

  // Your smart contract address
  const contractAddress = "{{contract_address}}";

  function App() {
    const address = useAddress();
    const { contract } = useContract(contractAddress);
    const { data, isLoading, error } = useOwnedNFTs(contract, address);
  }
  ```

  Full reference: [https://portal.thirdweb.com/react/react.usenft](https://portal.thirdweb.com/react/react.usenft?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs)

- Use the `useContractRead` hook to call any read functions on your contract by passing in the name of the function you want to use.

  ```jsx
  import { useContractRead, useContract } from "@thirdweb-dev/react";

  // Your smart contract address
  const contractAddress = "{{contract_address}}";

  function App() {
    const { contract } = useContract(contractAddress);
    const { data, isLoading, error } = useContractRead(contract, "getName");
  }
  ```

  Full reference: [https://portal.thirdweb.com/react/react.usecontractread](https://portal.thirdweb.com/react/react.usecontractread?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs)

- Use the `useContractWrite` hook to call any write functions on your contract by passing in the name of the function you want to use.

  ```jsx
  import {
    useContractWrite,
    useContract,
    Web3Button,
  } from "@thirdweb-dev/react";

  // Your smart contract address
  const contractAddress = "{{contract_address}}";

  function App() {
    const { contract } = useContract(contractAddress);
    const { mutateAsync, isLoading, error } = useContractWrite(
      contract,
      "setName"
    );

    return (
      <Web3Button
        contractAddress={contractAddress}
        // Calls the "setName" function on your smart contract with "My Name" as the first argument
        action={() => mutateAsync({ args: ["My Name"] })}
      >
        Send Transaction
      </Web3Button>
    );
  }
  ```

  Full reference: [https://portal.thirdweb.com/react/react.usecontractwrite](https://portal.thirdweb.com/react/react.usecontractwrite?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs)

#### Connect Wallet

Create a custom connect wallet experience by declaring supported wallets passed to your provider.

```jsx
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnectV1,
  walletConnect,
  safeWallet,
  paperWallet,
} from "@thirdweb-dev/react";

function MyApp() {
  return (
    <ThirdwebProvider
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect({
          projectId: "YOUR_PROJECT_ID", // optional
        }),
        walletConnectV1(),
        safeWallet(),
        paperWallet({
          clientId: "YOUR_CLIENT_ID", // required
        }),
      ]}
      activeChain={ZksyncEra}
    >
      <App />
    </ThirdwebProvider>
  );
}
```

Add in a connect wallet button to prompt end-users to login with any of the above supported wallets.

```jsx
import { ConnectWallet } from "@thirdweb-dev/react";

function App() {
  return <ConnectWallet />;
}
```

Full reference: [https://portal.thirdweb.com/react/connecting-wallets](https://portal.thirdweb.com/react/connecting-wallets?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs)

### Step 3 — Deploy Application

To host your static web application on decentralized storage, run:

```jsx
npx thirdweb deploy --app
```

By running this command, your application is built for production and stored using Storage. The built application is uploaded to IPFS, a decentralized storage network, and a unique URL is generated for your application.

This URL serves as a permanent hosting location for your application on the web.

If you have any further questions or encounter any issues during the process, please [reach out to thirdweb support.](https://support.thirdweb.com?utm_source=zksync&utm_medium=docs&utm_campaign=chain_docs)

## Conclusion

In this tutorial, you learned how to create and deploy a dapp using thirdweb. You can now create your own dapp using thirdweb’s SDKs and connect it to your smart contract on zkSync Era.