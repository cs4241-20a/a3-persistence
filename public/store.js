window.onload = fillItems;

let storeItems = [
  {id: 0, img: "img/githubLogo.png", imgAlt: "imgAlt", name: "test0", price: "000"},
  {id: 1, img: "img/githubLogo.png", imgAlt: "imgAlt", name: "test1", price: "111"},
  {id: 2, img: "img/githubLogo.png", imgAlt: "imgAlt", name: "test2", price: "222"}]
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
      }).then(fillBasket)
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