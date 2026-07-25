const routeTabs = document.querySelectorAll("[data-route]");
const routePanels = document.querySelectorAll("[data-panel]");
const completeButtons = document.querySelectorAll("[data-complete]");
const resetButton = document.getElementById("resetProgress");
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
}

function setRoute(route) {
  routeTabs.forEach((tab) => {
    const active = tab.dataset.route === route;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  routePanels.forEach((panel) => {
    const active = panel.dataset.panel === route;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });

  localStorage.setItem("flowgate-route", route);
}

routeTabs.forEach((tab) => {
  tab.addEventListener("click", () => setRoute(tab.dataset.route));
});

const savedRoute = localStorage.getItem("flowgate-route");
if (savedRoute === "direct" || savedRoute === "card") {
  setRoute(savedRoute);
}

function setStep(step, complete) {
  const card = document.querySelector(`[data-step="${step}"]`);
  const button = document.querySelector(`[data-complete="${step}"]`);
  if (!card || !button) return;

  card.classList.toggle("done", complete);
  button.textContent = complete ? "Completed ✓" : "Mark complete";
  button.setAttribute("aria-pressed", String(complete));
  localStorage.setItem(`flowgate-step-${step}`, complete ? "1" : "0");
}

completeButtons.forEach((button) => {
  const step = button.dataset.complete;
  const complete = localStorage.getItem(`flowgate-step-${step}`) === "1";
  setStep(step, complete);

  button.addEventListener("click", () => {
    const isDone = button.closest(".step-card").classList.contains("done");
    setStep(step, !isDone);
    showToast(!isDone ? `Step ${step} marked complete.` : `Step ${step} reopened.`);
  });
});

resetButton.addEventListener("click", () => {
  ["1", "2", "3"].forEach((step) => setStep(step, false));
  showToast("Checklist reset.");
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const source = document.getElementById(button.dataset.copy);
    if (!source) return;

    try {
      await navigator.clipboard.writeText(source.textContent.trim());
      button.textContent = "Copied ✓";
      showToast("Official Ethereum XCN contract copied.");
      setTimeout(() => {
        button.textContent = "Copy contract";
      }, 2200);
    } catch {
      showToast("Copy failed. Press and hold the contract address to copy it.");
    }
  });
});
