import { Safe, SafeFactory } from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';
import { ethers } from 'ethers';
import { getSafeTxServiceUrl } from './chain';

export interface SafeConfig {
  safeAddress: string;
  signer: ethers.Signer;
}

export async function getSafe({ signer }: { signer: ethers.Signer }): Promise<Safe> {
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '100');
  const safeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS!;
  
  const safe = await Safe.init({
    ethAdapter: {
      getSignerAddress: async () => signer.getAddress(),
      signMessage: async (message: string) => signer.signMessage(message),
      signTypedData: async (typedData: any) => signer.signTypedData(typedData.domain, typedData.types, typedData.message),
      getChainId: async () => chainId,
      getBalance: async (address: string) => {
        const provider = signer.provider!;
        const balance = await provider.getBalance(address);
        return balance.toString();
      },
      getCode: async (address: string) => {
        const provider = signer.provider!;
        return provider.getCode(address);
      },
      getStorageAt: async (address: string, position: string) => {
        const provider = signer.provider!;
        return provider.getStorageAt(address, position);
      },
      getTransactionCount: async (address: string) => {
        const provider = signer.provider!;
        return provider.getTransactionCount(address);
      },
      call: async (to: string, data: string) => {
        const provider = signer.provider!;
        return provider.call({ to, data });
      },
      estimateGas: async (transaction: any) => {
        const provider = signer.provider!;
        return provider.estimateGas(transaction);
      },
      getGasPrice: async () => {
        const provider = signer.provider!;
        const feeData = await provider.getFeeData();
        return feeData.gasPrice || BigInt(0);
      },
    },
    safeAddress,
    isL1SafeMasterCopy: false,
  });

  return safe;
}

export async function getSafeService(): Promise<SafeApiKit> {
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '100');
  const safeTxServiceUrl = getSafeTxServiceUrl(chainId);
  
  const safeService = new SafeApiKit({
    chainId: BigInt(chainId),
    txServiceUrl: safeTxServiceUrl,
  });

  return safeService;
}

export function buildErc20TransferTx({ token, to, amountWei }: {
  token: string;
  to: string;
  amountWei: string;
}) {
  const iface = new ethers.Interface([
    'function transfer(address to, uint256 amount) returns (bool)'
  ]);
  
  return iface.encodeFunctionData('transfer', [to, amountWei]);
}

export function buildNativeTransferTx({ to, valueWei }: {
  to: string;
  valueWei: string;
}) {
  // For native transfers, we just need the recipient and value
  return {
    to,
    value: valueWei,
    data: '0x',
  };
}

export async function proposeSafeTx({
  safe,
  safeService,
  txData,
  signer,
}: {
  safe: Safe;
  safeService: SafeApiKit;
  txData: {
    to: string;
    value: string;
    data: string;
  };
  signer: ethers.Signer;
}) {
  const safeTransaction = await safe.createTransaction({
    safeTransactionData: {
      to: txData.to,
      value: txData.value,
      data: txData.data,
    },
  });

  const safeTxHash = await safe.getTransactionHash(safeTransaction);
  const signature = await safe.signTransaction(safeTransaction);

  const response = await safeService.proposeTransaction({
    safeAddress: safe.getAddress(),
    safeTransaction,
    safeTxHash,
    senderAddress: await signer.getAddress(),
    senderSignature: signature.data,
  });

  return {
    safeTxHash,
    safeTransaction,
    response,
  };
}

export async function confirmSafeTx({
  safeService,
  safeTxHash,
  signer,
}: {
  safeService: SafeApiKit;
  safeTxHash: string;
  signer: ethers.Signer;
}) {
  const safe = await getSafe({ signer });
  const safeTransaction = await safeService.getTransaction(safeTxHash);
  
  if (!safeTransaction) {
    throw new Error('Transaction not found');
  }

  const signature = await safe.signTransaction(safeTransaction);
  
  const response = await safeService.confirmTransaction({
    safeTxHash,
    signature: signature.data,
    senderAddress: await signer.getAddress(),
  });

  return response;
}

export async function executeSafeTx({
  safe,
  safeService,
  safeTxHash,
  signer,
}: {
  safe: Safe;
  safeService: SafeApiKit;
  safeTxHash: string;
  signer: ethers.Signer;
}) {
  const safeTransaction = await safeService.getTransaction(safeTxHash);
  
  if (!safeTransaction) {
    throw new Error('Transaction not found');
  }

  const executeTxResponse = await safe.executeTransaction(safeTransaction);
  
  return executeTxResponse;
}

export async function listPendingTxs(safeAddress: string) {
  const safeService = await getSafeService();
  
  const pendingTxs = await safeService.getPendingTransactions(safeAddress);
  
  return pendingTxs.results || [];
}