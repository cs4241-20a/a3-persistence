window.onload = fillItems;

let storeItems = [{img: , imgAlt: , name: , price: }]

function fillItems(){
    let itemsBar = document.getElementById('items');
    storeItems.forEach(function(item){
        let root = document.createElement("div");
        let img = document.createElement("img");
        let title = document.createElement("p");
        let price = document.createElement("p");
        title.innerText = item.name;
        price.innerText = item.price;
        img.alt = item.imgAlt;
        root.appendChild(img);
        root.appendChild(title);
        root.appendChild(price);
    })
}