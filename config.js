window.FLOWGATE_CONFIG = Object.freeze({
  // MASTER OPERATOR ATTRIBUTION
  // All hosted FlowGate copies should use this one owner-controlled project.
  // Create the project at https://thirdweb.com/dashboard and paste its public client ID.
  // Then set the developer fee under Project > Payments > Settings.
  thirdwebClientId: "",

  ownerCampaignId: "flowcontrol-flowgate",
  ownerReferralCode: "flowcontrol",
  attributionStorageDays: 365,
  masterAttributionEnabled: true,

  // Previously designated EVM receiving wallet. Verify ownership before deployment.
  revenueWallet: "0x2112CcdBe033577A86189DD8d8ccC325F9F746ab",

  // This number is a PUBLIC disclosure. Match it exactly to the thirdweb dashboard setting.
  swapDeveloperFeePercent: 1.25,

  // Only charge this after MoonPay/Transak or another approved partner enables it contractually.
  plannedOnrampPartnerFeePercent: 1.50,
  onrampPartnerFeeActive: false,

  // Separate digital-service purchase, paid in Base USDC.
  plusPriceUsdc: 9.99,

  // Genuine digital-product checkout settings.
  // The payment processor controls the final bank-statement descriptor and MCC.
  digitalProductName: "FlowGate Plus",
  preferredStatementDescriptor: "FLOWGATE DIGITAL",

  // Privacy mode changes only the website display and local browser storage.
  privacyModeDefault: false,
  clearLocalDataOnExit: false,

  // Paste ONLY approved, tracked URLs or partner credentials after acceptance.
  // These values are the master owner attribution for every hosted FlowGate copy.
  coinbaseAffiliateUrl: "",
  transakPartnerUrl: "",
  moonpayPartnerUrl: "",

  // Public identifiers may be used in the browser only when the provider permits it.
  // Keep secret keys and signed-widget generation on a backend.
  transakPublicApiKey: "",
  moonpayPublicApiKey: "",

  // Add a real support address before selling licenses or launching publicly.
  supportEmail: "",

  // Hosted licensing: buyers do not receive unrestricted source code.
  // They pay setup plus a recurring platform license while your master
  // transaction attribution remains attached and clearly disclosed.
  licensePrices: {
    starterSetup: 299,
    starterMonthly: 49,
    proSetup: 799,
    proMonthly: 99,
    networkSetup: 1999,
    networkMonthly: 249
  },

  // Optional master platform share for custom hosted copies.
  // This must match the provider dashboard and customer-facing disclosure.
  hostedCopyMasterSwapFeePercent: 1.25
});
