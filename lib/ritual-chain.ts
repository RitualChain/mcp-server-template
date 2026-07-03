import { createPublicClient, http, defineChain, formatEther, type Address } from "viem"

export const ritualChain = defineChain({
  id: 1979,
  name: "Ritual",
  nativeCurrency: { name: "RITUAL", symbol: "RITUAL", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.ritualfoundation.org"] },
  },
  blockExplorers: {
    default: { name: "Ritual Explorer", url: "https://explorer.ritualfoundation.org" },
  },
})

export const publicClient = createPublicClient({
  chain: ritualChain,
  transport: http("https://rpc.ritualfoundation.org"),
})

export const RITUAL_WALLET = "0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948" as const
export const TEE_SERVICE_REGISTRY = "0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F" as const
export const MODEL_PRICING_REGISTRY = "0x7A85F48b971ceBb75491b61abe279728F4c4384f" as const

export const CAPABILITY = { HTTP_CALL: 0, LLM_CALL: 1 } as const

const RITUAL_WALLET_ABI = [
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "lockUntil", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
] as const

const TEE_REGISTRY_ABI = [
  {
    name: "getServicesByCapability",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "capability", type: "uint8" }, { name: "checkValidity", type: "bool" }],
    outputs: [{
      name: "services", type: "tuple[]",
      components: [
        { name: "node", type: "tuple", components: [
          { name: "paymentAddress", type: "address" },
          { name: "teeAddress", type: "address" },
          { name: "teeType", type: "uint8" },
          { name: "publicKey", type: "bytes" },
          { name: "endpoint", type: "string" },
          { name: "certPubKeyHash", type: "bytes32" },
          { name: "capability", type: "uint8" },
        ]},
        { name: "isValid", type: "bool" },
        { name: "workloadId", type: "bytes32" },
      ],
    }],
  },
] as const

const MODEL_PRICING_ABI = [
  { name: "getAllModels", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string[]" }] },
] as const

export async function getRitualWalletBalance(address: Address) {
  const [balance, lockUntil, currentBlock] = await Promise.all([
    publicClient.readContract({ address: RITUAL_WALLET, abi: RITUAL_WALLET_ABI, functionName: "balanceOf", args: [address] }),
    publicClient.readContract({ address: RITUAL_WALLET, abi: RITUAL_WALLET_ABI, functionName: "lockUntil", args: [address] }),
    publicClient.getBlockNumber(),
  ])
  return {
    address,
    balanceWei: balance.toString(),
    balanceRitual: formatEther(balance),
    lockUntilBlock: lockUntil.toString(),
    currentBlock: currentBlock.toString(),
    isLocked: lockUntil > currentBlock,
    hasEnoughForLLM: balance >= BigInt("400000000000000000"),
  }
}

export async function getActiveExecutors(capability: 0 | 1) {
  const services = await publicClient.readContract({
    address: TEE_SERVICE_REGISTRY,
    abi: TEE_REGISTRY_ABI,
    functionName: "getServicesByCapability",
    args: [capability, true],
  })
  return services.map((s) => ({
    teeAddress: s.node.teeAddress,
    paymentAddress: s.node.paymentAddress,
    isValid: s.isValid,
  }))
}

export async function getChainStatus() {
  const [blockNumber, gasPrice] = await Promise.all([
    publicClient.getBlockNumber(),
    publicClient.getGasPrice(),
  ])
  return {
    chainId: 1979,
    chainName: "Ritual",
    rpcUrl: "https://rpc.ritualfoundation.org",
    explorerUrl: "https://explorer.ritualfoundation.org",
    faucetUrl: "https://faucet.ritualfoundation.org",
    blockNumber: blockNumber.toString(),
    gasPriceWei: gasPrice.toString(),
    gasPriceGwei: (Number(gasPrice) / 1e9).toFixed(4),
  }
}

export async function getAvailableModels() {
  const models = await publicClient.readContract({
    address: MODEL_PRICING_REGISTRY,
    abi: MODEL_PRICING_ABI,
    functionName: "getAllModels",
  })
  return models as string[]
}
