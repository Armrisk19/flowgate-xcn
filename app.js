const status = document.getElementById("widgetStatus");
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
}

window.addEventListener("message", (event) => {
  if (
    event.origin !== "https://thirdweb.com" ||
    !event.data ||
    event.data.source !== "buy-widget"
  ) {
    return;
  }

  if (event.data.type === "success") {
    status.textContent = "Purchase complete";
    showToast("Purchase completed. Check your wallet and the Onyx Explorer.");
  }

  if (event.data.type === "error") {
    status.textContent = "Checkout issue";
    showToast(
      event.data.message ||
        "The provider could not complete the purchase. Review the checkout details and try again."
    );
  }

  if (event.data.type === "cancel") {
    status.textContent = "Ready";
    showToast("Checkout canceled. No purchase was submitted.");
  }
});
