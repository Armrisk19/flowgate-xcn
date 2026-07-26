# FLOWGATE MASTER ATTRIBUTION & RECURRING REVENUE SETUP

## What this release can do

FlowGate v4 centralizes every eligible revenue route under the operator:

1. **Crypto swaps**
   - Every hosted copy uses the same owner-controlled thirdweb project.
   - The project's disclosed developer fee applies to eligible completed swaps.
   - The fee continues only while the project, integration, and provider terms remain active.

2. **Card / bank on-ramp purchases**
   - Every hosted copy must use the owner’s approved MoonPay or Transak partner integration.
   - The partner fee is configured in the provider dashboard.
   - Generic untracked card widgets do not generate operator revenue.

3. **Exchange referrals**
   - All exchange buttons use the owner’s approved tracked link.
   - Coinbase's standard affiliate offer currently pays 50% of referred trading fees for the first three months, not forever.

4. **Hosted branded portals**
   - Customers buy setup and a monthly hosted license.
   - They do not receive unrestricted source code.
   - The master FlowGate project, attribution, and visible branding remain attached under the written agreement.

## Critical truth

No technical code can force a provider to pay commissions forever.

Revenue can stop if:

- The affiliate tracking window expires
- The partner agreement ends
- The provider changes its program
- The user is ineligible
- A transaction is refunded, reversed, fraudulent, or excluded
- The operator account is suspended
- The hosted customer cancels
- The website is copied or modified outside the hosted system

## Activation order

### 1. thirdweb swap revenue

- Create one owner-controlled thirdweb project
- Paste its public client ID into `config.js`
- Set the disclosed developer fee in the thirdweb dashboard
- Set the correct receiving wallet
- Use this same project in every hosted copy
- Test with a small swap

### 2. Transak partner revenue

- Create a partner dashboard account
- Complete KYB and production review
- Configure the approved partner fee in the Products section
- Configure USDC or USDT payout details
- Use the partner API key and approved domain
- Generate secure widget URLs from a backend where required
- Add transaction webhooks and `partnerOrderId` reconciliation

Transak currently documents partner fees up to 5%, but a lower disclosed fee is generally easier for users to accept.

### 3. MoonPay partner revenue

- Complete MoonPay partner onboarding and KYB
- Configure the fee in the Partner Dashboard
- Use the owner partner integration in every hosted copy
- Confirm payout and refund terms in writing

### 4. Coinbase affiliate revenue

- Apply through Coinbase/Impact
- Paste the approved tracked link into `config.js`
- Keep the affiliate disclosure visible
- Do not call it lifetime revenue

### 5. Hosted licensing

- Add a support email
- Register the operating business
- Use a written hosted-service agreement
- Bill setup plus monthly subscription
- Keep the core project and provider credentials under the operator account
- Do not hand out secret keys or unrestricted production source code

## Recommended starting prices

- Starter Hosted: $299 setup + $49/month
- Pro Hosted: $799 setup + $99/month
- Network Hosted: $1,999 setup + $249/month

These are business choices, not guaranteed market values.

## Required disclosure

Use language similar to:

> FlowGate may receive a disclosed developer fee, partner fee, affiliate commission, or hosted-platform payment. Provider and network fees may also apply. Final amounts and estimated crypto received are shown before confirmation. Partner and affiliate programs can change or end.

## Files to configure

- `config.js`
- `terms.html`
- `fees.html`
- `privacy.html`
- `refund.html`
- `risk.html`
- `hosted-license.html`

Have a qualified lawyer review the final operating model before scaling.
