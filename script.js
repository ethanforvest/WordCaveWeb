const showButton = document.querySelector(".search-btn");
const favDialog = document.getElementById("portal");
const searchBox = document.getElementById('input');

showButton.addEventListener("click", () => {
  favDialog.showModal();
  document.body.style.filter = 'blur(7px)';
});

favDialog.addEventListener('close', () => {
  document.body.style.filter = 'none';
  searchBox.focus();
});

document.addEventListener('click', (e) => {
  const word = document.querySelector('.header p')
  if (favDialog.open) {
    if (e.target === word) {
      favDialog.close();
    }
  }
});
