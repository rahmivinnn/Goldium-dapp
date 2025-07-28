import { PublicKey } from '@solana/web3.js'

export function getExplorerUrl(
    endpoint: string,
    viewTypeOrItemAddress: 'inspector' | PublicKey | string,
    itemType = 'address' // | 'tx' | 'block'
  ) {
    // Gunakan Solscan sebagai explorer utama
    let baseUrl = 'https://solscan.io';
    let pathType = itemType;
    if (itemType === 'address') pathType = 'account'; // Solscan pakai /account/ untuk address

    // Hanya tambahkan ?cluster=devnet jika endpoint devnet
    let clusterParam = '';
    if (endpoint === 'https://api.devnet.solana.com') {
      clusterParam = '?cluster=devnet';
    } else if (endpoint === 'localnet') {
      clusterParam = '?cluster=custom';
    }

    return `${baseUrl}/${pathType}/${viewTypeOrItemAddress}${clusterParam}`;
  }