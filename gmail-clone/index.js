import { months, categories } from "./constant.js";
import { renderMail, showCreateModal, renderCategories } from "./ui.js";

const strMailData = localStorage.getItem("data");

// const mailData = JSON.parse(strMailData);
const mailData = JSON.parse(strMailData) || [];

const hamburgerMenu = document.querySelector(".menu");
const navigation = document.querySelector("nav");
const mailsArea = document.querySelector(".mails-area");
const createMailBtn = document.querySelector(".create-mail");
const modal = document.querySelector(".modal-wrapper");
const closeBtn = document.querySelector("#close-id");
const form = document.querySelector("#create-mail-form");
const btn = document.querySelector("#send-mail-btn");
const categoryArea = document.querySelector("nav .middle");
const searchButton = document.querySelector("#search-icon");
const searchİnput = document.querySelector("#search-input");

//handle menuye parantez açarsam handle menuyu sürekli çalıştırır
hamburgerMenu.addEventListener("click", handleMenu);

searchButton.addEventListener("click", searchMails);

document.addEventListener("DOMContentLoaded", () => {
  renderCategories(categoryArea, categories, "Gelen Kutusu");
  renderMail(mailsArea, mailData);
  if (window.innerWidth < 1100) {
    navigation.classList.toggle("hide");
  }
});
window.addEventListener("resize", (e) => {
  const width = e.target.innerWidth;
  if (width < 1100) {
    navigation.classList.toggle("hide");
  } else {
    navigation.classList.remove("hide");
  }
});
createMailBtn.addEventListener("click", () => showCreateModal(modal, true));
closeBtn.addEventListener("click", () => showCreateModal(modal, false));
mailsArea.addEventListener("click", updateMail);

categoryArea.addEventListener("click", watchCategory);

// menüyü açıp kapamaya yarıyacak fonksiyon
function handleMenu() {
  // classList.toogle():
  // ona parametre olarak  verdiğimiz class yoksa ekler varsa çıkarır
  navigation.classList.toggle("hide");
}
function getDate() {
  const dateArr = new Date().toLocaleDateString().split("/");
  const day = dateArr[0];
  const monthNumber = dateArr[1];

  const month = months[monthNumber - 1];
  return [day, month].join(" ");
}
// Modalın dışına tıklandığında modalı kapatma
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    showCreateModal(modal, false);
    clearFormInputs();
  }
});
// Gönder butonuna tıklanınca işlemleri yap
btn.addEventListener("click", (e) => {
  e.preventDefault();
  const receiver = form[0].value;
  const title = form[1].value;
  const message = form[2].value;
  if (!receiver || !title || !message) {
    return Toastify({
      text: "This is a toast",
      duration: 1000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  }

  // Yeni mail oluşturma işlemi
  const newMail = {
    id: new Date().getTime(),
    sender: "alpay",
    receiver,
    started: false,
    title,
    message,
    date: getDate(),
  };

  // Maili ekleme işlemi
  mailData.unshift(newMail);

  // veri tabanında (localstoragede) güncelle
  const strData = JSON.stringify(mailData);
  // local storageye gönderme

  localStorage.setItem("data", strData);

  // Ekranı güncelleme
  renderMail(mailsArea, mailData);

  // Modalı kapatma
  showCreateModal(modal, false);
  clearFormInputs();

  Toastify({
    text: "Form Başarıyla Gönderildi",
    duration: 1000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
});
function clearFormInputs() {
  form[0].value = "";
  form[1].value = "";
  form[2].value = "";
}

// html tarafında silme işlemi
// soru peki neden buttonu çekip silme yapmadık çünki javascript bize doğrudan kullanım vermiyor
function updateMail(e) {
  const mail = e.target.parentElement.parentElement;

  const mailId = mail.dataset.id;
  if (e.target.id === "delete") {
    const filtered = mailData.filter((i) => i.id != mailId);

    mailData.splice(filtered, 1);

    const strData = JSON.stringify(mailData);

    localStorage.setItem("data", strData);

    //      htmlde silme
    mail.remove();
  }
  if (e.target.id === "star") {
    const finder = mailData.find((i) => i.id == mailId);
    // bulduğumuz elemanı dize güncelleme start değerinide terse çevirme

    const updated = { ...finder, started: !finder.started };

    // güncellenek elemanın sırasını bulma

    const index = mailData.findIndex((i) => i.id == mailId);

    // dizideki elemanı güncelleme
    mailData[index] = updated;

    // güncel diziyi local storagea hazırla
    // local storage güncelleme
    localStorage.setItem("data", JSON.stringify(mailData));

    // html güncelleme
    renderMail(mailsArea, mailData);
  }
}

// categoryleri izleyip değiştireceğizim fonk

function watchCategory(e) {
  const selectedCategory = e.target.dataset.name;
  // navigasyon alanını güncelleme
  renderCategories(categoryArea, categories, selectedCategory);

  if (selectedCategory === "Yıldızlı") {
    const filtered = mailData.filter((i) => i.started === true);
    // seçtiklerimizi ekrana basma
    renderMail(mailsArea, filtered);
    return;
  }
  renderMail(mailsArea, mailData);
}
//mail arama
function searchMails() {
  const filtred = mailData.filter((i) => i.message.includes(searchİnput.value));

  renderMail(mailsArea, filtred);
}

/*
elemanın başına birşey eklemek istiyosak unshift
slimek istiyosak diziyi  slice filter 
remove silmek için

spred dağıtma işlemi (...)
güncellemek için index numrası ile

*/
