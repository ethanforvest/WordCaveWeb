const saved = document.querySelector(".saved .saved-container");
const savedExpand = document.querySelector(".saved-expand");

const recent = document.querySelector(".recent .recent-container");
const recentExpand = document.querySelector(".recent-expand");

saved.addEventListener("click", () => {
    savedExpand.classList.toggle("display-expand-block");
});

recent.addEventListener("click", () => {
    recentExpand.classList.toggle("display-expand-block");
});

// Portal

const showButton = document.querySelector(".search-bar-container");
const favDialog = document.getElementById("portal");
const searchBox = document.getElementById("search-input");
const API = "https://define.wrdp.app/";

showButton.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    favDialog.showModal();
    document.body.style.filter = "blur(7px)";
  }
});

favDialog.addEventListener("close", () => {
  document.body.style.filter = "none";
  searchBox.focus();
  resetUI();
});

function resetUI() {
  document.querySelector("#portal .gif").innerHTML = "";
  document.querySelector("#portal .header p").innerHTML = "LOADING";
  document.querySelector("#portal .meaning").innerHTML = "";
  document.querySelector("#portal .examples").innerHTML = "";
  document.querySelectorAll("#portal .player p").forEach(p => p.style.display = "none");
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function assembler(e) {
  if (e.key === "Enter") {
    const userInput = searchBox.value.trim();
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
          
          document.querySelector(".header p").innerHTML = capitalize(userInput);
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

    favDialog.addEventListener("close", () => xhr.abort());
  }
}

showButton.addEventListener("keypress", assembler);

document.addEventListener("click", (e) => {
  const word = document.querySelector(".header p");
  if (favDialog.open) {
    if (e.target === word) {
      favDialog.close();
    }
  }
});
