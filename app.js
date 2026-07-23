const API_URL =
  "https://script.google.com/macros/s/AKfycbzWvfXVDh6y2ttNc3ySkVcymqEfgmsI7K-wwGY4ve_m_y78HfVIi55k7kyzllgGVnB4/exec";


let currentPassword = "";
let passwordVisible = false;
let deferredPrompt = null;


// =====================================
// SEARCH DELIMA
// =====================================

async function cariDelima() {

  const nokp =
    document
      .getElementById("nokp")
      .value
      .replace(/\D/g, "");

  const pin =
    document
      .getElementById("pin")
      .value
      .replace(/\D/g, "");


  const result =
    document.getElementById("result");

  const loading =
    document.getElementById("loading");

  const message =
    document.getElementById("message");

  const button =
    document.getElementById("btnCari");


  result.classList.add("hidden");

  message.innerHTML = "";


  // IC VALIDATION

  if (nokp.length !== 12) {

    showError(
      "Sila masukkan 12 digit No. KP / MyKid."
    );

    return;
  }


  // PIN VALIDATION

  if (pin.length !== 4) {

    showError(
      "Sila masukkan 4 digit PIN penjaga."
    );

    return;
  }


  loading.classList.remove("hidden");

  button.disabled = true;


  try {

    const url =
      API_URL +
      "?action=search" +
      "&nokp=" +
      encodeURIComponent(nokp) +
      "&pin=" +
      encodeURIComponent(pin) +
      "&t=" +
      Date.now();


    const response =
      await fetch(url, {
        method: "GET",
        cache: "no-store"
      });


    if (!response.ok) {

      throw new Error(
        "HTTP " + response.status
      );

    }


    const data =
      await response.json();


    loading.classList.add("hidden");

    button.disabled = false;


    // FAILED

    if (!data.success) {

      showError(
        data.message ||
        "Maklumat tidak sepadan atau akaun tidak dijumpai."
      );

      return;
    }


    // SUCCESS

    document
      .getElementById("nama")
      .textContent =
      data.nama || "-";


    document
      .getElementById("kelas")
      .textContent =
      data.kelas || "-";


    document
      .getElementById("delima")
      .textContent =
      data.delima || "-";


    currentPassword =
      data.password || "";


    passwordVisible = false;


    document
      .getElementById("password")
      .textContent =
      "••••••••";


    result.classList.remove("hidden");


    // Padam PIN selepas berjaya

    document
      .getElementById("pin")
      .value = "";


    result.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });


  } catch (error) {

    console.error(
      "DELIMa API Error:",
      error
    );


    loading.classList.add("hidden");

    button.disabled = false;


    showError(
      "Tidak dapat menghubungi sistem. Sila cuba lagi."
    );

  }

}


// =====================================
// ERROR
// =====================================

function showError(text) {

  document
    .getElementById("message")
    .innerHTML =
    '<div class="error">' +
    escapeHTML(text) +
    '</div>';

}


// =====================================
// PASSWORD
// =====================================

function togglePassword() {

  const password =
    document.getElementById("password");


  passwordVisible =
    !passwordVisible;


  password.textContent =
    passwordVisible
      ? (currentPassword || "-")
      : "••••••••";

}


// =====================================
// PIN SHOW / HIDE
// =====================================

function togglePin() {

  const pin =
    document.getElementById("pin");


  if (pin.type === "password") {

    pin.type = "text";

  } else {

    pin.type = "password";

  }

}


// =====================================
// COPY DELIMA
// =====================================

async function copyDelima() {

  const text =
    document
      .getElementById("delima")
      .textContent;


  await copyToClipboard(
    text,
    "ID DELIMa telah disalin."
  );

}


// =====================================
// COPY PASSWORD
// =====================================

async function copyPassword() {

  if (!currentPassword) {
    return;
  }


  await copyToClipboard(
    currentPassword,
    "Kata laluan telah disalin."
  );

}


// =====================================
// COPY
// =====================================

async function copyToClipboard(
  text,
  successMessage
) {

  try {

    await navigator.clipboard
      .writeText(text);

    showToast(successMessage);

  } catch (error) {

    console.error(error);

    showToast(
      "Tidak dapat menyalin."
    );

  }

}


