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
  resetUI();
});

function resetUI() {
  document.querySelector(".gif").innerHTML = "";
  document.querySelector(".header p").innerHTML = "LOADING";
  document.querySelector(".meaning").innerHTML = "";
  document.querySelector(".examples").innerHTML = "";
  document.querySelectorAll(".player p").forEach(p => p.style.display = "none");
}

function assembler() {
  const userInput = searchBox.value;
  const searchQuery = API + userInput;
  const xhr = new XMLHttpRequest();

  xhr.open("GET", searchQuery);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const response = JSON.parse(this.responseText).Senses[0];
        const definition = document.createElement('li');
        definition.innerHTML = response.Definition;
        const examples = document.createElement('li');
        examples.innerHTML = response.Examples;
        
        document.querySelector(".header p").innerHTML = userInput;
        document.querySelectorAll(".player p")
          .forEach(p => p.style.display = "block");
        document.querySelector(".meaning").appendChild(definition);
        document.querySelector(".examples").appendChild(examples);

        const defId = response.ID;

        fetch(`https://word-images.cdn-wordup.com/opt/${userInput}/selected.json`)
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            const media =  res[defId];
            const gifImg = document.createElement('img');
            gifImg.setAttribute("src", media);
            document.querySelector('.gif').appendChild(gifImg);
          })
          .catch((err) => console.log(err, "Couldn't Load the Media"));

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
