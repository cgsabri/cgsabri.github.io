const API_URL =
"https://script.google.com/macros/s/AKfycbxE5cLmLhvnOwVnMH14ApD3bGMH3So1NYhwyWqU5OF9uLg7KEbyDZyhpcmny0h-rqXP/exec";

let currentPassword = "";
let passwordVisible = false;


async function cariDelima(){

const nokp =
document.getElementById("nokp").value
.replace(/\D/g,"");

const result =
document.getElementById("result");

const loading =
document.getElementById("loading");

const message =
document.getElementById("message");


result.classList.add("hidden");
message.innerHTML = "";


if(nokp.length !== 12){

message.innerHTML =
'<div class="error">Sila masukkan 12 digit No. KP / MyKid.</div>';

return;

}


loading.classList.remove("hidden");


try{

const response =
await fetch(
API_URL +
"?action=search&nokp=" +
encodeURIComponent(nokp)
);

if(!response.ok){
throw new Error("Server error");
}

const data =
await response.json();


loading.classList.add("hidden");


if(!data.success){

message.innerHTML =
'<div class="error">Rekod murid tidak dijumpai.</div>';

return;

}


document.getElementById("nama").textContent =
data.nama || "-";

document.getElementById("kelas").textContent =
data.kelas || "-";

document.getElementById("delima").textContent =
data.delima || "-";


currentPassword =
data.password || "";


document.getElementById("password").textContent =
"••••••••";


passwordVisible = false;


result.classList.remove("hidden");


}catch(error){

loading.classList.add("hidden");

message.innerHTML =
'<div class="error">Tidak dapat menghubungi sistem. Sila cuba lagi.</div>';

console.error(error);

}

}


function togglePassword(){

const password =
document.getElementById("password");


passwordVisible =
!passwordVisible;


if(passwordVisible){

password.textContent =
currentPassword || "-";

}else{

password.textContent =
"••••••••";

}

}


async function copyText(id){

const text =
document.getElementById(id).textContent;

try{

await navigator.clipboard.writeText(text);

alert("ID DELIMa telah disalin.");

}catch{

alert("Tidak dapat menyalin.");

}

}


async function copyPassword(){

if(!currentPassword){
return;
}

try{

await navigator.clipboard.writeText(
currentPassword
);

alert("Kata laluan telah disalin.");

}catch{

alert("Tidak dapat menyalin.");

}

}


function showTutorial(){

document
.getElementById("tutorial")
.classList.toggle("hidden");

document
.getElementById("help")
.classList.add("hidden");

}


function showHelp(){

document
.getElementById("help")
.classList.toggle("hidden");

document
.getElementById("tutorial")
.classList.add("hidden");

}


document
.getElementById("nokp")
.addEventListener(
"keydown",
function(event){

if(event.key === "Enter"){
cariDelima();
}

});
