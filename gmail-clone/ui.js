function trimString(str, max) {
  if (str.length < max) return str;
  return str.slice(0, max) + "...";
}

/*
ekrana maillleri listleyecek fonksiyon
outlet: ekranın hangi kısmını mudahale edecek
data: hangi verileri ekrana basıcaz
*/

export function renderMail(outlet, data) {
  if (!data) return;
  console.log(outlet, data);
  //   herbir mail objesi için bir maili temsil eden html oluştur
  outlet.innerHTML = data
    .map(
      (mail) => `
  <div class="mail" data-id=${mail.id}>
                <div class="left">
                  <input type="checkbox">
                  <i id="star" class="bi bi-star ${
                    mail.started && "star-active"
                  }"></i>
                  <span>${mail.sender}</span>
                </div>
                <div class="right">
                  <p class="message-title">${trimString(mail.title, 20)}</p>
                  <p class="message-desc">${trimString(mail.message, 10)}</p>
                  <p class="message-date">${mail.date}</p>
                  <button id="delete">sil</button>
                </div>
              </div>
  `
    )
    .join(" ");
}

export function showCreateModal(modal, willOpen) {
  modal.style.display = willOpen === true ? "grid" : "none";
}

export function renderCategories(outlet, data, selectedCategory) {
  //eski kategorileri sil
  outlet.innerHTML = "";

  //bize gelen diziyi dönme
  data.forEach((category) => {
    const categoryItem = document.createElement("a");
    // kategory elemanına veri ekleme
    categoryItem.dataset.name = category.title;

    //aktif olan kategoriye active clası ekleme
    categoryItem.className =
      selectedCategory === category.title && "active-category";
    categoryItem.innerHTML = `
    <i class="${category.class}"></i>
    <span>${category.title}</span>
    `;
    outlet.appendChild(categoryItem);
  });
}
