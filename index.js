import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import 'dotenv/config';

// Buat client Discord dengan intent yang tepat
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ] 
});

// Register command /dc
const commands = [
  {
    name: 'dc',
    description: 'Cek harga coin crypto (versi Demon Chain)',
    options: [
      {
        name: 'symbol',
        type: 3, // STRING type
        description: 'Masukkan simbol coin, contoh: btc, eth, sol',
        required: true,
      },
    ],
  },
];

// Daftarkan command ke Discord
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🔄 Registering slash commands...');
    
    // PILIHAN 1: Register ke server spesifik (INSTANT - untuk testing)
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log('✅ Command /dc berhasil didaftarkan ke server!');
      console.log('⚡ Command langsung bisa dipakai!');
    } else {
      // PILIHAN 2: Register global (butuh waktu 1 jam)
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('✅ Command /dc berhasil didaftarkan secara global');
      console.log('⏳ Tunggu hingga 1 jam untuk command tersedia di semua server');
    }
    
    console.log('💡 Bot bisa digunakan oleh semua orang di server!');
  } catch (err) {
    console.error('❌ Gagal daftar command:', err);
  }
})();

// Mapping symbol ke CoinGecko ID yang benar
const COIN_ID_MAPPING = {
  // Top Market Cap
  'BTC': { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  'ETH': { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  'USDT': { id: 'tether', name: 'Tether', symbol: 'USDT' },
  'BNB': { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  'SOL': { id: 'solana', name: 'Solana', symbol: 'SOL' },
  'USDC': { id: 'usd-coin', name: 'USD Coin', symbol: 'USDC' },
  'XRP': { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  'DOGE': { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  'ADA': { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  'TRX': { id: 'tron', name: 'TRON', symbol: 'TRX' },
  'AVAX': { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
  'LINK': { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  'TON': { id: 'the-open-network', name: 'Toncoin', symbol: 'TON' },
  'SHIB': { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB' },
  'DOT': { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  'MATIC': { id: 'matic-network', name: 'Polygon', symbol: 'MATIC' },
  'LTC': { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
  'BCH': { id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'BCH' },
  'UNI': { id: 'uniswap', name: 'Uniswap', symbol: 'UNI' },
  'ATOM': { id: 'cosmos', name: 'Cosmos', symbol: 'ATOM' },
  
  // Trending & Hot Coins 2024-2025
  'PEPE': { id: 'pepe', name: 'Pepe', symbol: 'PEPE' },
  'WIF': { id: 'dogwifcoin', name: 'dogwifhat', symbol: 'WIF' },
  'BONK': { id: 'bonk', name: 'Bonk', symbol: 'BONK' },
  'FLOKI': { id: 'floki', name: 'FLOKI', symbol: 'FLOKI' },
  'BRETT': { id: 'brett', name: 'Brett', symbol: 'BRETT' },
  'POPCAT': { id: 'popcat', name: 'Popcat', symbol: 'POPCAT' },
  'MEW': { id: 'cat-in-a-dogs-world', name: 'cat in a dogs world', symbol: 'MEW' },
  'BOME': { id: 'book-of-meme', name: 'BOOK OF MEME', symbol: 'BOME' },
  'MYRO': { id: 'myro', name: 'Myro', symbol: 'MYRO' },
  
  // AI & Tech Trending
  'FET': { id: 'fetch-ai', name: 'Fetch.ai', symbol: 'FET' },
  'RENDER': { id: 'render-token', name: 'Render', symbol: 'RENDER' },
  'RNDR': { id: 'render-token', name: 'Render', symbol: 'RNDR' },
  'TAO': { id: 'bittensor', name: 'Bittensor', symbol: 'TAO' },
  'AGIX': { id: 'singularitynet', name: 'SingularityNET', symbol: 'AGIX' },
  'OCEAN': { id: 'ocean-protocol', name: 'Ocean Protocol', symbol: 'OCEAN' },
  'GRT': { id: 'the-graph', name: 'The Graph', symbol: 'GRT' },
  
  // Layer 2 & Scaling
  'ARB': { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB' },
  'OP': { id: 'optimism', name: 'Optimism', symbol: 'OP' },
  'IMX': { id: 'immutable-x', name: 'Immutable', symbol: 'IMX' },
  'STRK': { id: 'starknet', name: 'Starknet', symbol: 'STRK' },
  'METIS': { id: 'metis-token', name: 'Metis', symbol: 'METIS' },
  
  // New Layer 1s
  'SUI': { id: 'sui', name: 'Sui', symbol: 'SUI' },
  'APT': { id: 'aptos', name: 'Aptos', symbol: 'APT' },
  'SEI': { id: 'sei-network', name: 'Sei', symbol: 'SEI' },
  'TIA': { id: 'celestia', name: 'Celestia', symbol: 'TIA' },
  'INJ': { id: 'injective-protocol', name: 'Injective', symbol: 'INJ' },
  'NEAR': { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR' },
  'STX': { id: 'blockstack', name: 'Stacks', symbol: 'STX' },
  'HBAR': { id: 'hedera-hashgraph', name: 'Hedera', symbol: 'HBAR' },
  'FTM': { id: 'fantom', name: 'Fantom', symbol: 'FTM' },
  
  // DeFi Blue Chips
  'AAVE': { id: 'aave', name: 'Aave', symbol: 'AAVE' },
  'MKR': { id: 'maker', name: 'Maker', symbol: 'MKR' },
  'CRV': { id: 'curve-dao-token', name: 'Curve', symbol: 'CRV' },
  'LDO': { id: 'lido-dao', name: 'Lido DAO', symbol: 'LDO' },
  'SNX': { id: 'havven', name: 'Synthetix', symbol: 'SNX' },
  'COMP': { id: 'compound-governance-token', name: 'Compound', symbol: 'COMP' },
  'SUSHI': { id: 'sushi', name: 'SushiSwap', symbol: 'SUSHI' },
  'CAKE': { id: 'pancakeswap-token', name: 'PancakeSwap', symbol: 'CAKE' },
  '1INCH': { id: '1inch', name: '1inch', symbol: '1INCH' },
  'DYDX': { id: 'dydx', name: 'dYdX', symbol: 'DYDX' },
  'GMX': { id: 'gmx', name: 'GMX', symbol: 'GMX' },
  'PENDLE': { id: 'pendle', name: 'Pendle', symbol: 'PENDLE' },
  
  // RWA (Real World Assets)
  'ONDO': { id: 'ondo-finance', name: 'Ondo', symbol: 'ONDO' },
  
  // Gaming & Metaverse
  'SAND': { id: 'the-sandbox', name: 'The Sandbox', symbol: 'SAND' },
  'MANA': { id: 'decentraland', name: 'Decentraland', symbol: 'MANA' },
  'AXS': { id: 'axie-infinity', name: 'Axie Infinity', symbol: 'AXS' },
  'GALA': { id: 'gala', name: 'Gala', symbol: 'GALA' },
  'ENJ': { id: 'enjincoin', name: 'Enjin Coin', symbol: 'ENJ' },
  'BEAM': { id: 'beam-2', name: 'Beam', symbol: 'BEAM' },
  'PRIME': { id: 'echelon-prime', name: 'Echelon Prime', symbol: 'PRIME' },
  
  // Oracles & Infrastructure
  'PYTH': { id: 'pyth-network', name: 'Pyth Network', symbol: 'PYTH' },
  'WLD': { id: 'worldcoin-wld', name: 'Worldcoin', symbol: 'WLD' },
  
  // Other Popular
  'XLM': { id: 'stellar', name: 'Stellar', symbol: 'XLM' },
  'ETC': { id: 'ethereum-classic', name: 'Ethereum Classic', symbol: 'ETC' },
  'XMR': { id: 'monero', name: 'Monero', symbol: 'XMR' },
  'THETA': { id: 'theta-token', name: 'Theta Network', symbol: 'THETA' },
  'FIL': { id: 'filecoin', name: 'Filecoin', symbol: 'FIL' },
  'VET': { id: 'vechain', name: 'VeChain', symbol: 'VET' },
  'ICP': { id: 'internet-computer', name: 'Internet Computer', symbol: 'ICP' },
  'ALGO': { id: 'algorand', name: 'Algorand', symbol: 'ALGO' },
  'FLOW': { id: 'flow', name: 'Flow', symbol: 'FLOW' },
  'QNT': { id: 'quant-network', name: 'Quant', symbol: 'QNT' },
  'RUNE': { id: 'thorchain', name: 'THORChain', symbol: 'RUNE' },
  'KSM': { id: 'kusama', name: 'Kusama', symbol: 'KSM' },
  'RPL': { id: 'rocket-pool', name: 'Rocket Pool', symbol: 'RPL' },
  'ENS': { id: 'ethereum-name-service', name: 'Ethereum Name Service', symbol: 'ENS' },
  'BLUR': { id: 'blur', name: 'Blur', symbol: 'BLUR' },
  
  // Additional 50 Coins
  'JUP': { id: 'jupiter-exchange-solana', name: 'Jupiter', symbol: 'JUP' },
  'WOO': { id: 'woo-network', name: 'WOO Network', symbol: 'WOO' },
  'JTO': { id: 'jito-governance-token', name: 'Jito', symbol: 'JTO' },
  'PIXEL': { id: 'pixels', name: 'Pixels', symbol: 'PIXEL' },
  'ORDI': { id: 'ordinals', name: 'ORDI', symbol: 'ORDI' },
  'SATS': { id: '1000sats', name: '1000SATS', symbol: 'SATS' },
  'RATS': { id: 'rats', name: 'Rats', symbol: 'RATS' },
  'TRB': { id: 'tellor', name: 'Tellor', symbol: 'TRB' },
  'MEME': { id: 'memecoin', name: 'Memecoin', symbol: 'MEME' },
  'MANTA': { id: 'manta-network', name: 'Manta Network', symbol: 'MANTA' },
  'DYM': { id: 'dymension', name: 'Dymension', symbol: 'DYM' },
  'ALT': { id: 'altlayer', name: 'AltLayer', symbol: 'ALT' },
  'XAI': { id: 'xai-blockchain', name: 'Xai', symbol: 'XAI' },
  'ACE': { id: 'fusionist', name: 'Fusionist', symbol: 'ACE' },
  'NFP': { id: 'nfprompt', name: 'NFPrompt', symbol: 'NFP' },
  'AI': { id: 'sleepless-ai', name: 'Sleepless AI', symbol: 'AI' },
  'PORTAL': { id: 'portal', name: 'Portal', symbol: 'PORTAL' },
  'AEVO': { id: 'aevo', name: 'Aevo', symbol: 'AEVO' },
  'ETHFI': { id: 'ether-fi', name: 'ether.fi', symbol: 'ETHFI' },
  'SAGA': { id: 'saga', name: 'Saga', symbol: 'SAGA' },
  'OMNI': { id: 'omni-network', name: 'Omni Network', symbol: 'OMNI' },
  'W': { id: 'wormhole', name: 'Wormhole', symbol: 'W' },
  'ENA': { id: 'ethena', name: 'Ethena', symbol: 'ENA' },
  'REZ': { id: 'renzo', name: 'Renzo', symbol: 'REZ' },
  'BB': { id: 'bouncbit', name: 'BounceBit', symbol: 'BB' },
  'NOT': { id: 'notcoin', name: 'Notcoin', symbol: 'NOT' },
  'IO': { id: 'io-net', name: 'io.net', symbol: 'IO' },
  'ZK': { id: 'zksync', name: 'zkSync', symbol: 'ZK' },
  'ZRO': { id: 'layerzero', name: 'LayerZero', symbol: 'ZRO' },
  'LISTA': { id: 'lista-dao', name: 'Lista DAO', symbol: 'LISTA' },
  'BANANA': { id: 'banana-gun', name: 'Banana Gun', symbol: 'BANANA' },
  'DOGS': { id: 'dogs', name: 'DOGS', symbol: 'DOGS' },
  'HMSTR': { id: 'hamster-kombat', name: 'Hamster Kombat', symbol: 'HMSTR' },
  'CATI': { id: 'catizen', name: 'Catizen', symbol: 'CATI' },
  'NEIRO': { id: 'neiro', name: 'Neiro', symbol: 'NEIRO' },
  'TURBO': { id: 'turbo', name: 'Turbo', symbol: 'TURBO' },
  'EIGEN': { id: 'eigenlayer', name: 'EigenLayer', symbol: 'EIGEN' },
  'SCR': { id: 'scroll', name: 'Scroll', symbol: 'SCR' },
  'GOAT': { id: 'goatseus-maximus', name: 'Goatseus Maximus', symbol: 'GOAT' },
  'PNUT': { id: 'peanut-the-squirrel', name: 'Peanut the Squirrel', symbol: 'PNUT' },
  'ACT': { id: 'achain', name: 'Achain', symbol: 'ACT' },
  'MOVE': { id: 'move', name: 'Move', symbol: 'MOVE' },
  'ME': { id: 'magic-eden', name: 'Magic Eden', symbol: 'ME' },
  'VIRTUAL': { id: 'virtual-protocol', name: 'Virtual Protocol', symbol: 'VIRTUAL' },
  'PENGU': { id: 'pudgy-penguins', name: 'Pudgy Penguins', symbol: 'PENGU' },
  
  // Privacy & Security Coins
  'ZEC': { id: 'zcash', name: 'Zcash', symbol: 'ZEC' },
  'DASH': { id: 'dash', name: 'Dash', symbol: 'DASH' },
  'DCR': { id: 'decred', name: 'Decred', symbol: 'DCR' },
  'ZEN': { id: 'horizen', name: 'Horizen', symbol: 'ZEN' },
  'PIVX': { id: 'pivx', name: 'PIVX', symbol: 'PIVX' },
  'FIRO': { id: 'firo', name: 'Firo', symbol: 'FIRO' },
  
  // Old School Classics
  'DGB': { id: 'digibyte', name: 'DigiByte', symbol: 'DGB' },
  'RVN': { id: 'ravencoin', name: 'Ravencoin', symbol: 'RVN' },
  'BTG': { id: 'bitcoin-gold', name: 'Bitcoin Gold', symbol: 'BTG' },
  'BTT': { id: 'bittorrent', name: 'BitTorrent', symbol: 'BTT' },
  'WIN': { id: 'wink', name: 'WINkLink', symbol: 'WIN' },
  'HOT': { id: 'holochain', name: 'Holo', symbol: 'HOT' },
  'SC': { id: 'siacoin', name: 'Siacoin', symbol: 'SC' },
  'STORJ': { id: 'storj', name: 'Storj', symbol: 'STORJ' },
  
  // Exchange Tokens
  'CRO': { id: 'crypto-com-chain', name: 'Cronos', symbol: 'CRO' },
  'OKB': { id: 'okb', name: 'OKB', symbol: 'OKB' },
  'HT': { id: 'huobi-token', name: 'Huobi Token', symbol: 'HT' },
  'LEO': { id: 'leo-token', name: 'LEO Token', symbol: 'LEO' },
  'GT': { id: 'gatechain-token', name: 'Gate', symbol: 'GT' },
  'KCS': { id: 'kucoin-shares', name: 'KuCoin Token', symbol: 'KCS' },
  'MX': { id: 'mx-token', name: 'MX Token', symbol: 'MX' },
  
  // Stablecoins & Wrapped
  'DAI': { id: 'dai', name: 'Dai', symbol: 'DAI' },
  'TUSD': { id: 'true-usd', name: 'TrueUSD', symbol: 'TUSD' },
  'USDP': { id: 'paxos-standard', name: 'Pax Dollar', symbol: 'USDP' },
  'FRAX': { id: 'frax', name: 'Frax', symbol: 'FRAX' },
  'LUSD': { id: 'liquity-usd', name: 'Liquity USD', symbol: 'LUSD' },
  'WBTC': { id: 'wrapped-bitcoin', name: 'Wrapped Bitcoin', symbol: 'WBTC' },
  'WETH': { id: 'weth', name: 'Wrapped Ethereum', symbol: 'WETH' },
  'STETH': { id: 'staked-ether', name: 'Lido Staked Ether', symbol: 'STETH' },
  
  // DeFi 2.0 & Derivatives
  'CVX': { id: 'convex-finance', name: 'Convex Finance', symbol: 'CVX' },
  'FXS': { id: 'frax-share', name: 'Frax Share', symbol: 'FXS' },
  'BAL': { id: 'balancer', name: 'Balancer', symbol: 'BAL' },
  'YFI': { id: 'yearn-finance', name: 'yearn.finance', symbol: 'YFI' },
  'ALCX': { id: 'alchemix', name: 'Alchemix', symbol: 'ALCX' },
  'SPELL': { id: 'spell-token', name: 'Spell Token', symbol: 'SPELL' },
  'ICE': { id: 'ice-token', name: 'Ice Token', symbol: 'ICE' },
  
  // Real Yield & LSDs
  'ANKR': { id: 'ankr', name: 'Ankr', symbol: 'ANKR' },
  'RETH': { id: 'rocket-pool-eth', name: 'Rocket Pool ETH', symbol: 'RETH' },
  'FRXETH': { id: 'frax-ether', name: 'Frax Ether', symbol: 'FRXETH' },
  'SFRXETH': { id: 'staked-frax-ether', name: 'Staked Frax Ether', symbol: 'SFRXETH' },
  
  // Solana Ecosystem
  'RAY': { id: 'raydium', name: 'Raydium', symbol: 'RAY' },
  'ORCA': { id: 'orca', name: 'Orca', symbol: 'ORCA' },
  'SRM': { id: 'serum', name: 'Serum', symbol: 'SRM' },
  'MNGO': { id: 'mango-markets', name: 'Mango', symbol: 'MNGO' },
  'STEP': { id: 'step-finance', name: 'Step Finance', symbol: 'STEP' },
  'FIDA': { id: 'bonfida', name: 'Bonfida', symbol: 'FIDA' },
  'SAMO': { id: 'samoyedcoin', name: 'Samoyedcoin', symbol: 'SAMO' },
  
  // NFT & Metaverse Extended
  'APE': { id: 'apecoin', name: 'ApeCoin', symbol: 'APE' },
  'LOOKS': { id: 'looksrare', name: 'LooksRare', symbol: 'LOOKS' },
  'X2Y2': { id: 'x2y2', name: 'X2Y2', symbol: 'X2Y2' },
  'RARE': { id: 'superrare', name: 'SuperRare', symbol: 'RARE' },
  'GHST': { id: 'aavegotchi', name: 'Aavegotchi', symbol: 'GHST' },
  'ILV': { id: 'illuvium', name: 'Illuvium', symbol: 'ILV' },
  'ALICE': { id: 'my-neighbor-alice', name: 'My Neighbor Alice', symbol: 'ALICE' },
  'TLM': { id: 'alien-worlds', name: 'Alien Worlds', symbol: 'TLM' },
  'SLP': { id: 'smooth-love-potion', name: 'Smooth Love Potion', symbol: 'SLP' },
  
  // Infrastructure & Middleware
  'API3': { id: 'api3', name: 'API3', symbol: 'API3' },
  'BAND': { id: 'band-protocol', name: 'Band Protocol', symbol: 'BAND' },
  'CELR': { id: 'celer-network', name: 'Celer Network', symbol: 'CELR' },
  'SYN': { id: 'synapse-2', name: 'Synapse', symbol: 'SYN' },
  'CTSI': { id: 'cartesi', name: 'Cartesi', symbol: 'CTSI' },
  'SKL': { id: 'skale', name: 'SKALE', symbol: 'SKL' },
  'LPT': { id: 'livepeer', name: 'Livepeer', symbol: 'LPT' },
  
  // Emerging Ecosystems
  'HIVE': { id: 'hive', name: 'Hive', symbol: 'HIVE' },
  'STEEM': { id: 'steem', name: 'Steem', symbol: 'STEEM' },
  'LSK': { id: 'lisk', name: 'Lisk', symbol: 'LSK' },
  'ARDR': { id: 'ardor', name: 'Ardor', symbol: 'ARDR' },
  'NXS': { id: 'nexus', name: 'Nexus', symbol: 'NXS' },
  'PART': { id: 'particl', name: 'Particl', symbol: 'PART' },
  'SYS': { id: 'syscoin', name: 'Syscoin', symbol: 'SYS' },
  'VTC': { id: 'vertcoin', name: 'Vertcoin', symbol: 'VTC' },
  'NAV': { id: 'navcoin', name: 'Navcoin', symbol: 'NAV' },
  'XVG': { id: 'verge', name: 'Verge', symbol: 'XVG' },
};

// Cache untuk coin list
let coinListCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 3600000; // 1 jam

// Fungsi ambil coin list dengan cache
async function getCoinList() {
  const now = Date.now();
  if (coinListCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return coinListCache;
  }

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list', {
      timeout: 15000
    });
    coinListCache = response.data;
    cacheTimestamp = now;
    console.log('✅ Coin list cache updated');
    return coinListCache;
  } catch (error) {
    console.error('⚠️ Error fetching coin list:', error.message);
    if (coinListCache) return coinListCache;
    throw error;
  }
}

// Fungsi untuk mencari coin ID
async function findCoinId(symbol) {
  const upperSymbol = symbol.toUpperCase();
  
  // Cek mapping manual dulu (prioritas)
  if (COIN_ID_MAPPING[upperSymbol]) {
    console.log(`✅ Found in mapping: ${upperSymbol} -> ${COIN_ID_MAPPING[upperSymbol].id}`);
    return COIN_ID_MAPPING[upperSymbol];
  }

  // Cari di coin list
  try {
    const coinList = await getCoinList();
    const found = coinList.find(c => c.symbol.toLowerCase() === symbol.toLowerCase());
    
    if (found) {
      console.log(`✅ Found in list: ${upperSymbol} -> ${found.id}`);
      return {
        id: found.id,
        name: found.name,
        symbol: upperSymbol
      };
    }
  } catch (error) {
    console.error('Error searching coin list:', error.message);
  }

  return null;
}

// Fungsi ambil data coin dari CoinGecko
async function getCoinData(symbol) {
  try {
    console.log(`🔍 Mencari data untuk: ${symbol}`);
    
    const coinInfo = await findCoinId(symbol);
    
    if (!coinInfo) {
      return { 
        error: 'not_found', 
        message: `Coin "${symbol.toUpperCase()}" tidak ditemukan.\n\nCoba coin populer: BTC, ETH, SOL, BNB, XRP, ADA, DOGE, PEPE, SHIB` 
      };
    }

    console.log(`📊 Mengambil data untuk: ${coinInfo.name} (${coinInfo.id})`);

    // Ambil data detail coin
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinInfo.id}`, {
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
        sparkline: false
      },
      timeout: 15000
    });

    const data = response.data;
    const marketData = data.market_data;

    // Validasi data
    if (!marketData || !marketData.current_price || !marketData.current_price.usd) {
      return { 
        error: 'invalid_data', 
        message: 'Data harga tidak tersedia untuk coin ini' 
      };
    }

    console.log(`✅ Data berhasil diambil untuk ${coinInfo.symbol}`);

    return {
      name: coinInfo.name,
      symbol: coinInfo.symbol,
      image: data.image?.small || data.image?.thumb || null,
      price: marketData.current_price.usd,
      btc: marketData.current_price.btc || 0,
      eth: marketData.current_price.eth || 0,
      high: marketData.high_24h?.usd || marketData.current_price.usd,
      low: marketData.low_24h?.usd || marketData.current_price.usd,
      change1h: marketData.price_change_percentage_1h_in_currency?.usd || null,
      change24h: marketData.price_change_percentage_24h || 0,
      change7d: marketData.price_change_percentage_7d || 0,
      change30d: marketData.price_change_percentage_30d || null,
      cap: marketData.market_cap?.usd || 0,
      vol: marketData.total_volume?.usd || 0,
      rank: data.market_cap_rank || 'N/A',
      circulatingSupply: marketData.circulating_supply || null,
      totalSupply: marketData.total_supply || null,
      ath: marketData.ath?.usd || null,
      atl: marketData.atl?.usd || null,
    };
  } catch (error) {
    console.error('❌ Error detail:', error.message);
    
    if (error.response?.status === 429) {
      return { 
        error: 'rate_limit', 
        message: 'Terlalu banyak request ke CoinGecko.\nTunggu 1-2 menit dan coba lagi.' 
      };
    }
    
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return { 
        error: 'timeout', 
        message: 'Request timeout.\nCoba lagi dalam beberapa saat.' 
      };
    }

    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      return { 
        error: 'network', 
        message: 'Tidak dapat terhubung ke CoinGecko.\nPeriksa koneksi internet Anda.' 
      };
    }

    return { 
      error: 'unknown', 
      message: `Terjadi kesalahan: ${error.message}\n\nCoba lagi dalam beberapa saat.` 
    };
  }
}

// Format angka
function formatNumber(num, decimals = 2) {
  if (!num || isNaN(num)) return '$0.00';
  if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
  return `${num.toFixed(decimals)}`;
}

// Format harga
function formatPrice(price) {
  if (!price || isNaN(price)) return '$0.00';
  if (price >= 1) {
    return `${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (price >= 0.01) {
    return `${price.toFixed(4)}`;
  } else if (price >= 0.0001) {
    return `${price.toFixed(6)}`;
  } else {
    return `${price.toFixed(8)}`;
  }
}

// Event saat command dijalankan
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'dc') {
    const symbol = interaction.options.getString('symbol');
    console.log(`\n🎯 Command /dc ${symbol} dari ${interaction.user.tag}`);
    
    // Defer reply untuk memberi waktu proses
    await interaction.deferReply();

    const coin = await getCoinData(symbol);

    // Handle errors
    if (coin.error) {
      console.log(`❌ Error: ${coin.error}`);
      const errorEmbed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription(coin.message)
        .setColor(0xff0000)
        .setFooter({ text: 'Powered by Demon Chain • Data by CoinGecko' });
      
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    // Emoji berdasarkan perubahan harga
    const emoji24h = coin.change24h < 0 ? '😔' : '😄';
    const emoji7d = coin.change7d < 0 ? '😢' : '🚀';

    // Build description
    let description = `**${formatPrice(coin.price)}**\n\n`;
    
    description += `📈 **H|L 24h:** ${formatPrice(coin.high)} | ${formatPrice(coin.low)}\n\n`;

    // Perubahan harga
    if (coin.change1h !== null) {
      description += `**1h:** ${coin.change1h.toFixed(2)}% ${coin.change1h < 0 ? '😕' : '😎'}\n`;
    }
    description += `**24h:** ${coin.change24h.toFixed(2)}% ${emoji24h}\n`;
    description += `**7d:** ${coin.change7d.toFixed(2)}% ${emoji7d}\n`;
    
    if (coin.change30d !== null) {
      const emoji30d = coin.change30d < 0 ? '📉' : '📈';
      description += `**30d:** ${coin.change30d.toFixed(2)}% ${emoji30d}\n`;
    }

    description += `\n🏅 **Rank:** #${coin.rank}\n`;
    description += `💹 **Market Cap:** ${formatNumber(coin.cap)}\n`;
    description += `📊 **Volume 24h:** ${formatNumber(coin.vol)}`;

    const embed = new EmbedBuilder()
      .setTitle(`💎 ${coin.name} (${coin.symbol})`)
      .setDescription(description)
      .setColor(coin.change24h < 0 ? 0xff0000 : 0x00ff00)
      .setFooter({ text: 'Powered by Demon Chain • Data by CoinGecko' })
      .setTimestamp();

    if (coin.image) {
      embed.setThumbnail(coin.image);
    }

    await interaction.editReply({ embeds: [embed] });
    console.log(`✅ Response sent for ${coin.symbol}`);
  }
});

// Event saat bot ready
client.once('ready', async () => {
  console.log(`\n✅ Bot online sebagai ${client.user.tag}`);
  console.log('🚀 Siap menerima command /dc dari SEMUA ORANG');
  console.log('💡 Contoh: /dc btc, /dc eth, /dc sol');
  
  // Cek command yang terdaftar
  try {
    const registeredCommands = await client.application.commands.fetch();
    console.log('📋 Registered commands:', registeredCommands.map(c => c.name).join(', ') || 'None');
    
    if (registeredCommands.size === 0) {
      console.log('⚠️  WARNING: Tidak ada command terdaftar!');
      console.log('💡 Pastikan GUILD_ID ada di .env file');
    }
  } catch (error) {
    console.error('❌ Error fetching commands:', error.message);
  }
  
  console.log('🌍 Bot dapat digunakan di semua server!\n');
});

// Error handling
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

// Login bot
client.login(process.env.TOKEN);