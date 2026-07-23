const API_URL =
"https://script.google.com/macros/s/AKfycbzWvfXVDh6y2ttNc3ySkVcymqEfgmsI7K-wwGY4ve_m_y78HfVIi55k7kyzllgGVnB4/exec";

let currentPassword = "";
let passwordVisible = false;

async function cariDelima() {

  const nokp =
    document.getElementById("nokp")
      .value
      .replace(/\D/g, "");

  const pin =
    document.getElementById("pin")
      .value
      .replace(/\D/g, "");

  const result =
    document.getElementById("result");

  const loading =
    document.getElementById("loading");

  const message =
    document.getElementById("message");


  result.classList.add("hidden");
  message.innerHTML = "";


  // ============================
  // VALIDATE MYKID
  // ============================

  if (nokp.length !== 12) {

    message.innerHTML =
      '<div class="error">' +
      'Sila masukkan 12 digit No. KP / MyKid.' +
      '</div>';

    return;
  }


  // ============================
  // VALIDATE PIN
  // ============================

  if (pin.length !== 4) {

    message.innerHTML =
      '<div class="error">' +
      'Sila masukkan 4 digit PIN penjaga.' +
      '</div>';

    return;
  }


  loading.classList.remove("hidden");


  try {

    const url =
      API_URL +
      "?action=search" +
      "&nokp=" +
      encodeURIComponent(nokp) +
      "&pin=" +
      encodeURIComponent(pin);


    const response =
      await fetch(url);


    if (!response.ok) {
      throw new Error("Server error");
    }


    const data =
      await response.json();


    loading.classList.add("hidden");


    if (!data.success) {

      message.innerHTML =
        '<div class="error">' +
        'Maklumat tidak sepadan atau akaun tidak dijumpai.' +
        '</div>';

      return;
    }


    document.getElementById("nama")
      .textContent =
      data.nama || "-";


    document.getElementById("kelas")
      .textContent =
      data.kelas || "-";


    document.getElementById("delima")
      .textContent =
      data.delima || "-";


    currentPassword =
      data.password || "";


    document.getElementById("password")
      .textContent =
      "••••••••";


    passwordVisible = false;


    result.classList.remove("hidden");


  } catch (error) {

    loading.classList.add("hidden");

    message.innerHTML =
      '<div class="error">' +
      'Tidak dapat menghubungi sistem. Sila cuba lagi.' +
      '</div>';

    console.error(error);
  }
}


 
