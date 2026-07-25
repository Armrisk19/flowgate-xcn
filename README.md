# FlowGate XCN

A lightweight, mobile-friendly page that embeds thirdweb's Buy Widget with
native XCN on the Onyx network selected.

## What it does

- Sets the destination network to Onyx (chain ID `327`)
- Sets the output asset to the network's native token, XCN
- Shows card checkout only
- Sends purchased XCN to the wallet connected inside the checkout
- Does not store card details or custody user funds

## Deploy with GitHub and Vercel

1. Create a new GitHub repository named `flowgate-xcn`.
2. Upload `index.html`, `styles.css`, `app.js`, and `vercel.json`.
3. Open Vercel and import the GitHub repository.
4. Leave the framework preset as `Other`.
5. Deploy.

No environment variables, build command, package manager, or custom smart
contract are required for this first version.

## Test carefully

Before paying:

- Confirm the checkout shows `Onyx` as the destination network.
- Confirm the receiving asset is native `XCN`.
- Use a wallet you control.
- Start with a small amount.
- Review the provider's rate, fee, identity requirements, and final amount.
- Confirm the transaction in the Onyx Explorer.

## Important limitations

The actual card providers, fees, minimum purchase, geographic availability,
supported cards, and identity-verification requirements are controlled by the
on-ramp provider. A bank or card issuer may also decline crypto purchases.

## Technical configuration

The embedded widget currently uses:

```text
https://thirdweb.com/bridge/buy-widget
  ?chain=327
  &paymentMethods=card
  &tokenEditable=false
  &theme=dark
  &currency=USD
```

The site listens only to messages from `https://thirdweb.com` for success,
error, and cancellation status.

## Disclaimer

This starter is not affiliated with Onyx DAO or thirdweb. It is not investment
advice. Review all purchase information before confirming.
