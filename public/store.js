window.onload = fillItems;

let storeItems = [{img: "img/githubLogo.png", imgAlt: "imgAlt", name: "test", price: "111"}]

function fillItems(){
    fetch( '/currentUser', {
        method:'GET'
      }).then(function(response){
          return response.json();
      }).then(function(json){
        console.log(json);
        let welcome = document.getElementById('welcomeText');
        welcome.innerText = `Hello ${json.username}`;
      })
    dragula([document.getElementById('items'), document.getElementById('basket')]);
    let itemsBar = document.getElementById('items');
    storeItems.forEach(function(item){
        let root = document.createElement("div");
        let img = document.createElement("img");
        let title = document.createElement("p");
        let price = document.createElement("p");
        img.src = item.img;
        title.innerText = item.name;
        price.innerText = item.price;
        img.alt = item.imgAlt;
        root.appendChild(img);
        root.appendChild(title);
        root.appendChild(price);
        itemsBar.appendChild(root);
    })
}