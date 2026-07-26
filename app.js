(() => {
  const cfg = window.FLOWGATE_CONFIG || {};
  const XCN_ETH = "0xA2cd3D43c775978A96BdBf12d733D5A1ED94fb18";
  const USDC_ETH = "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const USDC_BASE = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
  const toast = document.getElementById("toast");
  let toastTimer;

  const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
  const pct = (value) => `${Number(value || 0).toFixed(2)}%`;

  const ATTRIBUTION_KEY = "flowgate-owner-attribution";

  function attributionRecord() {
    const params = new URLSearchParams(window.location.search);
    const incoming = params.get("fg_ref") || params.get("ref") || cfg.ownerReferralCode || "flowcontrol";
    const existing = (() => {
      try { return JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "null"); }
      catch { return null; }
    })();

    const now = Date.now();
    const maxAge = Number(cfg.attributionStorageDays || 365) * 86400000;
    const validExisting = existing && existing.createdAt && (now - existing.createdAt) < maxAge;

    const record = validExisting ? existing : {
      ownerReferralCode: incoming,
      ownerCampaignId: cfg.ownerCampaignId || "flowcontrol-flowgate",
      createdAt: now,
      landingPage: window.location.href,
      source: params.get("utm_source") || "direct"
    };

    // The operator remains the master attribution for hosted copies.
    record.operatorReferralCode = cfg.ownerReferralCode || "flowcontrol";
    record.operatorCampaignId = cfg.ownerCampaignId || "flowcontrol-flowgate";
    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(record));
    return record;
  }

  function addAttribution(url, extra = {}) {
    if (!url) return "";
    try {
      const record = attributionRecord();
      const parsed = new URL(url, window.location.origin);
      parsed.searchParams.set("utm_source", "flowgate");
      parsed.searchParams.set("utm_medium", "hosted_portal");
      parsed.searchParams.set("utm_campaign", record.operatorCampaignId);
      parsed.searchParams.set("fg_ref", record.operatorReferralCode);
      Object.entries(extra).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") parsed.searchParams.set(key, String(value));
      });
      return parsed.toString();
    } catch {
      return url;
    }
  }

  function initializeAttribution() {
    const record = attributionRecord();
    const campaign = document.getElementById("ownerCampaignDisplay");
    const browser = document.getElementById("browserAttributionDisplay");
    const provider = document.getElementById("providerAttributionDisplay");
    const status = document.getElementById("attributionStatus");

    if (campaign) campaign.textContent = record.operatorCampaignId;
    if (browser) browser.textContent = `${Number(cfg.attributionStorageDays || 365)}-day local record`;
    const providerReady = Boolean(
      cfg.thirdwebClientId ||
      cfg.coinbaseAffiliateUrl ||
      cfg.transakPartnerUrl ||
      cfg.moonpayPartnerUrl ||
      cfg.transakPublicApiKey ||
      cfg.moonpayPublicApiKey
    );
    if (provider) provider.textContent = providerReady ? "At least one route connected" : "Credentials required";
    if (status) {
      status.textContent = providerReady ? "Master attribution connected" : "Owner routing configured; credentials needed";
      if (providerReady) status.classList.add("active-state");
    }

    document.querySelectorAll("a[data-attribution-link]").forEach(link => {
      link.href = addAttribution(link.href);
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4300);
  }

  function applyConfig() {
    document.querySelectorAll("[data-swap-fee]").forEach(el => el.textContent = pct(cfg.swapDeveloperFeePercent));
    document.querySelectorAll("[data-partner-fee]").forEach(el => el.textContent = pct(cfg.plannedOnrampPartnerFeePercent));
    document.querySelectorAll("[data-plus-price]").forEach(el => el.textContent = Number(cfg.plusPriceUsdc || 9.99).toFixed(2));

    Object.entries(cfg.licensePrices || {}).forEach(([key, value]) => {
      document.querySelectorAll(`[data-license="${key}"]`).forEach(el => {
        el.textContent = Number(value).toLocaleString("en-US");
      });
    });

    const cardFee = document.getElementById("cardFeeState");
    if (cardFee) {
      cardFee.textContent = cfg.onrampPartnerFeeActive
        ? `${pct(cfg.plannedOnrampPartnerFeePercent)} disclosed partner fee`
        : "0% — partner approval pending";
    }

    const swapState = document.getElementById("swapRevenueState");
    const partnerState = document.getElementById("partnerRevenueState");
    const affiliateState = document.getElementById("affiliateRevenueState");
    const revenueStatus = document.getElementById("revenueStatus");

    const swapActive = Boolean(cfg.thirdwebClientId);
    const partnerActive = Boolean(cfg.onrampPartnerFeeActive);
    const affiliateActive = Boolean(cfg.coinbaseAffiliateUrl || cfg.transakPartnerUrl || cfg.moonpayPartnerUrl);

    if (swapActive && swapState) {
      swapState.textContent = "Client ID connected";
      swapState.classList.add("active-state");
    }
    if (partnerActive && partnerState) {
      partnerState.textContent = "Partner fee active";
      partnerState.classList.add("active-state");
    }
    if (affiliateActive && affiliateState) {
      affiliateState.textContent = "Tracked links active";
      affiliateState.classList.add("active-state");
    }
    if (revenueStatus) {
      const activeCount = [swapActive, partnerActive, affiliateActive, Boolean(cfg.revenueWallet)].filter(Boolean).length;
      revenueStatus.textContent = activeCount >= 3 ? "Revenue stack active" : `${activeCount}/4 revenue items configured`;
      if (activeCount >= 3) revenueStatus.classList.add("active-state");
    }

    const affiliateLinks = [
      ["coinbaseLink", cfg.coinbaseAffiliateUrl],
      ["moonpayLink", cfg.moonpayPartnerUrl],
      ["transakLink", cfg.transakPartnerUrl]
    ];
    affiliateLinks.forEach(([id, href]) => {
      const el = document.getElementById(id);
      if (el && href) {
        el.href = addAttribution(href, { campaign: cfg.ownerCampaignId });
        el.dataset.attributionLink = "true";
      }
    });

    const plusCheckout = document.getElementById("plusCheckout");
    if (plusCheckout && cfg.revenueWallet) {
      const params = new URLSearchParams({
        chain: "8453",
        tokenAddress: USDC_BASE,
        amount: String(cfg.plusPriceUsdc || 9.99),
        seller: cfg.revenueWallet,
        currency: "USD",
        theme: "dark",
        paymentMethods: "crypto,card",
        title: cfg.digitalProductName || "FlowGate Plus",
        description: "Purchase of a digital transaction-planning software toolkit. No cryptocurrency is included.",
        showThirdwebBranding: "true"
      });
      plusCheckout.src = `https://thirdweb.com/bridge/checkout-widget?${params.toString()}`;
    }
  }

  function renderFallback(container, mode) {
    if (!container) return;
    const params = new URLSearchParams({
      theme: "dark",
      currency: "USD",
      persistTokenSelections: "false",
      showThirdwebBranding: "true"
    });

    if (mode === "buy") {
      params.set("outputCurrency", USDC_ETH);
      params.set("outputChain", "1");
    } else {
      params.set("inputCurrency", USDC_ETH);
      params.set("inputChain", "1");
      params.set("outputCurrency", XCN_ETH);
      params.set("outputChain", "1");
    }

    container.innerHTML = `<iframe title="${mode === "buy" ? "Buy crypto" : "Swap crypto"}" src="https://thirdweb.com/bridge/widget?${params.toString()}" height="760" width="100%" allow="payment; clipboard-write; publickey-credentials-get" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  }

  function initializeWidgets() {
    const buyContainer = document.getElementById("buyWidgetContainer");
    const swapContainer = document.getElementById("swapWidgetContainer");

    if (!cfg.thirdwebClientId || typeof window.BridgeWidget === "undefined") {
      renderFallback(buyContainer, "buy");
      renderFallback(swapContainer, "swap");
      return;
    }

    buyContainer.innerHTML = "";
    swapContainer.innerHTML = "";

    try {
      window.BridgeWidget.render(buyContainer, {
        clientId: cfg.thirdwebClientId,
        theme: "dark",
        currency: "USD",
        buy: {
          chainId: 1,
          tokenAddress: USDC_ETH,
          amount: "50",
          presetOptions: [25, 50, 100],
          buttonLabel: "Buy crypto",
          onSuccess: () => showToast("Card purchase completed. Check the receiving wallet and provider receipt."),
          onError: (error) => showToast(error?.message || "The card provider could not complete the purchase."),
          onCancel: () => showToast("Purchase canceled.")
        },
        swap: { persistTokenSelections: false }
      });

      window.BridgeWidget.render(swapContainer, {
        clientId: cfg.thirdwebClientId,
        theme: "dark",
        currency: "USD",
        swap: {
          persistTokenSelections: false,
          prefill: {
            sellToken: { chainId: 1, tokenAddress: USDC_ETH },
            buyToken: { chainId: 1, tokenAddress: XCN_ETH }
          },
          onSuccess: () => showToast("Swap completed. FlowGate revenue is handled by the configured project fee."),
          onError: (error) => showToast(error?.message || "The swap route failed."),
          onCancel: () => showToast("Swap canceled.")
        },
        buy: { chainId: 1, tokenAddress: USDC_ETH }
      });
    } catch (error) {
      console.error(error);
      renderFallback(buyContainer, "buy");
      renderFallback(swapContainer, "swap");
      showToast("Project widget setup failed, so FlowGate loaded the non-revenue fallback.");
    }
  }


  const PRIVACY_KEY = "flowgate-privacy-mode";

  function setPrivacyMode(enabled) {
    document.body.classList.toggle("privacy-mode", enabled);
    localStorage.setItem(PRIVACY_KEY, enabled ? "1" : "0");

    const headerButton = document.getElementById("privacyToggle");
    const label = headerButton?.querySelector(".privacy-label-text");
    const toolButton = document.getElementById("maskScreen");

    if (headerButton) headerButton.setAttribute("aria-pressed", String(enabled));
    if (label) label.textContent = enabled ? "Privacy active" : "Privacy mode";
    if (toolButton) toolButton.textContent = enabled ? "Disable privacy mode" : "Enable privacy mode";
  }

  function setupPrivacyControls() {
    const saved = localStorage.getItem(PRIVACY_KEY);
    setPrivacyMode(saved === null ? Boolean(cfg.privacyModeDefault) : saved === "1");

    document.getElementById("privacyToggle")?.addEventListener("click", () => {
      setPrivacyMode(!document.body.classList.contains("privacy-mode"));
    });
    document.getElementById("maskScreen")?.addEventListener("click", () => {
      setPrivacyMode(!document.body.classList.contains("privacy-mode"));
    });
    document.getElementById("eraseLocalData")?.addEventListener("click", () => {
      [
        "flowgate-receipts",
        "flowgate-plus-active",
        "flowgate-privacy-mode",
        "flowgate-route",
        "flowgate-step-1",
        "flowgate-step-2",
        "flowgate-step-3"
      ].forEach(key => localStorage.removeItem(key));

      setPrivacyMode(true);
      renderReceipts();
      showToast("Local receipts and preferences erased. Bank, provider, and blockchain records are unchanged.");
    });

    if (cfg.clearLocalDataOnExit) {
      window.addEventListener("pagehide", () => localStorage.removeItem("flowgate-receipts"));
    }
  }

  function setupTabs() {
    document.querySelectorAll("[data-tab]").forEach(tab => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;
        document.querySelectorAll("[data-tab]").forEach(t => {
          const active = t === tab;
          t.classList.toggle("active", active);
          t.setAttribute("aria-selected", String(active));
        });
        document.querySelectorAll("[data-panel]").forEach(panel => {
          const active = panel.dataset.panel === target;
          panel.classList.toggle("active", active);
          panel.hidden = !active;
        });
      });
    });
  }

  function setupCopyContract() {
    document.querySelectorAll(".copy-contract").forEach(button => {
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(XCN_ETH);
          showToast("Official Ethereum XCN contract copied.");
        } catch {
          showToast(`Copy this contract: ${XCN_ETH}`);
        }
      });
    });
  }

  function unlockPlus() {
    localStorage.setItem("flowgate-plus-active", "1");
    const tools = document.getElementById("plusTools");
    if (tools) tools.classList.remove("locked");
    showToast("FlowGate Plus unlocked on this device.");
  }

  function setupCheckoutEvents() {
    window.addEventListener("message", event => {
      if (event.origin !== "https://thirdweb.com" || !event.data) return;
      if (event.data.source === "checkout-widget") {
        if (event.data.type === "success") unlockPlus();
        if (event.data.type === "error") showToast(event.data.message || "FlowGate Plus checkout failed.");
      }
    });

    if (localStorage.getItem("flowgate-plus-active") === "1") {
      document.getElementById("plusTools")?.classList.remove("locked");
    }
  }

  function calculateEstimate() {
    const amount = Math.max(0, Number(document.getElementById("estimateAmount")?.value || 0));
    const route = document.getElementById("estimateRoute")?.value || "card";
    const output = document.getElementById("estimateOutput");
    if (!output) return;

    const providerEstimateRate = route === "swap" ? 0 : 0.035;
    const partnerRate = cfg.onrampPartnerFeeActive && route !== "swap"
      ? Number(cfg.plannedOnrampPartnerFeePercent || 0) / 100
      : 0;
    const protocolRate = route === "card" ? 0 : 0.003;
    const developerRate = route === "card" ? 0 : Number(cfg.swapDeveloperFeePercent || 0) / 100;
    const provider = amount * providerEstimateRate;
    const partner = amount * partnerRate;
    const protocol = amount * protocolRate;
    const developer = amount * developerRate;
    const knownEstimate = provider + partner + protocol + developer;

    output.innerHTML = `
      <div class="estimate-row"><span>Illustrative provider fee</span><strong>${money(provider)}</strong></div>
      <div class="estimate-row"><span>FlowGate on-ramp partner fee</span><strong>${money(partner)}</strong></div>
      <div class="estimate-row"><span>thirdweb swap protocol fee</span><strong>${money(protocol)}</strong></div>
      <div class="estimate-row"><span>FlowGate swap developer fee</span><strong>${money(developer)}</strong></div>
      <div class="estimate-row"><span>Known-fee illustration</span><strong>${money(knownEstimate)}</strong></div>
      <div class="estimate-row"><span>Estimated remainder before gas/spread</span><strong>${money(Math.max(0, amount - knownEstimate))}</strong></div>
    `;
  }

  function receipts() {
    try { return JSON.parse(localStorage.getItem("flowgate-receipts") || "[]"); }
    catch { return []; }
  }

  function renderReceipts() {
    const list = document.getElementById("receiptList");
    if (!list) return;
    const items = receipts();
    list.innerHTML = items.length ? items.map(item => `
      <div class="receipt-item">
        <strong>${escapeHtml(item.amount)} ${escapeHtml(item.asset)} · ${escapeHtml(item.network)}</strong>
        <span>${escapeHtml(item.hash || "No transaction hash")}</span>
        <span>${escapeHtml(item.createdAt)}</span>
      </div>
    `).join("") : `<div class="fine-print">No receipts saved on this device.</div>`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);
  }

  function setupPlusTools() {
    ["estimateAmount", "estimateRoute"].forEach(id => {
      document.getElementById(id)?.addEventListener("input", calculateEstimate);
      document.getElementById(id)?.addEventListener("change", calculateEstimate);
    });
    calculateEstimate();
    renderReceipts();

    document.getElementById("saveReceipt")?.addEventListener("click", () => {
      const asset = document.getElementById("receiptAsset")?.value.trim();
      const amount = document.getElementById("receiptAmount")?.value.trim();
      const network = document.getElementById("receiptNetwork")?.value.trim();
      const hash = document.getElementById("receiptHash")?.value.trim();

      if (!asset || !amount || !network) {
        showToast("Add the asset, amount, and network first.");
        return;
      }

      const items = receipts();
      items.unshift({ asset, amount, network, hash, createdAt: new Date().toLocaleString("en-US") });
      localStorage.setItem("flowgate-receipts", JSON.stringify(items.slice(0, 100)));
      renderReceipts();
      showToast("Receipt saved on this device.");
    });

    document.getElementById("exportReceipts")?.addEventListener("click", () => {
      const items = receipts();
      if (!items.length) {
        showToast("There are no receipts to export.");
        return;
      }
      const rows = [["Asset","Amount","Network","Transaction Hash","Created At"], ...items.map(x => [x.asset,x.amount,x.network,x.hash,x.createdAt])];
      const csv = rows.map(row => row.map(value => `"${String(value ?? "").replaceAll('"','""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "flowgate-receipts.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function setupLicensing() {
    const dialog = document.getElementById("licenseDialog");
    const title = document.getElementById("licenseDialogTitle");
    const copy = document.getElementById("licenseDialogCopy");
    const emailButton = document.getElementById("licenseEmailButton");
    const copyButton = document.getElementById("copyLicenseRequest");
    let message = "";

    document.querySelectorAll(".license-inquiry").forEach(button => {
      button.addEventListener("click", () => {
        const tier = button.dataset.tier;
        const key = button.dataset.licenseKey;
        const setup = cfg.licensePrices?.[`${key}Setup`];
        const monthly = cfg.licensePrices?.[`${key}Monthly`];

        message =
          `I want the FlowGate ${tier} package listed at $${Number(setup || 0).toLocaleString("en-US")} setup plus ` +
          `$${Number(monthly || 0).toLocaleString("en-US")} per month. I understand this is a hosted license, ` +
          `not unrestricted source-code ownership; the disclosed Powered by FlowGate branding, operator attribution, ` +
          `and master transaction project remain attached while the service is active. Please send the scope, ` +
          `subscription terms, cancellation terms, provider responsibilities, and launch requirements.`;

        title.textContent = `Request ${tier}`;
        copy.textContent = cfg.supportEmail
          ? `Send this request to ${cfg.supportEmail}. Revenue and service continue only while the subscription and provider agreements remain active.`
          : "A support email and hosted-license agreement must be configured before FlowGate accepts orders.";

        if (cfg.supportEmail) {
          emailButton.hidden = false;
          emailButton.href =
            `mailto:${encodeURIComponent(cfg.supportEmail)}?subject=${encodeURIComponent(`FlowGate ${tier} request`)}&body=${encodeURIComponent(message)}`;
        } else {
          emailButton.hidden = true;
        }
        dialog?.showModal();
      });
    });

    document.querySelector(".dialog-close")?.addEventListener("click", () => dialog?.close());
    copyButton?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(message);
        showToast("Hosted-license request copied.");
      } catch {
        showToast(message);
      }
    });

    if (cfg.supportEmail) {
      const note = document.getElementById("licenseNote");
      if (note) note.textContent = `Hosted FlowGate inquiries: ${cfg.supportEmail}`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    initializeAttribution();
    setupPrivacyControls();
    setupTabs();
    setupCopyContract();
    setupCheckoutEvents();
    setupPlusTools();
    setupLicensing();

    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (typeof window.BridgeWidget !== "undefined" || attempts >= 25) {
        clearInterval(timer);
        initializeWidgets();
      }
    }, 200);
  });
})();
