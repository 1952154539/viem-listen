# viem-listen

基于 [Viem](https://viem.sh) 的轻量级链上事件监听工具，实时监听 Polygon 主网上 NFTMarket 合约的上架、购买和取消上架行为，并打印日志。

## 监听的事件

| 事件 | 触发函数 | 说明 |
|------|----------|------|
| `Listed` | `list()` | NFT 上架到市场 |
| `Purchased` | `buyNFT()` / `tokensReceived()` | NFT 被购买（支持两种方式） |
| `Cancelled` | `cancelListing()` | 卖家取消上架 |

## 合约信息

- **网络**: Polygon PoS (chain ID: 137)
- **NFTMarket 合约**: `0xb4d4c6a27fe2eca51101669a00e085f45882e53f`

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动监听
npm start
```

## 自定义 RPC

默认使用 Polygon 公共 RPC。如需使用自己的节点，设置环境变量：

```bash
POLYGON_RPC_URL=https://your-rpc-url npm start
```

## 示例输出

```
==============================================
  NFTMarket 事件监听已启动
  合约地址: 0xb4d4c6a27fe2eca51101669a00e085f45882e53f
  网络: Polygon (chain 137)
  监听事件: Listed | Purchased | Cancelled
  等待链上事件...
==============================================
[2025/5/22 10:30:15] 📋 上架 Listed | NFT合约: 0x1234...abcd | TokenID: 1 | 卖家: 0xc7a2...a55d | 价格: 1000000000000000000 | Tx: 0x...
[2025/5/22 10:35:22] 💰 购买 Purchased | NFT合约: 0x1234...abcd | TokenID: 1 | 买家: 0xabcd...1234 | 价格: 1000000000000000000 | 方式: buyNFT | Tx: 0x...
[2025/5/22 10:40:08] ❌ 取消上架 Cancelled | NFT合约: 0x1234...abcd | TokenID: 2 | 卖家: 0xc7a2...a55d | Tx: 0x...
```
