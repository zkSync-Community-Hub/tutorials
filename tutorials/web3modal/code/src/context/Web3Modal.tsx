'use client'

import { PropsWithChildren } from 'react'

import { WagmiConfig } from 'wagmi'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { zkSync, zkSyncTestnet } from 'wagmi/chains'

const projectId = '0c2c1ade52d105f1294e5b6fecffbf1b'

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