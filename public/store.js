window.onload = fillItems;

let storeItems = [
  {id: 0, img: "img/item1.png", imgAlt: "firstItem", name: "firstItem", price: "1"},
  {id: 1, img: "img/item2.png", imgAlt: "secondItem", name: "secondItem", price: "2"},
  {id: 2, img: "img/item3.png", imgAlt: "thirdItem", name: "thirdItem", price: "3"}]
let currentBasket = []

function fillItems(){
    fetch( '/currentUser', {
        method:'GET'
      }).then(function(response){
          return response.json();
      }).then(function(json){
        console.log(json);
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
    console.log(el)
    console.log(target)
    console.log(source)
    if (target.id == 'basket'){//putting into basket
      let body = {'newItem': Number(el.id)}
      console.log(body)
      fetch( '/addToBasket', {
        method:'POST',
        body : JSON.stringify( body ),
        headers:{
            "Content-Type": "application/json"
        }
      })
    } else {//remove from basket

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
      price.innerText = item.price;
      img.alt = item.imgAlt;
      root.id = item.id;
      root.appendChild(img);
      root.appendChild(title);
      root.appendChild(price);
      console.log(currentBasket)
      if (currentBasket.indexOf(item.id) == -1){
        itemsBar.appendChild(root);
      } else {
        basketBar.appendChild(root)
      }
  })
}

function logOut(){
  console.log('logout in user side')
  fetch('/logOut', {
    method:'POST'
  }).then(() => {
    window.open('/', "_self");
  })
  
}

function changePassword(){
  console.log('change pass')
  window.open('/passwordChange.html', "_self")
}