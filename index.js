const { createPublicClient, http, parseAbiItem } = require("viem");
const { polygon } = require("viem/chains");

// ============ 配置 ============
const NFT_MARKET_ADDRESS = "0xb4d4c6a27fe2eca51101669a00e085f45882e53f";

// 可使用公共 RPC 或替换为你自己的 RPC URL
const RPC_URL = process.env.POLYGON_RPC_URL || "https://polygon-rpc.com";

// ============ 事件定义 ============
const EVENT_LISTED = parseAbiItem(
  "event Listed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price)"
);
const EVENT_PURCHASED = parseAbiItem(
  "event Purchased(address indexed nftContract, uint256 indexed tokenId, address buyer, uint256 price, string method)"
);
const EVENT_CANCELLED = parseAbiItem(
  "event Cancelled(address indexed nftContract, uint256 indexed tokenId, address seller)"
);

// ============ 客户端 ============
const client = createPublicClient({
  chain: polygon,
  transport: http(RPC_URL),
});

// ============ 格式化工具 ============
function formatTime(iso) {
  return new Date(iso).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
}

function truncate(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// ============ 监听 Listed 事件（上架） ============
client.watchEvent({
  address: NFT_MARKET_ADDRESS,
  event: EVENT_LISTED,
  onLogs: (logs) => {
    for (const log of logs) {
      const { nftContract, tokenId, seller, price } = log.args;
      console.log(
        `[${formatTime(new Date().toISOString())}] 📋 上架 Listed | ` +
        `NFT合约: ${truncate(nftContract)} | ` +
        `TokenID: ${tokenId} | ` +
        `卖家: ${truncate(seller)} | ` +
        `价格: ${price} | ` +
        `Tx: ${log.transactionHash}`
      );
    }
  },
  onError: (err) => {
    console.error("Listed 监听出错:", err.message);
  },
});

// ============ 监听 Purchased 事件（购买） ============
client.watchEvent({
  address: NFT_MARKET_ADDRESS,
  event: EVENT_PURCHASED,
  onLogs: (logs) => {
    for (const log of logs) {
      const { nftContract, tokenId, buyer, price, method } = log.args;
      console.log(
        `[${formatTime(new Date().toISOString())}] 💰 购买 Purchased | ` +
        `NFT合约: ${truncate(nftContract)} | ` +
        `TokenID: ${tokenId} | ` +
        `买家: ${truncate(buyer)} | ` +
        `价格: ${price} | ` +
        `方式: ${method} | ` +
        `Tx: ${log.transactionHash}`
      );
    }
  },
  onError: (err) => {
    console.error("Purchased 监听出错:", err.message);
  },
});

// ============ 监听 Cancelled 事件（取消上架） ============
client.watchEvent({
  address: NFT_MARKET_ADDRESS,
  event: EVENT_CANCELLED,
  onLogs: (logs) => {
    for (const log of logs) {
      const { nftContract, tokenId, seller } = log.args;
      console.log(
        `[${formatTime(new Date().toISOString())}] ❌ 取消上架 Cancelled | ` +
        `NFT合约: ${truncate(nftContract)} | ` +
        `TokenID: ${tokenId} | ` +
        `卖家: ${truncate(seller)} | ` +
        `Tx: ${log.transactionHash}`
      );
    }
  },
  onError: (err) => {
    console.error("Cancelled 监听出错:", err.message);
  },
});

console.log("==============================================");
console.log("  NFTMarket 事件监听已启动");
console.log(`  合约地址: ${NFT_MARKET_ADDRESS}`);
console.log(`  网络: Polygon (chain ${polygon.id})`);
console.log(`  监听事件: Listed | Purchased | Cancelled`);
console.log("  等待链上事件...");
console.log("==============================================");
