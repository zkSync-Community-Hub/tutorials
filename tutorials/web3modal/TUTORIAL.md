# Create a website and connect to zkSync ERA with your wallet 

### Introduction

In this tutorial, you will learn how to create a website and connect to zkSync ERA with your wallet. We are going to use Next.js for this example but you can use any other frontend framework.

The Web3Modal SDK allows you to easily connect your Web3 dapp with wallets. It provides a simple and intuitive interface for dapps to request actions such as signing transactions and interacting with smart contracts on the blockchain.

## Prerequisites

- Node.js (^18.17.1) and NPM
- An wallet that supports zkSync Era

## Build time

### Step 1 — Installation

Let’s create our app now, we’re going to be using Next.js, Wagmi and Web3Modal v3 for this tutorial

Let’s start a new project by running

```sh
npx create-next-app
```

Now we’ll install Wagmi and Web3Modal which will help us to showcase a modal with different wallets that users can connect to.

```sh
npm install @web3modal/wagmi wagmi viem
```

### Step 2 — Implementation: Web3Modal.tsx file

Let's create a `Web3Modal.tsx` file inside a `context` folder, and we’ll import the following dependencies from Web3Modal and Wagmi

```ts
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { zkSync, zkSyncTestnet } from 'wagmi/chains'
```

We now need to get a Project ID from [WalletConnect’s Cloud website](https://cloud.walletconnect.com/)

```ts
const projectId = 'YOUR_PROJECT_ID'
```

Once that’s done we can create our wagmiConfig instance

```ts
const metadata = {
  name: 'Web3Modal & zkSync',
  description: 'Web3Modal & zkSync Tutorial',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}
const chains = [zkSync, zkSyncTestnet]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
```

Now we can create a Web3Modal instance to initiate our modal, let's also add zkSync as the default chain.

```ts
createWeb3Modal({ wagmiConfig, projectId, chains, defaultChain: zkSync })
```

We’ll now add the WagmiConfig component, this is how our Web3Modal.tsx file should look like

```ts
'use client'

import { PropsWithChildren } from 'react'

import { WagmiConfig } from 'wagmi'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { zkSync, zkSyncTestnet } from 'wagmi/chains'

const projectId = 'YOUR_PROJECT_ID'

const metadata = {
  name: 'Web3Modal & zkSync',
  description: 'Web3Modal & zkSync Tutorial',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}
const chains = [zkSync, zkSyncTestnet]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ wagmiConfig, projectId, chains, defaultChain: zkSync })

export function Web3Modal({ children }: PropsWithChildren) {
  return(
      <WagmiConfig config={wagmiConfig}>
        {children}
      </WagmiConfig>
    )
}
```

### Step 3 — Implementation: layout.tsx file

Now in our `app/layout.tsx` file we'll import our Web3Modal component

```ts
import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import './globals.css'

import { Web3Modal } from './context/Web3Modal'

export const metadata: Metadata = {
  title: 'Web3Modal & zkSync',
  description: 'Web3Modal & zkSync Tutorial',
}

export default function RootLayout({children}: PropsWithChildren) {
  return (
    <html lang='en'>
      <body>
        <Web3Modal>
          {children}
        </Web3Modal>
      </body>
    </html>
  )
}
```

### Step 3 — Implementation: page.tsx file

Now we can add the Web3Modal button web component anywhere in our application

```ts
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <w3m-button/>
    </main>
  )
}
```

## Conclusion

In this tutorial, you learned how to create a website and connect to zkSync ERA with your wallet. You can now continue this project with [Wagmi hooks and functions](https://wagmi.sh/react/hooks/useContractRead) to start interacting directly with zkSync ERA in your new website.