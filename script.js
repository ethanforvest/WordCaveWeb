const showButton = document.querySelector(".search-btn");
const favDialog = document.getElementById("portal");
const searchBox = document.getElementById("input");
const API = "https://define.wrdp.app/";

showButton.addEventListener("click", () => {
  favDialog.showModal();
  document.body.style.filter = "blur(7px)";
});

favDialog.addEventListener("close", () => {
  document.body.style.filter = "none";
  searchBox.focus();
});

function assembler() {
  const userInput = searchBox.value;
  const searchQuery = API + userInput;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", searchQuery);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const response = JSON.parse(this.responseText).Senses[0];
        document.querySelector(".header p").innerHTML = userInput;
        document.querySelector(".meaning li").innerHTML = response.Definition;
        document.querySelector(".examples li").innerHTML = response.Examples;
      } else {
        console.log("Something went wrong!");
      }
    }
  };
  xhr.send();
}

showButton.addEventListener("click", assembler);

document.addEventListener("click", (e) => {
  const word = document.querySelector(".header p");
  if (favDialog.open) {
    if (e.target === word) {
      favDialog.close();
    }
  }
});
