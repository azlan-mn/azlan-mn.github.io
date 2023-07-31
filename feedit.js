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
  url += "?timestamp=" + Date.now()
  postData(url, { "action": "get", }).then((data) => {
    console.log(data, url)
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

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
    ].join(':')
  );
}

function addUserOld() {
  var newName = document.getElementById("newUser");
  if (newName.value.length == 0) return;
  var ul = document.getElementById("users");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(newName.value));
  ul.appendChild(li);
  newName.value = "";
}

function addUser() {
  var userNameElement = document.getElementById("newUser");
  if (userNameElement.value.length == 0) return;
  people = {};
  people[userNameElement.value] = {};
  userNameElement.value = "";
  var url = document.getElementById("datasrc").value;
  postData(url, { "action": "set", "data": { "people": people } }).then((data) => {
    loadData();
  });
}

function addPet() {
  var freq = "1";
  var petName = document.getElementById("newPet");
  if (petName.value.length == 0) return;
  var ele = document.getElementsByName("frequency");
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      freq = ele[i].value;
      break;
    }
  }
  payload = {};
  payload[petName.value] = { "frequency": freq };
  petName.value = "";
  var url = document.getElementById("datasrc").value;
  postData(url, { "action": "set", "data": {"pets": payload} }).then((data) => {
    loadData();
  });
}

function addUserToList(user) {
  var ul = document.getElementById("users");
  var li = document.createElement("li");
  var anchor = document.createElement("a")
  anchor.appendChild(document.createTextNode(" ❌ "))
  anchor.onclick = function () {
    deleteData({"people": { [user] : null}})
  };
  li.appendChild(document.createTextNode(user));
  li.appendChild(anchor);
  ul.appendChild(li);
}

function addPetToList(pet) {
  console.log(pet.name, pet.last_fed, pet.last_fed_by)
  var petList = document.getElementById("pets");
  var section = document.createElement("section");
  var article = document.createElement("article");
  var header = document.createElement("header");
  var p1 = document.createElement("p");
  var p2 = document.createElement("p");
  var p3 = document.createElement("p");
  var button = document.createElement("button");
  var anchor = document.createElement("a")
  anchor.appendChild(document.createTextNode(" ❌ "))
  anchor.onclick = function () {
    deleteData({"pets": { [pet.name]: null }})
  };

  button.classList.add('pure-button');
  button.appendChild(document.createTextNode("Feed"));
  button.addEventListener('click', () => { alert(pet.name); });
  header.appendChild(document.createTextNode(pet.name));
  header.appendChild(anchor);
  if (pet.last_fed_by == undefined || pet.last_fed == undefined) {
    pDate = "None";
    pet.last_fed_by = "None";
  }
  else {
    pDate = new Date(0);
    pDate.setUTCSeconds(pet.last_fed);
    pDate = formatDate(pDate);
  }
  p1.appendChild(document.createTextNode("Last fed on: " + pDate));
  p2.appendChild(document.createTextNode("Last fed by: " + pet.last_fed_by));

  var now = new Date();
  var nextFeed = new Date();
  nextFeed.setHours(freq);
  nextFeed.setMinutes(0);
  nextFeed.setSeconds(0);

  var freq = Math.floor(24 / pet.frequency);
  console.log(freq)
  while (nextFeed.getHours() > freq) {
    freq += Math.floor(24 / pet.frequency)
  }
  pDate = nextFeed.toDateString();
  p3.appendChild(document.createTextNode("Next feeding: " + pDate));

  article.appendChild(header);
  article.appendChild(p1);
  article.appendChild(p2);
  article.appendChild(p3);
  article.appendChild(button);
  section.appendChild(article);
  petList.appendChild(section);
}

function deleteData(data) {
  console.log(data);
  var url = document.getElementById("datasrc").value;
  postData(url, { "action": "del", "data": data }).then((data) => {
    loadData();
  });
}

function notifyDelay(delayDuration, message) {
  if (Notification.permission != "granted") {
    Notification.requestPermission().then((result) => {console.log(result);});
  }
  setTimeout(function () { notify(message);}, delayDuration * 1000);
}

function notify(message) {
  var title = "FeedIt notification";
  var icon = "./favicon.png";
  var body = message;
  var notification = new Notification(title, { body, icon });
}

function heartbeat() {}

loadData();
