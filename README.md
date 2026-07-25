# FlowGate XCN v2

FlowGate XCN is a static, non-custodial guide for purchasing XCN and moving it
to the Onyx network.

## Why v2 exists

The original page attempted to route a card payment directly to native XCN on
Onyx. That route returned `No quotes available`.

This version removes that dead route and provides two realistic paths:

### Card route

1. Buy USDC on Ethereum using thirdweb's Bridge Widget and an available card
   provider.
2. Use the official Onyx Swap on Ethereum to exchange USDC for XCN.
3. Use the official Onyx Bridge to move XCN from Ethereum to Onyx.

### Direct exchange route

1. Buy XCN directly on Coinbase using an approved payment method.
2. Withdraw XCN to a self-custody Ethereum wallet.
3. Use the official Onyx Bridge to move XCN onto Onyx.

Coinbase's published XCN page states that credit cards cannot currently be used
to buy XCN directly. Its listed methods include bank account, debit card, wire,
and region-dependent PayPal.

## Verified configuration

- Onyx chain ID: `327`
- Native Onyx asset: `XCN`
- Ethereum XCN contract:
  `0xA2cd3D43c775978A96BdBf12d733D5A1ED94fb18`
- Ethereum USDC contract:
  `0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`
- Official Onyx Swap: `https://app.onyx.org/en/swap`
- Official Onyx Bridge: `https://app.onyx.org/en/bridge`

## Deploy the update

Replace the existing repository files with:

- `index.html`
- `styles.css`
- `app.js`
- `README.md`
- `vercel.json`

Commit the update. Vercel should redeploy automatically.

Suggested commit message:

```text
Fix XCN purchase route
```

## Important

- The project never stores card details.
- It does not custody user funds.
- Card availability, fees, KYC, limits, and supported regions are controlled by
  the selected on-ramp provider.
- Credit-card acceptance depends on the provider and issuer.
- Users should test with a small amount first.
