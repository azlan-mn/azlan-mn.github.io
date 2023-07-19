const delay = ms => new Promise(res => setTimeout(res, ms));

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    headers: { "Content-Type": "application/json" },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}

function loadData() {
  var url = document.getElementById("datasrc").value;
  postData(url, { action: 'get', }).then((data) => {
    var users = document.getElementById("users");
    var pets = document.getElementById("pets");
    users.innerHTML = "";
    pets.innerHTML = "";

    for (var user in data["people"]) {
      addUserToList(user);
    }

    for (var pet in data["pets"]) {
      petInfo = data["pets"][pet];
      petInfo["name"] = pet;
      addPetToList(petInfo);
    }
  });
}

function addUser() {
  var newName = document.getElementById("newUser");
  if (newName.value.length == 0) return;
  var ul = document.getElementById("users");
  var li = document.createElement('li');
  li.appendChild(document.createTextNode(newName.value));
  ul.appendChild(li);
  newName.value = "";
}

function addPet() {
  var freq = "1";
  var petName = document.getElementById("newPet");
  var ele = document.getElementsByName('frequency');
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      freq = ele[i].value;
      break;
    }
  }
  var url = document.getElementById("datasrc").value;
  postData(url, { action: 'set', "pets": { "name": petName.value, "frequency": freq } }).then((data) => {
    loadData();
    petName.value = "";
  });
}

function addUserToList(user) {
  var ul = document.getElementById("users");
  var li = document.createElement('li');
  li.appendChild(document.createTextNode(user));
  ul.appendChild(li);
}

function addPetToList(pet) {
  var petList = document.getElementById("pets");
  var section = document.createElement('section');
  var article = document.createElement('article');
  var header = document.createElement('header');
  header.appendChild(document.createTextNode(pet.name));
  article.appendChild(header);
  section.appendChild(article);
  petList.appendChild(section);
}

function notifyDelay(delayDuration, message) {
  if (Notification.permission != 'granted') {
    Notification.requestPermission().then((result) => {console.log(result);});
  }
  setTimeout(function () { notify(message);}, delayDuration * 1000);
}

function notify(message) {
  var title = "FeedIt notification";
  var icon = './favicon.png';
  var body = message;
  var notification = new Notification(title, { body, icon });
}

loadData();
