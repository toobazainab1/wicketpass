export const WIREFLUID_CHAIN_ID    = 92533
export const WIREFLUID_RPC_URL     = import.meta.env.VITE_WIREFLUID_RPC_URL
export const WIRESCAN_URL          = import.meta.env.VITE_WIRESCAN_URL
export const CURRENCY_SYMBOL       = "WIRE"

export const WIREFLUID_NETWORK = {
  chainId:         "0x169A5",
  chainName:       "WireFluid Network",
  nativeCurrency: {
    name:     "WIRE",
    symbol:   "WIRE",
    decimals: 18,
  },
  rpcUrls:         ["https://evm.wirefluid.com"],
  blockExplorerUrls:["https://wirefluidscan.com"],
}