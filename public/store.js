window.onload = fillItems;

let storeItems = [
  {id: 0, img: "img/item1.png", imgAlt: "First Item", name: "First Item", price: "1"},
  {id: 1, img: "img/item2.png", imgAlt: "Second Item", name: "Second Item", price: "2"},
  {id: 2, img: "img/item3.png", imgAlt: "Third Item", name: "Third Item", price: "3"}]
let currentBasket = []

function fillItems(){
    fetch( '/currentUser', {
        method:'GET'
      }).then(function(response){
          return response.json();
      }).then(function(json){
        let welcome = document.getElementById('welcomeText');
        welcome.innerText = `Hello ${json.username}`;
        currentBasket = json.basket
      }).then(fillBasket);
    document.getElementById('changePass').onclick = changePassword;
    document.getElementById('logOut').onclick = logOut;
    addDragula();
}

function addDragula(){
  dragula([document.getElementById('items'), document.getElementById('basket')])
  .on('drop', function(el, target, source){
    if (target.id == 'basket'){//putting into basket
      let body = {'newItem': Number(el.id)}
      fetch( '/addToBasket', {
        method:'POST',
        body : JSON.stringify( body ),
        headers:{
            "Content-Type": "application/json"
        }
      })
    } else {//remove from basket
      let body = {'newItem': Number(el.id)}
      fetch( '/removeFromBasket', {
        method:'POST',
        body : JSON.stringify( body ),
        headers:{
            "Content-Type": "application/json"
        }
      })
    }
  });
}

function fillBasket(){
  let itemsBar = document.getElementById('items');
  let basketBar = document.getElementById('basket');
  storeItems.forEach(function(item){
      let root = document.createElement("div");
      root.classList.add('has-text-centered')
      let img = document.createElement("img");
      let title = document.createElement("p");
      let price = document.createElement("p");
      img.src = item.img;
      title.innerText = item.name;
      price.innerText = `Price: $${item.price}`;
      img.alt = item.imgAlt;
      root.id = item.id;
      root.appendChild(img);
      root.appendChild(title);
      root.appendChild(price);
      if (currentBasket.indexOf(item.id) == -1){
        itemsBar.appendChild(root);
      } else {
        basketBar.appendChild(root)
      }
  })
}

function logOut(){
  fetch('/logOut', {
    method:'POST'
  }).then(() => {
    window.open('/', "_self");
  })
  
}

function changePassword(){
  window.open('/passwordChange.html', "_self")
}