window.onload = function () {
  let submit = document.getElementById("submit");
  let error = document.getElementById('error')
  submit.addEventListener("click", addItem);

  fetch("/api/getData")
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      console.log(json)
      if(!json.error) {
        loadItems(json)
      } else {
        error.innerText = json.error
      }
    });

};

function loadItems(items) {
  let cards = document.getElementById('cards')

  cards.innerHTML = ''

  items.map((i) => {
    let block = document.createElement('blockquote')
    let strong = document.createElement('strong')
    let br1 = document.createElement('br')
    let br2 = document.createElement('br')
    let del = document.createElement('button')

    del.innerText = 'X'
    del.classList.add('red')
    del.addEventListener('click',() => {
      console.log(`Deleting ${i._id}`)
      deleteItem(i._id)
    })


    strong.append(`${i.title}  `,del)
    block.append(strong,br1,br2,i.description)
    
    cards.appendChild(block)
    
  });
}

function addItem() {
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let error = document.getElementById("error");

  console.log(title.value)
  console.log(description.value)

  if (title.value === 0|| description.value.length === 0) {
    error.innerText = "Fill out Fields";
    return;
  }

  fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title.value, 
      description: description.value
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      title.value = ''
      description.value = ''
      loadItems(json)
    });
}

function deleteItem(_id) {
  fetch("/remove", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id }),
  })
    .then((res) => res.json())
    .then((json) => loadItems(json));
}
