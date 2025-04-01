interface Token {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  isin: string;
  totalSupply: number;
  availableSupply: number;
  price: number;
  createdAt: string;
  owner: string;
  type: 'bond' | 'asset';
  description?: string;
  isNSEListed: boolean;
  imageUrl?: string;
  marketCap?: number;
  change24h?: number;
  volume24h?: number;
  sector?: string;
  priceHBAR: number;
  priceUSD: number;
  marketCapHBAR: number;
  marketCapUSD: number;
  volume24hHBAR: number;
  volume24hUSD: number;
  chart7d?: number[];
}

interface Trade {
  id: string;
  tokenId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  buyer: string;
  seller: string;
  timestamp: string;
}

const NSE_TOKENS: Omit<Token, 'id' | 'createdAt'>[] = [
  {
    name: "Kenya Government Bond 2024",
    symbol: "KGB24",
    decimals: 2,
    isin: "KE0000123456",
    totalSupply: 1000000,
    availableSupply: 750000,
    price: 1000,
    owner: "nse@example.com",
    type: 'bond',
    description: "2-year Kenyan Government Bond with 12.5% annual yield",
    isNSEListed: true,
    imageUrl: "https://images.unsplash.com/photo-1634542984003-e0fb8e200e91?q=80&w=2069&auto=format&fit=crop",
    marketCap: 1000000000,
    change24h: 0.25,
    volume24h: 50000000,
    sector: "Government",
    priceHBAR: 1000,
    priceUSD: 1000,
    marketCapHBAR: 1000000000,
    marketCapUSD: 1000000000,
    volume24hHBAR: 50000000,
    volume24hUSD: 50000000,
    chart7d: [10, 12, 11, 13, 14, 12, 13]
  },
  {
    name: "Safaricom PLC",
    symbol: "SCOM",
    decimals: 2,
    isin: "KE1000001402",
    totalSupply: 40000000,
    availableSupply: 35000000,
    price: 25.55,
    owner: "nse@example.com",
    type: 'asset',
    description: "East Africa's leading telecommunications company",
    isNSEListed: true,
    imageUrl: "https://images.unsplash.com/photo-1598128558393-70ff21433be0?q=80&w=2089&auto=format&fit=crop",
    marketCap: 1022000000,
    change24h: -1.2,
    volume24h: 150000000,
    sector: "Telecommunications",
    priceHBAR: 25.55,
    priceUSD: 25.55,
    marketCapHBAR: 1022000000,
    marketCapUSD: 1022000000,
    volume24hHBAR: 150000000,
    volume24hUSD: 150000000,
    chart7d: [25, 26, 24, 25.5, 25.2, 25.55, 25.4]
  },
  {
    name: "East African Breweries",
    symbol: "EABL",
    decimals: 2,
    isin: "KE2000002002",
    totalSupply: 790774356,
    availableSupply: 600000000,
    price: 136.25,
    owner: "nse@example.com",
    type: 'asset',
    description: "Leading manufacturer of beer and spirits in East Africa",
    isNSEListed: true,
    imageUrl: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=2074&auto=format&fit=crop",
    marketCap: 107768081,
    change24h: 2.5,
    volume24h: 25000000,
    sector: "Consumer Goods",
    priceHBAR: 136.25,
    priceUSD: 136.25,
    marketCapHBAR: 107768081,
    marketCapUSD: 107768081,
    volume24hHBAR: 25000000,
    volume24hUSD: 25000000,
    chart7d: [134, 135, 135.5, 136, 136.5, 136.25, 136.4]
  },
  {
    name: "KCB Group",
    symbol: "KCB",
    decimals: 2,
    isin: "KE3000003000",
    totalSupply: 3213462815,
    availableSupply: 2800000000,
    price: 36.95,
    owner: "nse@example.com",
    type: 'asset',
    description: "One of the largest commercial banks in East Africa",
    isNSEListed: true,
    imageUrl: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=2070&auto=format&fit=crop",
    marketCap: 118737451,
    change24h: 0.8,
    volume24h: 45000000,
    sector: "Banking",
    priceHBAR: 36.95,
    priceUSD: 36.95,
    marketCapHBAR: 118737451,
    marketCapUSD: 118737451,
    volume24hHBAR: 45000000,
    volume24hUSD: 45000000,
    chart7d: [36, 36.5, 36.8, 36.9, 37, 36.95, 36.98]
  },
  {
    name: "Equity Group Holdings",
    symbol: "EQTY",
    decimals: 2,
    isin: "KE4000004000",
    totalSupply: 3773674802,
    availableSupply: 3200000000,
    price: 42.75,
    owner: "nse@example.com",
    type: 'asset',
    description: "Leading financial services provider in East Africa",
    isNSEListed: true,
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop",
    marketCap: 161324698,
    change24h: 1.5,
    volume24h: 55000000,
    sector: "Banking",
    priceHBAR: 42.75,
    priceUSD: 42.75,
    marketCapHBAR: 161324698,
    marketCapUSD: 161324698,
    volume24hHBAR: 55000000,
    volume24hUSD: 55000000,
    chart7d: [42, 42.2, 42.4, 42.6, 42.7, 42.75, 42.8]
  },
  {
    name: "Kenya Infrastructure Bond 2025",
    symbol: "KIFB25",
    decimals: 2,
    isin: "KE0000567890",
    totalSupply: 2000000,
    availableSupply: 1500000,
    price: 950,
    owner: "nse@example.com",
    type: 'bond',
    description: "3-year Infrastructure Bond with 11.75% annual yield",
    isNSEListed: true,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    marketCap: 1900000000,
    change24h: -0.15,
    volume24h: 25000000,
    sector: "Government",
    priceHBAR: 950,
    priceUSD: 950,
    marketCapHBAR: 1900000000,
    marketCapUSD: 1900000000,
    volume24hHBAR: 25000000,
    volume24hUSD: 25000000,
    chart7d: [952, 951, 950.5, 950.2, 950.1, 950, 949.9]
  }
];

