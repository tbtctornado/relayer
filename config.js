require('dotenv').config()

module.exports = {
  version: 2.7,
  netId: Number(process.env.NET_ID) || 42,
  redisUrl: process.env.REDIS_URL,
  rpcUrl: process.env.RPC_URL || 'https://kovan.infura.io/',
  oracleRpcUrl: process.env.ORACLE_RPC_URL || 'https://mainnet.infura.io/',
  oracleAddress: '0xA2b8E7ee7c8a18ea561A5CF7C9C365592026E374',
  privateKey: process.env.PRIVATE_KEY,
  mixers: {
    netId1: {
      eth: {
        mixerAddress: {
          '0.1': '0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc',
          '1': '0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936',
          '10': '0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF',
          '100': '0xA160cdAB225685dA1d56aa342Ad8841c3b53f291'
        },
        symbol: 'ETH',
        decimals: 18
      },
      dai: {
        mixerAddress: {
          '100': '0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3',
          '1000': '0xFD8610d20aA15b7B2E3Be39B396a1bC3516c7144',
          '10000': '0xF60dD140cFf0706bAE9Cd734Ac3ae76AD9eBC32A',
          '100000': undefined
        },
        tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        symbol: 'DAI',
        decimals: 18
      },
      // before the tBTC is deployed, the pBTC token price is used for oracle
      weenus: {
        mixerAddress: {
          '0.001': undefined,
          '0.01': undefined,
          '0.1': undefined,
        },
        tokenAddress: '0x5228a22e72ccC52d415EcFd199F99D0665E7733b',
        symbol: 'pBTC',
        decimals: 18
      }
    },
    netId3: {
      weenus: {
        mixerAddress: {
          '0.001': '0x750be934a9e3D0e3Ea53D5404637A536c0CdDe68',
          '0.01': '0x70a3d78447FA3482003A64288a7905b581Ab21b5',
          '0.1': '0xA467352aB675F5d0E552bF2c17731f14Ac9E5416',
        },
        tokenAddress: '0x101848d5c5bbca18e6b4431eedf6b95e9adf82fa',
        symbol: 'WEENUS',
        decimals: 18
      }
    }
  },
  defaultGasPrice: 20,
  gasOracleUrls: ['https://ethgasstation.info/json/ethgasAPI.json', 'https://gas-oracle.zoltu.io/'],
  port: process.env.APP_PORT,
  relayerServiceFee: Number(process.env.RELAYER_FEE),
  maxGasPrice: process.env.MAX_GAS_PRICE || 200,
  watherInterval: Number(process.env.NONCE_WATCHER_INTERVAL || 30) * 1000,
  pendingTxTimeout: Number(process.env.ALLOWABLE_PENDING_TX_TIMEOUT || 180) * 1000,
  gasBumpPercentage: process.env.GAS_PRICE_BUMP_PERCENTAGE || 20
}
