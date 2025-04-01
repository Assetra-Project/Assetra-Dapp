import { BrowserProvider, Contract, ethers } from 'ethers';
import { CONTRACT_ADDRESS } from './constants';
import contractABI from './BondContractABI.json';

class EthersService {
  private provider: BrowserProvider | null = null;
  private contract: Contract | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask to use this application');
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      this.isInitialized = true;
    } catch (error) {
      this.provider = null;
      this.contract = null;
      this.isInitialized = false;
      throw error;
    }
  }

  async configureBond(
    isin: string,
    numberOfBondUnits: number,
    nominalValue: number,
    totalValue: number,
    investmentAmount: number,
    fractionalDenomination: number,
    startDate: number,
    maturityDate: number
  ) {
    if (!this.isInitialized || !this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract initialization failed');
    }

    try {
      const tx = await this.contract.configureBond(
        isin,
        numberOfBondUnits,
        nominalValue,
        totalValue,
        investmentAmount,
        fractionalDenomination,
        startDate,
        maturityDate
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error configuring bond:', error);
      throw error;
    }
  }

  async getBondDetails() {
    if (!this.isInitialized || !this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract initialization failed');
    }

    try {
      const details = await this.contract.getBondDetails();
      return details;
    } catch (error) {
      console.error('Error getting bond details:', error);
      throw error;
    }
  }

  async getInvestorBondHoldings(address: string, isin: string) {
    if (!this.isInitialized || !this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract initialization failed');
    }

    try {
      const holdings = await this.contract.investorBondHoldings(address, isin);
      return holdings;
    } catch (error) {
      console.error('Error getting investor holdings:', error);
      throw error;
    }
  }

  async purchaseBondTokens(isin: string, amount: number, value: bigint) {
    if (!this.isInitialized || !this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract initialization failed');
    }

    try {
      const tx = await this.contract.purchaseBondTokens(isin, amount, { value });
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error purchasing bond tokens:', error);
      throw error;
    }
  }

  async tokenizeBond(isin: string, tokensToIssue: number) {
    if (!this.isInitialized || !this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract initialization failed');
    }

    try {
      const tx = await this.contract.tokenizeBond(isin, tokensToIssue);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error tokenizing bond:', error);
      throw error;
    }
  }

  async connectWallet() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.provider) {
      throw new Error('Provider initialization failed');
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async getConnectedAddress(): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.provider) {
      return null;
    }

    try {
      const accounts = await this.provider.listAccounts();
      return accounts[0]?.address || null;
    } catch (error) {
      console.error('Error getting connected address:', error);
      return null;
    }
  }

  async switchToHederaNetwork() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask to use this application');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x128',
          chainName: 'Hedera Testnet',
          nativeCurrency: {
            name: 'HBAR',
            symbol: 'ℏ',
            decimals: 8
          },
          rpcUrls: ['https://testnet.hashio.io/api'],
          blockExplorerUrls: ['https://hashscan.io/testnet']
        }]
      });
    } catch (error) {
      console.error('Error switching to Hedera network:', error);
      throw error;
    }
  }
}

export const ethersService = new EthersService();