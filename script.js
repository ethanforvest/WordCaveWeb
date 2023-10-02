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
const API = "https://wordcave.vercel.app/wordcave/word/define/";

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
  document.querySelector("#portal .header p").innerHTML = `<img data-src="./img/Spinner.svg" class="lazyload">`;
  document.querySelector("#portal .meaning").innerHTML = "";
  document.querySelector("#portal .examples").innerHTML = "";
  document.querySelectorAll("#portal .player p").forEach(p => p.style.display = "none");
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function isMp4(URL) {
  return URL.includes("mp4");
}

function getDate() {
  let date = new Date();
  let month = date.getMonth();

  switch (month) {
    case 0:
      month = "Jan";
      break;
    case 1:
      month = "Feb";
      break;
    case 2:
      month = "March";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case 7:
      month = "Aug";
      break;
    case 8:
      month = "Sep";
      break;
    case 9:
      month = "Oct";
      break;
    case 10:
      month = "Nov";
      break;
    case 11:
      month = "Dec";
      break;
  }
    
  return `${month}, ${date.getDate()}`;
}

function addRecent(word) {
  const FormartedDate = getDate();
  const orderedList = document.querySelector(".recent-expand ol")
  const recentWord = document.createElement("li");
  recentWord.innerHTML = `${word}`;
  const dateHolder = document.createElement("p");
  dateHolder.innerHTML = FormartedDate;

  recentWord.appendChild(dateHolder);

  if (!orderedList) {
    const newOrderedList = document.createElement("ol")
    newOrderedList.prepend(recentWord);

    document.querySelector(".recent-container .recent-expand")
      .appendChild(newOrderedList);
  } else {
    orderedList.prepend(recentWord);
  }
}

function mp4Append(URL) {
  const mp4Video = document.createElement("video");
  mp4Video.setAttribute("autoplay", "");
  mp4Video.setAttribute("muted", "");
  mp4Video.setAttribute("loop", "");
  const mp4Source = document.createElement("source");
  mp4Source.setAttribute("src", URL);
  mp4Source.setAttribute("type", "video/mp4");
  const support = document.createTextNode("Your browser does not support video tag");

  mp4Video.appendChild(mp4Source);
  mp4Video.appendChild(support);
  
  document.querySelector(".gif").appendChild(mp4Video);
}

function gifAppend(URL) {
  const gifImg = document.createElement("img");
  gifImg.setAttribute("data-src", URL);
  gifImg.classList.add("lazyload");
  document.querySelector(".gif").appendChild(gifImg);
}

function assembler(e) {
  if (e.key === "Enter") {
    let userInput = searchBox.value.trim().toLowerCase();
    const searchQuery = API + userInput;
    const xhr = new XMLHttpRequest();

    xhr.open("GET", searchQuery);
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          if (JSON.parse(this.responseText) === "Word not Found or Something went wrong!") {
            document.querySelector("#portal .header p").innerHTML = "We could not find the word in our servers!";
            return;
          }
          userInput = capitalize(userInput);
          addRecent(userInput);
          const response = JSON.parse(this.responseText).Definition.Senses[0];
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
          const media = JSON.parse(this.responseText).Media[defId];

          if (media === undefined) {
            console.log("Media not found!");
          } else if (!media.includes("https")) {
            if (media.includes("opt")) {
              const mediaBase = `https://word-images.cdn-wordup.com/${media}`;
              isMp4(mediaBase) ? mp4Append(mediaBase) : gifAppend(mediaBase);
            } else {
              const mediaBase = `https://word-images.cdn-wordup.com/opt/${media}`;
              isMp4(mediaBase) ? mp4Append(mediaBase) : gifAppend(mediaBase);
            }
          } else {
            isMp4(media) ? mp4Append(media) : gifAppend(media);
         }

        } else {
          console.log("Something went wrong!");
        }
      }
    };

    xhr.send();
    
    xhr.onerror = () => {
      document.querySelector("#portal .header p").innerHTML = "Try Again!";
    };

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
