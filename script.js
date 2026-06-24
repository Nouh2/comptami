const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("[data-demo-form]");
const statusText = document.querySelector("[data-form-status]");
const slots = Array.from(document.querySelectorAll("[data-slot]"));
const submitButton = document.querySelector(".form-submit");

let selectedSlot = "Matin";

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Ouvrir le menu");
    }
  });
}

slots.forEach((slot) => {
  slot.addEventListener("click", () => {
    selectedSlot = slot.dataset.slot || selectedSlot;
    slots.forEach((item) => item.classList.toggle("active", item === slot));
  });
});

if (form && statusText) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const profile = String(formData.get("profile") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = `Demande de démonstration MonComptami - ${company}`;
    const body = [
      "Bonjour,",
      "",
      "Je souhaite réserver une démonstration de MonComptami.",
      "",
      `Nom : ${name}`,
      `Email : ${email}`,
      `Entreprise : ${company}`,
      `Profil : ${profile}`,
      `Créneau préféré : ${selectedSlot}`,
      "",
      "Priorité à automatiser :",
      message || "Non précisée",
      "",
      "Merci.",
    ].join("\n");

    const mailto = new URL("mailto:contact@moncomptami.fr");
    mailto.searchParams.set("subject", subject);
    mailto.searchParams.set("body", body);

    form.classList.remove("is-sending");
    void form.offsetWidth;
    form.classList.add("is-sending");

    if (submitButton) {
      submitButton.disabled = true;
    }

    statusText.textContent = "";

    window.setTimeout(() => {
      window.location.href = mailto.toString();

      window.setTimeout(() => {
        form.classList.remove("is-sending");
        if (submitButton) {
          submitButton.disabled = false;
        }
      }, 700);
    }, 620);
  });
}