// =====================================
// SIMPLE TOAST
// =====================================

function showToast(text) {

  const old =
    document.getElementById("toast");


  if (old) {
    old.remove();
  }


  const toast =
    document.createElement("div");


  toast.id = "toast";

  toast.textContent = text;


  Object.assign(
    toast.style,
    {
      position: "fixed",
      left: "50%",
      bottom: "25px",
      transform: "translateX(-50%)",
      background: "#101828",
      color: "#ffffff",
      padding: "12px 18px",
      borderRadius: "10px",
      zIndex: "9999",
      fontSize: "14px",
      boxShadow:
        "0 8px 30px rgba(0,0,0,.2)"
    }
  );


  document.body.appendChild(toast);


  setTimeout(
    () => toast.remove(),
    2200
  );

}


// =====================================
// NEW SEARCH
// =====================================

function resetSearch() {

  document
    .getElementById("nokp")
    .value = "";


  document
    .getElementById("pin")
    .value = "";


  document
    .getElementById("result")
    .classList.add("hidden");


  document
    .getElementById("message")
    .innerHTML = "";


  currentPassword = "";

  passwordVisible = false;


  document
    .getElementById("nokp")
    .focus();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// =====================================
// TUTORIAL / HELP
// =====================================

function toggleSection(id) {

  const tutorial =
    document.getElementById("tutorial");

  const help =
    document.getElementById("help");

  const target =
    document.getElementById(id);


  if (id === "tutorial") {

    help.classList.add("hidden");

  } else {

    tutorial.classList.add("hidden");

  }


  target.classList.toggle("hidden");


  if (!target.classList.contains("hidden")) {

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

}


// =====================================
// ENTER KEY
// =====================================

document
  .getElementById("nokp")
  .addEventListener(
    "keydown",
    function(event) {

      if (event.key === "Enter") {

        document
          .getElementById("pin")
          .focus();

      }

    }
  );


document
  .getElementById("pin")
  .addEventListener(
    "keydown",
    function(event) {

      if (event.key === "Enter") {

        cariDelima();

      }

    }
  );


// =====================================
// ONLY NUMBERS
// =====================================

document
  .getElementById("nokp")
  .addEventListener(
    "input",
    function() {

      this.value =
        this.value
          .replace(/\D/g, "")
          .slice(0, 12);

    }
  );


document
  .getElementById("pin")
  .addEventListener(
    "input",
    function() {

      this.value =
        this.value
          .replace(/\D/g, "")
          .slice(0, 4);

    }
  );


// =====================================
// PWA INSTALL
// =====================================

const installCard =
  document.getElementById("installCard");

const installBtn =
  document.getElementById("installBtn");


window.addEventListener(
  "beforeinstallprompt",
  event => {

    event.preventDefault();

    deferredPrompt = event;

    installCard
      .classList
      .remove("hidden");

  }
);


installBtn.addEventListener(
  "click",
  async () => {

    // iPhone instructions

    if (
      isIOS() &&
      !deferredPrompt
    ) {

      alert(
        "Untuk memasang Portal DELIMa di iPhone:\n\n" +
        "1. Buka portal menggunakan Safari.\n" +
        "2. Tekan butang Share.\n" +
        "3. Pilih Add to Home Screen.\n" +
        "4. Tekan Add."
      );

      return;
    }


    if (!deferredPrompt) {
      return;
    }


    deferredPrompt.prompt();


    await deferredPrompt.userChoice;


    deferredPrompt = null;


    installCard
      .classList
      .add("hidden");

  }
);


window.addEventListener(
  "appinstalled",
  () => {

    deferredPrompt = null;

    installCard
      .classList
      .add("hidden");

  }
);


// =====================================
// IOS
// =====================================

function isIOS() {

  return /iphone|ipad|ipod/i
    .test(
      navigator.userAgent
    );

}


function isStandalone() {

  return (
    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||
    navigator.standalone === true
  );

}


if (
  isIOS() &&
  !isStandalone()
) {

  installCard
    .classList
    .remove("hidden");


  installBtn.textContent =
    "Cara Install";

}


// =====================================
// SECURITY
// =====================================

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent =
    String(text);

  return div.innerHTML;

}
