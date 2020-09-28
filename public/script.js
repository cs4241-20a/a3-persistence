const pw = document.querySelector("#pw");
const title = document.querySelector("#movie");
const rating = document.querySelector("#rating");
let ul = document.querySelector("#list");
let listtitle = document.querySelector("#listtitle");

function appendNewTitle(title, id) {
  let newListItem = document.createElement("li");
  let text = document.createTextNode(title);
  newListItem.appendChild(text);
  ul.appendChild(newListItem);
}

const submit = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();

  //let list = { title: title.value, rating: rating.value };

  const json = { data: { title: title.value, rating: rating.value } };
  const body = JSON.stringify(json);

  fetch("/submit", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type" : "application/json"
    }
  })
    .then(function(response) {
      // do something with the reponse
      return response.text();
    })
    .then(function(text) {
      const json = JSON.parse(text);
      console.log(json);

      let listtitle = document.querySelector("#listtitle");
      while (listtitle.firstChild) listtitle.removeChild(listtitle.firstChild);

      document
        .querySelector("#listtitle")
        .appendChild(document.createTextNode(json.name + "'s List"));

      let ul = document.querySelector("#list");
      while (ul.firstChild) ul.removeChild(ul.firstChild);

      for (let i = 0; i < json.list.length; i++) {
        let node = document.createElement("LI");
        let textNode = document.createTextNode(json.list[i].title);
        node.appendChild(textNode);
        document.querySelector("#list").appendChild(node);
      }
    });
};

window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;
};
  
  