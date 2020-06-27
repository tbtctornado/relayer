const fetch = require('node-fetch')
const Web3 = require('web3')
const { gasOracleUrls, defaultGasPrice, oracleRpcUrl, oracleAddress } = require('../config')
const { getArgsForOracle } = require('./utils')
const { redisClient } = require('./redis')
const priceOracleABI = require('../abis/PriceOracle.abi.json')

class Fetcher {
  constructor(web3) {
    this.web3 = web3
    this.oracleWeb3 = new Web3(oracleRpcUrl)
    this.oracle = new this.oracleWeb3.eth.Contract(priceOracleABI, oracleAddress)
    this.ethPrices = {
      tbtc: '45350000000000000000',
    }
    this.tokenAddresses
    this.oneUintAmount
    this.currencyLookup
    this.gasPrices = {
      fast: defaultGasPrice
    }

    const { tokenAddresses, oneUintAmount, currencyLookup } = getArgsForOracle()
    this.tokenAddresses = tokenAddresses
    this.oneUintAmount = oneUintAmount
    this.currencyLookup = currencyLookup
  }
  async fetchPrices() {
    try {
      let prices = await this.oracle.methods
        .getPricesInETH(this.tokenAddresses, this.oneUintAmount)
        .call()
      this.ethPrices = prices.reduce((acc, price, i) => {
        acc[this.currencyLookup[this.tokenAddresses[i]]] = price
        return acc
      }, {})
      setTimeout(() => this.fetchPrices(), 1000 * 30)
    } catch(e) {
      console.error('fetchPrices', e.message)
      setTimeout(() => this.fetchPrices(), 1000 * 30)
    }
  }
  async fetchGasPrice({ oracleIndex = 0 } = {}) {
    oracleIndex = (oracleIndex + 1) % gasOracleUrls.length
    const url = gasOracleUrls[oracleIndex]
    const delimiter = url === 'https://ethgasstation.info/json/ethgasAPI.json' ? 10 : 1
    try {
      const response = await fetch(url)
      if (response.status === 200) {
        const json = await response.json()
        if (Number(json.fast) === 0) {
          throw new Error('Fetch gasPrice failed')
        }

        if (json.fast) {
          this.gasPrices.fast = Number(json.fast) / delimiter
        }

        if (json.percentile_97) {
          this.gasPrices.fast = parseInt(json.percentile_90) + 1 / delimiter
        }
        // console.log('gas price fetch', this.gasPrices)
      } else {
        throw Error('Fetch gasPrice failed')
      }
      setTimeout(() => this.fetchGasPrice({ oracleIndex }), 15000)
    } catch (e) {
      console.log('fetchGasPrice', e.message)
      setTimeout(() => this.fetchGasPrice({ oracleIndex }), 15000)
    }
  }
  async fetchNonce() {
    try {
      const nonce = await this.web3.eth.getTransactionCount(this.web3.eth.defaultAccount)
      await redisClient.set('nonce', nonce)
      console.log(`Current nonce: ${nonce}`)
    } catch(e) {
      console.error('fetchNonce failed', e.message)
      setTimeout(this.fetchNonce, 3000)
    }
  }
}

module.exports = Fetcher