class TokenStore {
  private tokens: Token[] = [];
  private trades: Trade[] = [];

  constructor() {
    const savedTokens = localStorage.getItem('tokens');
    const savedTrades = localStorage.getItem('trades');
    
    if (savedTokens) {
      this.tokens = JSON.parse(savedTokens);
    } else {
      this.tokens = NSE_TOKENS.map(token => ({
        ...token,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      }));
      this.save();
    }
    
    if (savedTrades) {
      this.trades = JSON.parse(savedTrades);
    }
  }

  private save() {
    localStorage.setItem('tokens', JSON.stringify(this.tokens));
    localStorage.setItem('trades', JSON.stringify(this.trades));
  }

  createToken(token: Omit<Token, 'id' | 'createdAt' | 'isNSEListed'>) {
    const newToken = {
      ...token,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isNSEListed: false,
      priceHBAR: token.price,
      priceUSD: token.price,
      marketCapHBAR: token.price * token.totalSupply,
      marketCapUSD: token.price * token.totalSupply,
      volume24hHBAR: 0,
      volume24hUSD: 0,
      chart7d: Array(7).fill(token.price)
    };

    this.tokens.push(newToken);
    
    this.save();
    return newToken;
  }

  listToken(tokenId: string, price: number) {
    const token = this.tokens.find(t => t.id === tokenId);
    if (!token) throw new Error('Token not found');

    token.price = price;
    token.priceHBAR = price;
    token.priceUSD = price;
    token.marketCapHBAR = price * token.totalSupply;
    token.marketCapUSD = price * token.totalSupply;
    token.isNSEListed = true;
    token.chart7d = Array(7).fill(price);
    this.save();
    return token;
  }

  getTokens() {
    return [...this.tokens];
  }

  getListedTokens() {
    return this.tokens.filter(token => token.isNSEListed);
  }

  getNSETokens() {
    return this.tokens.filter(token => token.owner === 'nse@example.com');
  }

  getUserTokens(owner: string) {
    return this.tokens.filter(token => token.owner === owner || this.trades.some(t => t.buyer === owner && t.tokenId === token.id));
  }

  createTrade(trade: Omit<Trade, 'id' | 'timestamp'>) {
    const token = this.tokens.find(t => t.id === trade.tokenId);
    if (!token) throw new Error('Token not found');

    if (trade.amount > token.availableSupply) {
      throw new Error('Insufficient available supply');
    }

    const newTrade = {
      ...trade,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    // Update token supply
    token.availableSupply -= trade.amount;
    
    // Add trade
    this.trades.push(newTrade);
    this.save();
    return newTrade;
  }

  getUserTrades(userId: string) {
    return this.trades.filter(
      trade => trade.buyer === userId || trade.seller === userId
    );
  }

  getTokenTrades(tokenId: string) {
    return this.trades.filter(trade => trade.tokenId === tokenId);
  }

  searchTokens(query: string, type: 'all' | 'bond' | 'asset' = 'all') {
    let filtered = this.tokens.filter(token => token.isNSEListed);

    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(token => 
        token.name.toLowerCase().includes(searchLower) ||
        token.symbol.toLowerCase().includes(searchLower) ||
        token.isin.toLowerCase().includes(searchLower) ||
        token.sector?.toLowerCase().includes(searchLower)
      );
    }

    if (type !== 'all') {
      filtered = filtered.filter(token => token.type === type);
    }

    return filtered;
  }
}

export const tokenStore = new TokenStore();