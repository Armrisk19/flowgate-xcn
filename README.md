# FlowGate XCN v5 — Clear Purchase & Privacy Mode

This release adds lawful, disclosed monetization architecture without secretly
inflating crypto prices or taking custody of customer money.

## What is immediately built

- Card and crypto route interface
- XCN and Onyx guidance
- Public fee schedule and legal disclosure pages
- FlowGate Plus checkout priced at 9.99 USDC on Base
- FlowGate Plus fee estimator and local receipt tools
- White-label pricing and inquiry workflow
- Affiliate/partner link slots
- Revenue status display
- Fallback widgets so the site still functions before a thirdweb client ID is added

## Revenue wallet

`config.js` currently uses this previously designated EVM project receiving
wallet:

`0x2112CcdBe033577A86189DD8d8ccC325F9F746ab`

VERIFY THAT YOU CONTROL THIS ADDRESS BEFORE DEPLOYING. Change it in `config.js`
if FlowGate should use a different treasury wallet.

## Activate swap revenue

thirdweb's official documentation says a developer fee can be configured on
crypto-to-crypto swaps.

1. Create a thirdweb project.
2. Copy the public client ID.
3. Paste it into `config.js` as `thirdwebClientId`.
4. In thirdweb, open:
   `Project > Project Settings > Payments > Configure > Settings`
5. Set the developer fee to `1.25%`.
6. Ensure the fee recipient is the FlowGate revenue wallet.
7. Redeploy.

The public fee disclosure and dashboard setting must match.

## Activate card/on-ramp revenue

The generic thirdweb on-ramp does not pay FlowGate a fee. To earn on card
purchases:

1. Register the business and prepare legal/KYB information.
2. Apply to MoonPay or Transak as a partner.
3. Complete KYB and provider review.
4. Agree to commercial terms.
5. Configure the provider-supported partner fee.
6. Replace or configure the card widget using the approved production API key.
7. Set `onrampPartnerFeeActive: true` only after the fee is contractually active.

The site displays a planned 1.50% partner fee. Do not charge or advertise it as
active before provider approval.

## Activate affiliate revenue

Apply to Coinbase or another approved affiliate program and paste the tracked
URL into `config.js`.

Never label an ordinary untracked link as an affiliate link.

## FlowGate Plus

The website sells a separate digital toolkit for `9.99 USDC` on Base. The
checkout is configured to pay the revenue wallet in `config.js`.

The toolkit does not sell crypto. It unlocks:

- Fee estimator
- Local receipt storage
- CSV exports
- Transaction planning tools

Unlocking is stored in the buyer's browser. This is sufficient for a starter,
but a production version should verify payment through a backend webhook and
bind access to an account or wallet.

## White-label sales

Prices displayed:

- Starter: $499
- Pro: $999
- Network: $2,499

Add a real `supportEmail` in `config.js` before accepting orders. Use a written
scope, delivery agreement, refund policy, and payment schedule for every custom
sale.

## Important legal structure

Do not:

- Secretly inflate the displayed market price
- Claim FlowGate is executing at one price while keeping an undisclosed spread
- Receive customer dollars and personally deliver crypto
- Hold card details, private keys, or seed phrases
- Turn on fees that are not supported by the provider contract
- Claim guaranteed returns or guaranteed delivery

Keep FlowGate non-custodial:

- The provider handles card processing, KYC, pricing, and crypto delivery
- The customer receives crypto directly
- FlowGate receives a separate disclosed fee or partner commission
- Final provider quotes show the amount paid and expected amount received

Federal and state money-transmission, consumer-protection, tax, and privacy
requirements depend on how the service operates. Have a qualified lawyer review
the final business before broad launch.

## Deploy

Replace the existing repository contents with all files in this folder and
commit:

`Launch transparent FlowGate revenue edition`

Vercel should redeploy automatically.


## v4 master attribution changes

- Adds a persistent owner campaign record
- Decorates approved tracked URLs with FlowGate campaign parameters
- Makes every hosted copy use the operator project configuration
- Replaces unrestricted white-label source-code sales with setup + monthly hosted licenses
- Adds a Hosted License Framework page
- Adds a master attribution dashboard section
- Explicitly states that no provider can guarantee commissions forever

Read `MASTER_ATTRIBUTION_SETUP.md` before launch.


## v5 changes

- Separates genuine digital-product purchases from crypto purchases
- Adds accurate merchant-description guidance
- Adds website privacy mode
- Adds local receipt and preference deletion
- Makes clear that provider, bank, and blockchain records remain visible
- Does not misclassify crypto transactions

Read `PURCHASE_AND_PRIVACY_SETUP.md`.
